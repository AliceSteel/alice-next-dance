'use server';
import db from "@/app/actions/db";
import { redirect } from "next/navigation";
import type { ScheduleResponse } from "@/types/ScheduleItem";
import { zodProductSchema, zodInstructorSchema, zodImageSchema, validateWithZod } from "@/helpers/zodSchema";
import { deleteImage, uploadImageToSupabase } from "@/app/actions/supabase";
import type { ContentDataForEditPage } from "@/types/ContentDataForEditPage";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { BasketItem } from "@/types/basketItemTypes";

/* LOAD PAGE CONTENT------------------------------------------------------------- */
export const fetchProducts = () => {
  return db.product.findMany({orderBy: { price: "asc" }});
}

export const fetchPassesTitleRecord = async() => {
   const row = await db.passesTitle.findFirst();
  return row?.title ?? "Memberships";
}

export const fetchBtnTitleRecord = async() => {
  const row = await db.purchaseButtonTitle.findFirst();
  return row?.title ?? "Purchase";
}

export const fetchClasses = async() => {
  return await db.class.findMany();
}

export const fetchSingleClass = async (slug: string) => {
  const danceClass = await db.class.findUnique({ where: { slug } });
  if (!danceClass) {
    redirect("/classes?error=classnotfound");
  }
  return danceClass;
}

export const fetchAllInstructors = async () => {
  return await db.instructor.findMany();
}


export const fetchSchedule = async (): Promise<ScheduleResponse["weeks"]> => {
  const weeks = await db.week.findMany({
    orderBy: { id: "asc" },
    include: { entries: true },
  });

  return weeks.map((week) => ({
    id: week.id,
    label: week.label,
    startDate: week.startDate,
    days: week.days,
    entries: week.entries.map((entry) => ({
      id: entry.entryId,           
      day: entry.day,
      timeSlot: entry.timeSlot as any, 
      classId: entry.classId,
      label: entry.label ?? undefined,
      teacher: entry.teacher ?? undefined,
    })),
  }));
};

/* CREATE PAGE ACTIONS------------------------------------------------------------- */
export const createProduct = async (prevState: any, formData: FormData):Promise<{errorMessage?: string; successMessage?: string}> => {
 try {
  const rawData = Object.fromEntries(formData.entries());
  const { terms1, terms2, terms3, ...rest } = rawData;
  const terms = [terms1, terms2, terms3].filter((term): term is string => typeof term === "string" && term.trim() !== "",);

  const validatedData = zodProductSchema.safeParse({ ...rest, terms });

  if (!validatedData.success) {
    const errors= validatedData.error.issues.map(err => err.message).join(", ")
    throw new Error(`Validation failed: ${errors}`);
  }

  await db.product.create({
    data: validatedData.data,
  });
  //  return { successMessage: "Product is created!" }; - alternative to redirect to edit page where we see the product we created
 }
  catch (error) {
    console.log("Error creating product:", error);
    return { errorMessage: error instanceof Error ? error.message : "An unknown error occurred" };
  }
  redirect("/admin/edit?success=productcreated");
};

export const createInstructor = async (prevState: any, formData: FormData):Promise<{errorMessage?: string; successMessage?: string}> => {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { image, bio1, bio2, bio3, ...rest } = rawData;

    const bioLines = [bio1, bio2, bio3].filter((line): line is string => typeof line === "string" && line.trim() !== "",);
  
    const validatedData = validateWithZod(zodInstructorSchema, { ...rest, bioLines });
    const validatedImage = validateWithZod(zodImageSchema, { image });

    const imagePath = await uploadImageToSupabase(validatedImage.image);

  await db.instructor.create({
    data: {
      slug: validatedData.slug,
      name: validatedData.name,
      bioLines: validatedData.bioLines,
      image: imagePath,
      instagram: validatedData.instagram,
      youTube: validatedData.youTube,
  }
  });
 }
  catch (error) {
    console.log("Error creating instructor:", error);
    return { errorMessage: error instanceof Error ? error.message : "An unknown error occurred" };
  }

  redirect("/admin/edit?success=instructorcreated");
};

/* EDIT PAGE ACTIONS------------------------------------------------------------- */
export const fetchAdminContentToEdit: () => Promise<ContentDataForEditPage> = async () => {
  const [products, classes, instructors, passesTitle, purchaseBtnTitle] = await Promise.all([
    db.product.findMany({ orderBy: { price: "asc" } }),
    db.class.findMany(),
    db.instructor.findMany(),
    db.passesTitle.findFirst(),
    db.purchaseButtonTitle.findFirst(),
  ]);

  return { 
    products, classes, instructors,  
    passesTitle: { title: passesTitle?.title ?? "[No Title]" },
    purchaseBtnTitle: { title: purchaseBtnTitle?.title ?? "[No Title]" }
  } as ContentDataForEditPage;
};

export const deleteRecord = async (prevState: any, formData: FormData) => {
  const productId = Number(formData.get("id"));
  const contentTable = formData.get("contentTitle");
  let imageRecord = '';

  try {
   switch (contentTable) {
      case "products":
      const productRecord = await db.product.delete({ where: { id: productId } });
        break;
      case "instructors":
        const instructorRecord = await db.instructor.delete({ where: { id: productId } });
        imageRecord = instructorRecord?.image ?? '';
        break;
      case "classes":
        const classRecord = await db.class.delete({ where: { id: productId } });
        imageRecord = classRecord?.imageUrl ?? '';
        break;
      default:
        return { errorMessage: `Unknown content type: ${contentTable}` };
    }

   imageRecord ? await deleteImage(imageRecord) : null;
    //revalidatePath("/admin/edit"); - alternative to redirecting
    //return { successMessage: "Record deleted successfully!" };
  } catch (error) {
    console.log("Error deleting product:", error);
    return { errorMessage: error instanceof Error ? error.message : "An unknown error occurred" };
  }
  redirect("/admin/edit?success=recorddeleted");
}

async function replaceImage(formData: FormData, fieldName: string, oldImageUrl: string | null): Promise<string | undefined> {
  const imageFile = formData.get(fieldName);
  if (!(imageFile instanceof File) || imageFile.size === 0) return undefined;
  const validatedImage = validateWithZod(zodImageSchema, { image: imageFile });
  if (oldImageUrl) await deleteImage(oldImageUrl);
  return uploadImageToSupabase(validatedImage.image);
}

export const editContent = async (prevState: any, formData: FormData) => {
  const contentTitle = formData.get("contentTitle") as string;
  const id = Number(formData.get("id"));
  try{ 
  
   switch (contentTitle) {

      case "products": {
        const { name, price, terms } = Object.fromEntries(formData.entries()) as any;
        const termsArr = String(terms).split('\n').map((t: string) => t.trim()).filter(Boolean);
        const validated = zodProductSchema.safeParse({ name, price, terms: termsArr });

        if (!validated.success) throw new Error(validated.error.issues.map(i => i.message).join(", "));

        await db.product.update({ where: { id }, data: validated.data });
        break;
      }

      case "classes": {
        const { slug, title, description } = Object.fromEntries(formData.entries()) as any;
        const existing = await db.class.findUnique({ where: { id }, select: { imageUrl: true } });
        const imageUrl = await replaceImage(formData, "imageUrl", existing?.imageUrl ?? null);
        
        await db.class.update({ where: { id }, data: { slug, title, description, ...(imageUrl && { imageUrl }) } });
        break;
      }
      case "instructors": {
        const { slug, name, instagram, youTube, bioLines } = Object.fromEntries(formData.entries()) as any;
        const bioLinesArr = String(bioLines).split('\n').map((l: string) => l.trim()).filter(Boolean);
        const validated = validateWithZod(zodInstructorSchema, { slug, name, instagram, youTube, bioLines: bioLinesArr });

        const existing = await db.instructor.findUnique({ where: { id }, select: { image: true } });
        const image = await replaceImage(formData, "image", existing?.image ?? null);

        await db.instructor.update({ where: { id }, data: { ...validated, ...(image && { image }) } });        
        break;
      }

      case "passesTitle": {
        const title = formData.get("title") as string;
        await db.passesTitle.upsert({
          where: { title: (await db.passesTitle.findFirst())?.title ?? "" },
          update: { title },
          create: { title },
        });
        break;
      }

    case "purchaseBtnTitle": {
      const title = formData.get("title") as string;
      await db.purchaseButtonTitle.upsert({
        where: { title: (await db.purchaseButtonTitle.findFirst())?.title ?? "" },
        update: { title },
        create: { title },
      });
      break;
    }
      default:
        return { errorMessage: `Unknown content type: ${contentTitle}` };
    }
    revalidatePath('/admin/edit');
    return { successMessage: "Record edited successfully!" };
  }
  catch (error) {
    console.log("Error editing content:", error);
    return { errorMessage: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

/* ORDER ACTIONS---------------------------------------------------------- */
export const createOrder = async (basketItems: BasketItem[], total: number)  => {
  const user = await currentUser();
  let orderId: null | string = null;

  if (!user) throw new Error("User not authenticated");
  try {
    const clerkId = user.id;

    const order = await db.order.create({
      data: {
        clerkId,
        orderTotalPrice: total, 
        qtyItemsInOrder: basketItems.reduce((sum, item) => sum + item.quantity, 0),
        status: "pending",
        orderItems: {
          create: basketItems.map((item: BasketItem) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      }});

    orderId = order.orderId;

  } catch (error) {
    console.log("Error creating order:", error);
    return { errorMessage: error instanceof Error ? error.message : "An unknown error occurred" };    
  }
  redirect("/checkout?orderId=" + orderId);
}

export const fetchUserOrders = async () => {
      
  try {

    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");

    const orders = await db.order.findMany({
        where: { clerkId: user?.id },
        orderBy: { createdAt: "desc" },
        include: { orderItems: { include: { product: true } } },
      });
    return orders;
      
  } catch (error) {
    console.log("Error fetching orders:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
  }
}

export const fetchAllOrders = async () => {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { orderItems: { include: { product: true } } },
    });
    return orders;
  } catch (error) {
    console.log("Error fetching all orders:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
  }
}

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    await db.order.update({
      where: { orderId },
      data: { status: newStatus },
    });
  } catch (error) {
    console.log("Error updating order status:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
  }
}

