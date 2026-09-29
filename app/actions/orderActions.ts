"use server";
import db from "@/app/actions/db";
import { DateTime } from "luxon";

import { currentUser } from "@clerk/nextjs/server";
import { BasketItem } from "@/types/basketItemTypes";

export const createOrder = async (basketItems: BasketItem[], total: number) => {
  const user = await currentUser();
  let orderId: null | string = null;

  if (!user) throw new Error("User not authenticated");
  try {
    const clerkId = user.id;

    const order = await db.order.create({
      data: {
        clerkId,
        orderTotalPrice: total,
        qtyItemsInOrder: basketItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
        status: "pending",
        orderItems: {
          create: basketItems.map((item: BasketItem) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    orderId = order.orderId;
    console.log("Order created from actions with ID:", orderId);
  } catch (error) {
    console.log("Error creating order:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
  return orderId;
};
//for MY ACCOUNT page:
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
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};

export const fetchUserPasses = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];

    return db.pass.findMany({
      where: { clerkId: user.id, expiresAt: { gte: new Date() } },
      include: {
        orderItem: { include: { product: true } },
        bookings: {
          where: { status: "CONFIRMED" },
          include: {
            session: {
              include: {
                template: { include: { danceClass: true, instructor: true } },
              },
            },
          },
          orderBy: { session: { startsAt: "asc" } },
        },
      },
      orderBy: { expiresAt: "asc" },
    });
  } catch (error) {
    console.log("Error fetching passes:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};

//SALES ADMIN PAGE:
export const fetchAllOrders = async () => {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { orderItems: { include: { product: true } } },
    });
    return orders;
  } catch (error) {
    console.log("Error fetching all orders:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    await db.order.update({
      where: { orderId },
      data: { status: newStatus },
    });
  } catch (error) {
    console.log("Error updating order status:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};

export const createPassesFromOrder = async (orderId: string) => {
  const order = await db.order.findUnique({
    where: { orderId },
    include: { orderItems: { include: { product: true } } },
  });
  if (!order) throw new Error("Order not found");

  // not to duplicate passes if this order was already processed
  const existing = await db.pass.findFirst({
    where: { orderItemId: { in: order.orderItems.map((i) => i.id) } },
  });
  if (existing) return;

  const now = DateTime.now();

  await db.$transaction(
    order.orderItems.flatMap((item) =>
      Array.from({ length: item.quantity }).map(() =>
        db.pass.create({
          data: {
            clerkId: order.clerkId,
            orderItemId: item.id,
            creditsRemaining: item.product.credits,
            expiresAt: now.plus({ days: item.product.validityDays }).toJSDate(),
          },
        }),
      ),
    ),
  );
};
