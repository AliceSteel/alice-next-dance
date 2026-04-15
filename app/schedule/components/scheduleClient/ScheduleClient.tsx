"use client";

import ClassFilters from "@/components/classFilters/ClassFilters";
import { useSelector, useDispatch } from "react-redux";
import { selectCategories } from "@/store/slices/classes/classesSlice";
import Button from "@/components/formElements/Btn";
import { useState, useEffect, useMemo } from "react";
import type { ScheduleEntry, ScheduleWeek } from "@/types/ScheduleItem";
import type { Category } from "@/store/slices/classes/classesTypes";
import ScheduleGrid from "../scheduleGrid/ScheduleGrid";
import { openModal } from "@/store/slices/modal/modalSlice";
import {
  selectAvailableCredits,
  consumeBookingCredit,
  selectIsLoggedIn,
  collectBookingsForUser,
} from "@/store/slices/user/userSlice";
import type { ScheduleClientProps } from "./ScheduleClientTypes";
import { toast } from "react-toastify";

function ScheduleClient({ weeks }: ScheduleClientProps) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const classCategories: Category[] = useSelector(selectCategories);

  const availableCredits = useSelector(selectAvailableCredits);
  const alreadyBookedEntries = useSelector(collectBookingsForUser);

  const dispatch = useDispatch();

  function getFilteredCategory(search: string): string | number {
    const params = new URLSearchParams(search);
    const filtered = params.get("filtered");
    return filtered && filtered.trim().length > 0 ? filtered : "all";
  }

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(
    "all",
  );

  useEffect(() => {
    const initial = getFilteredCategory(window.location.search);

    if (initial !== "all" && classCategories && classCategories.length > 0) {
      const isValid = classCategories.some((c) => c.id === initial);
      if (!isValid) {
        // reset state and clean the URL
        setSelectedCategoryId((prev) => (prev !== "all" ? "all" : prev));
        const params = new URLSearchParams(window.location.search);
        params.delete("filtered");
        const next = `${window.location.pathname}${
          params.toString() ? `?${params.toString()}` : ""
        }${window.location.hash ?? ""}`;
        window.history.replaceState(null, "", next);
        return;
      }
    }

    // if valid or "all", ensure state matches the URL
    setSelectedCategoryId((prev) => (prev !== initial ? initial : prev));
    // run when categories initially arrive/update
  }, [classCategories]);

  const handleFilterItems = (categoryId: string | number) => {
    setSelectedCategoryId(categoryId);
    const params = new URLSearchParams(window.location.search);
    if (categoryId === "all") {
      params.delete("filtered");
    } else {
      categoryId = String(categoryId);
      params.set("filtered", categoryId);
    }

    const next = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }${window.location.hash ?? ""}`;

    window.history.replaceState(null, "", next);
  };

  const [weekIndex, setWeekIndex] = useState<number>(0);

  const currentWeek: ScheduleWeek = weeks[weekIndex];

  const allCategories: Category[] = [
    { id: "all", title: "All" },
    ...(classCategories ?? []),
  ];
  const days = useMemo(
    () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    [],
  );
  const timeSlots = useMemo(
    () => [
      "09-10:30",
      "11:00-12:30",
      "13:00-14:30",
      "15:00-16:30",
      "17:00-18:30",
    ],
    [],
  );
  const getEntryFor = (day: string, slot: string) =>
    currentWeek.entries.find((e) => e.day === day && e.timeSlot === slot);

  const handleEntryClick = (entry: ScheduleEntry) => {
    // 1. not logged in → go login, then membership
    if (!isLoggedIn) {
      dispatch(openModal("login"));
      return;
    }

    // 2. check credits / availability
    if (availableCredits && availableCredits.length < 1) {
      toast.info("Please purchase a membership package to book classes");
      dispatch(openModal("membership"));
      return;
    }
    dispatch(consumeBookingCredit({ entry }));
    // toDO3. dispatch booking to store and BE
    //dispatch(bookClass({ entryId: entry.id, weekId: week.id }));
  };

  return (
    <>
      <section className="page-container flex flex-col items-center md:flex-row gap-10 py-20 min-h-screen relative">
        <div className="w-full md:w-1/5 flex flex-col items-start gap-8 ">
          <h2 className="text-2xl uppercase">
            Our Schedule for {currentWeek.label}
          </h2>
          <ul
            className="list-none flex flex-row flex-wrap md:flex-col w-full gap-1 mb-auto"
            role="radiogroup"
          >
            <ClassFilters
              categories={allCategories}
              filterItems={handleFilterItems}
              selectedId={selectedCategoryId}
            />
          </ul>
        </div>
        <ScheduleGrid
          days={days}
          timeSlots={timeSlots}
          currentWeek={currentWeek}
          selectedCategoryId={selectedCategoryId}
          getEntryFor={getEntryFor}
          weekIndex={weekIndex}
          weeks={weeks}
          setWeekIndex={setWeekIndex}
          onEntryClick={handleEntryClick}
          alreadyBookedEntries={alreadyBookedEntries}
        />
        <div className="block md:absolute bottom-0 left-8">
          {" "}
          <Button label="Have Questions?" to="/contact" />
        </div>
      </section>
    </>
  );
}

export default ScheduleClient;
