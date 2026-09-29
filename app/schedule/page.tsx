import ScheduleClient from "./components/scheduleClient/ScheduleClient";
import PriceList from "./components/priceList/PriceList";
import {
  fetchProducts,
  fetchPassesTitleRecord,
  fetchBtnTitleRecord,
  fetchSchedule,
} from "@/app/actions/actions";
import { fetchUserPasses } from "@/app/actions/orderActions";
import { Suspense } from "react";

export default async function SchedulePage() {
  const products = await fetchProducts();
  const passesTitle = await fetchPassesTitleRecord();
  const btnTitle = await fetchBtnTitleRecord();

  const weeks = await fetchSchedule();
  const passes = await fetchUserPasses(); // [] if not logged in
  console.log("User passes fetched server-side:", passes);
  const bookingPackages = passes.map((pass) => ({
    id: pass.id,
    numberOfCredits: pass.creditsRemaining ?? Infinity,
    usedAt: pass.bookings.map((b) => ({ id: b.sessionId }) as any), // adapt to BookableScheduleEntry if needed
    expiresAt: pass.expiresAt.toISOString(),
  }));

  return (
    <>
      <ScheduleClient weeks={weeks} bookingPackages={bookingPackages} />
      {/* CHECK if it scrolls down after modal closed here */}
      <section id="membership-options" className="page-container py-20">
        <h2 className="text-2xl uppercase mb-5">{passesTitle}</h2>
        <Suspense fallback={<div>Loading prices...</div>}>
          <PriceList prices={products} purchaseButtonTitle={btnTitle} />
        </Suspense>
      </section>
    </>
  );
}
