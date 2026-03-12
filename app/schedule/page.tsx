import ScheduleClient from "./components/scheduleClient/ScheduleClient";
import PriceList from "./components/priceList/PriceList";
import {
  fetchProducts,
  fetchPassesTitleRecord,
  fetchBtnTitleRecord,
  fetchSchedule,
} from "@/helpers/actions";
import { Suspense } from "react";
import type { ScheduleResponse } from "@/types/ScheduleItem";

export default async function SchedulePage() {
  const products = await fetchProducts();
  const passesTitle = await fetchPassesTitleRecord();
  const btnTitle = await fetchBtnTitleRecord();

  const weeks: ScheduleResponse["weeks"] = await fetchSchedule();

  return (
    <>
      <ScheduleClient weeks={weeks} />
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
