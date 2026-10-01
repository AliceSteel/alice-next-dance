"use server";
import db from "@/app/actions/db";
import { DateTime } from "luxon";
import type { BookableScheduleWeek, Day } from "@/types/ScheduleItem";
import { redirect } from "next/navigation";
import {
  zodProductSchema,
  zodInstructorSchema,
  zodImageSchema,
  validateWithZod,
} from "@/helpers/zodSchema";
import { deleteImage, uploadImageToSupabase } from "@/app/actions/supabase";
import type { ContentDataForEditPage } from "@/types/ContentDataForEditPage";

import { revalidatePath } from "next/cache";
import { ActionFnType } from "@/types/actionFnType";

/* LOAD PAGE CONTENT------------------------------------------------------------- */
export const fetchActiveProducts = () => {
  return db.product.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
};

export const fetchPassesTitleRecord = async () => {
  const row = await db.passesTitle.findFirst();
  return row?.title ?? "Memberships";
};

export const fetchBtnTitleRecord = async () => {
  const row = await db.purchaseButtonTitle.findFirst();
  return row?.title ?? "Purchase";
};

export const fetchClasses = async () => {
  return await db.class.findMany();
};

export const fetchSingleClass = async (slug: string) => {
  const danceClass = await db.class.findUnique({ where: { slug } });
  if (!danceClass) {
    redirect("/classes?error=classnotfound");
  }
  return danceClass;
};

export const fetchAllInstructors = async () => {
  return await db.instructor.findMany();
};

const STUDIO_TIMEZONE = "Europe/Copenhagen";
const DAY_BY_LUXON_WEEKDAY: Record<number, Day> = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

export const fetchSchedule = async (): Promise<BookableScheduleWeek[]> => {
  const now = DateTime.now().setZone(STUDIO_TIMEZONE);
  const horizon = now.plus({ weeks: 8 });

  const sessions = await db.classSession.findMany({
    where: {
      startsAt: {
        gte: now.toUTC().toJSDate(),
        lte: horizon.toUTC().toJSDate(),
      },
    },
    include: {
      template: {
        include: {
          danceClass: true,
          instructor: true,
        },
      },
    },
    orderBy: { startsAt: "asc" },
  });

  const weeks = new Map<string, BookableScheduleWeek>();

  for (const session of sessions) {
    const localStart = DateTime.fromJSDate(session.startsAt, {
      zone: session.template.timezone,
    });
    const weekStart = localStart.startOf("week");
    const weekId = weekStart.toISODate()!;

    let week = weeks.get(weekId);
    if (!week) {
      week = {
        id: weekId,
        label: `Week of ${weekStart.toFormat("LLL d")}`,
        startDate: weekId,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        entries: [],
      };
      weeks.set(weekId, week);
    }

    const localEnd = localStart.plus({
      minutes: session.template.durationMin,
    });

    week.entries.push({
      id: session.id,
      day: DAY_BY_LUXON_WEEKDAY[localStart.weekday],
      timeSlot: `${localStart.toFormat("HH:mm")}-${localEnd.toFormat("HH:mm")}`,
      classId: session.template.classSlug,
      label: session.template.label,
      teacher: session.template.instructor.name,
      startsAt: session.startsAt.toISOString(),
      capacity: session.capacity,
      bookedCount: session.bookedCount,
    });
  }

  return Array.from(weeks.values());
};
/* CREATE PAGE ACTIONS------------------------------------------------------------- */
export const createProduct: ActionFnType = async (
  _prevState,
  formData: FormData,
): Promise<{ errorMessage?: string; successMessage?: string }> => {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { terms1, terms2, terms3, ...rest } = rawData;
    const terms = [terms1, terms2, terms3].filter(
      (term): term is string => typeof term === "string" && term.trim() !== "",
    );

    const validatedData = zodProductSchema.safeParse({ ...rest, terms });

    if (!validatedData.success) {
      const errors = validatedData.error.issues
        .map((err) => err.message)
        .join(", ");
      throw new Error(`Validation failed: ${errors}`);
    }

    await db.product.create({
      data: validatedData.data,
    });
    //  return { successMessage: "Product is created!" }; - alternative to redirect to edit page where we see the product we created
  } catch (error) {
    console.log("Error creating product:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
  redirect("/admin/edit?success=productcreated");
};

export const createInstructor: ActionFnType = async (
  _prevState,
  formData: FormData,
): Promise<{ errorMessage?: string; successMessage?: string }> => {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { image, bio1, bio2, bio3, ...rest } = rawData;

    const bioLines = [bio1, bio2, bio3].filter(
      (line): line is string => typeof line === "string" && line.trim() !== "",
    );

    const validatedData = validateWithZod(zodInstructorSchema, {
      ...rest,
      bioLines,
    });
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
      },
    });
  } catch (error) {
    console.log("Error creating instructor:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }

  redirect("/admin/edit?success=instructorcreated");
};

/* EDIT PAGE ACTIONS------------------------------------------------------------- */
export const fetchAdminContentToEdit: () => Promise<ContentDataForEditPage> =
  async () => {
    const [products, classes, instructors, passesTitle, purchaseBtnTitle] =
      await Promise.all([
        db.product.findMany({ orderBy: { price: "asc" } }),
        db.class.findMany(),
        db.instructor.findMany(),
        db.passesTitle.findFirst(),
        db.purchaseButtonTitle.findFirst(),
      ]);

    return {
      products,
      classes,
      instructors,
      passesTitle: { title: passesTitle?.title ?? "[No Title]" },
      purchaseBtnTitle: { title: purchaseBtnTitle?.title ?? "[No Title]" },
    } as ContentDataForEditPage;
  };

export const archiveRecord: ActionFnType = async (
  _prevState,
  formData: FormData,
) => {
  const productId = Number(formData.get("id"));
  const contentTable = formData.get("contentTitle");
  let imageRecord = "";

  try {
    switch (contentTable) {
      case "products":
        await db.product.update({
          where: { id: productId },
          data: { isActive: false },
        });
        break;
      case "instructors":
        const instructorRecord = await db.instructor.update({
          where: { id: productId },
          data: { isActive: false },
        });
        imageRecord = instructorRecord?.image ?? "";
        break;
      case "classes":
        const classRecord = await db.class.update({
          where: { id: productId },
          data: { isActive: false },
        });
        imageRecord = classRecord?.imageUrl ?? "";
        break;
      default:
        return { errorMessage: `Unknown content type: ${contentTable}` };
    }

    //if (imageRecord) await deleteImage(imageRecord);
  } catch (error) {
    console.log("Error archiving product:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
  revalidatePath("/admin/edit?success=recorddeactivated");
  return { successMessage: "Record archived successfully!" };
};

async function replaceImage(
  formData: FormData,
  fieldName: string,
  oldImageUrl: string | null,
): Promise<string | undefined> {
  const imageFile = formData.get(fieldName);
  if (!(imageFile instanceof File) || imageFile.size === 0) return undefined;
  const validatedImage = validateWithZod(zodImageSchema, { image: imageFile });
  if (oldImageUrl) await deleteImage(oldImageUrl);
  return uploadImageToSupabase(validatedImage.image);
}

export const editContent: ActionFnType = async (
  _prevState,
  formData: FormData,
) => {
  const contentTitle = formData.get("contentTitle") as string;
  const id = Number(formData.get("id"));
  try {
    switch (contentTitle) {
      case "products": {
        const { name, price, terms, validityDays, credits, isActive } =
          Object.fromEntries(formData.entries()) as Record<string, string>;
        const termsArr = String(terms)
          .split("\n")
          .map((t: string) => t.trim())
          .filter(Boolean);
        const validated = zodProductSchema.safeParse({
          name,
          price,
          validityDays,
          credits,
          isActive,
          terms: termsArr,
        });

        if (!validated.success)
          throw new Error(
            validated.error.issues.map((i) => i.message).join(", "),
          );

        await db.product.update({ where: { id }, data: validated.data });
        break;
      }

      case "classes": {
        const { slug, title, description } = Object.fromEntries(
          formData.entries(),
        ) as Record<string, string>;
        const existing = await db.class.findUnique({
          where: { id },
          select: { imageUrl: true },
        });
        const imageUrl = await replaceImage(
          formData,
          "imageUrl",
          existing?.imageUrl ?? null,
        );

        await db.class.update({
          where: { id },
          data: { slug, title, description, ...(imageUrl && { imageUrl }) },
        });
        break;
      }
      case "instructors": {
        const { slug, name, instagram, youTube, bioLines } = Object.fromEntries(
          formData.entries(),
        ) as Record<string, string>;
        const bioLinesArr = String(bioLines)
          .split("\n")
          .map((l: string) => l.trim())
          .filter(Boolean);
        const validated = validateWithZod(zodInstructorSchema, {
          slug,
          name,
          instagram,
          youTube,
          bioLines: bioLinesArr,
        });

        const existing = await db.instructor.findUnique({
          where: { id },
          select: { image: true },
        });
        const image = await replaceImage(
          formData,
          "image",
          existing?.image ?? null,
        );

        await db.instructor.update({
          where: { id },
          data: { ...validated, ...(image && { image }) },
        });
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
          where: {
            title: (await db.purchaseButtonTitle.findFirst())?.title ?? "",
          },
          update: { title },
          create: { title },
        });
        break;
      }
      default:
        return { errorMessage: `Unknown content type: ${contentTitle}` };
    }
    revalidatePath("/admin/edit");
    return { successMessage: "Record edited successfully!" };
  } catch (error) {
    console.log("Error editing content:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
