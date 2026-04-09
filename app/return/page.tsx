import { redirect } from "next/navigation";

import { stripe } from "../../lib/stripe";
import { updateOrderStatus } from "../actions/actions";

export default async function Return({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await updateOrderStatus(orderId, "complete");
    }
    redirect("/account?success=ordercreated");
  }
}
