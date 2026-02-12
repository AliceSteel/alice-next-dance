import Link from "next/link";

export default function PurchaseDialog() {
  return (
    <div>
      {" "}
      you added 1 item to Basket, go to <Link href="/basket">Basket</Link>{" "}
    </div>
  );
}
