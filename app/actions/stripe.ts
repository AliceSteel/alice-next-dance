"use server";

import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { stripe } from "../../lib/stripe";
import db from "@/app/actions/db";
import { BasketItem } from "@/types/basketItemTypes";

export async function createHostedCheckoutUrl(orderId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Please sign in before checking out.");

  const order = await db.order.findFirst({
    where: { orderId, clerkId: user.id },
    include: { orderItems: { include: { product: true } } },
  });

  if (!order || order.orderItems.length === 0) {
    throw new Error("Order not found or empty.");
  }
  const origin = (await headers()).get("origin");
  if (!origin) throw new Error("Could not determine the checkout URL.");

  const session = await stripe.checkout.sessions.create({
    line_items: order.orderItems.map((item) => {
      const price = Number.parseFloat(item.price.replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price for ${item.product.name}.`);
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency: "dkk",
          unit_amount: Math.round(price * 100),
          product_data: { name: item.product.name },
        },
      };
    }),
    mode: "payment",
    success_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/schedule?checkout=cancelled`,
    metadata: { orderId: order.orderId },
  });

  if (!session.url) throw new Error("Stripe did not provide a checkout URL.");
  return session.url;
}
/* export async function fetchClientSecret(
  orderId: string,
  basketItems: BasketItem[],
) {
  const origin = (await headers()).get("origin");

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    line_items: basketItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "dkk",
        unit_amount: Math.round(
          parseFloat(item.price.replace("DKK", "")) * 100,
        ),
        product_data: {
          name: item.name,
        },
      },
    })),
    mode: "payment",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      orderId,
    },
  });

  return session.client_secret as string;
}
 */
