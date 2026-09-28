"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  publishSchedule,
  saveScheduleTemplate,
} from "@/app/actions/scheduleActions";
import FormContainer from "@/components/formElements/FormContainer";
import { SubmitBtn } from "@/components/formElements/SubmitBtn";

type ClassOption = {
  slug: string;
  title: string;
};
type InstructorOption = {
  slug: string;
  name: string;
};
type ScheduleTemplateRow = {
  id: string;
  classSlug: string;
  instructorSlug: string;
  weekday: number;
  startTime: string;
  durationMin: number;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string | null;
  capacity: number;
};

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ScheduleEditor({
  templates,
  classes,
  instructors,
}: {
  templates: ScheduleTemplateRow[];
  classes: ClassOption[];
  instructors: InstructorOption[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section className="page-container py-8 flex flex-col gap-8 max-w-6xl">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl">Edit Schedule</h1>
        <p className="text-gray-400">
          Edit recurring timetable entries, then publish the next eight weeks.
        </p>
      </header>

      <div className="flex justify-between border-b border-gray-500 py-3">
        <span className="font-bold">Recurring timetable</span>
        <span className="font-bold">Actions</span>
      </div>

      {templates.map((template) => {
        const isEditing = editingId === template.id;

        return (
          <div key={template.id} className="border-b border-gray-700/50 py-3">
            {!isEditing ? (
              <div className="flex flex-wrap items-center justify-between gap-3 px-2">
                <div>
                  <p className="font-semibold">
                    {classes.find((item) => item.slug === template.classSlug)
                      ?.title ?? template.classSlug}
                  </p>
                  <p className="text-sm text-gray-400">
                    {weekdays[template.weekday]} at {template.startTime}
                    {" · "}
                    {instructors.find(
                      (item) => item.slug === template.instructorSlug,
                    )?.name ?? template.instructorSlug}
                    {" · "}
                    {template.capacity} seats
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingId(template.id)}
                  className="rounded-md border border-gray-500 px-3 py-2 hover:bg-white/10"
                >
                  Edit
                </button>
              </div>
            ) : (
              <FormContainer
                action={saveScheduleTemplate}
                border
                onSuccess={() => {
                  setEditingId(null);
                  router.refresh();
                }}
              >
                <input type="hidden" name="id" value={template.id} />

                <label className="flex flex-col gap-1 text-sm text-gray-300">
                  Class
                  <select
                    name="classSlug"
                    defaultValue={template.classSlug}
                    required
                    className="rounded-md bg-white/10 p-2 text-white"
                  >
                    {classes.map((item) => (
                      <option
                        key={item.slug}
                        value={item.slug}
                        className="text-black"
                      >
                        {item.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-sm text-gray-300">
                  Instructor
                  <select
                    name="instructorSlug"
                    defaultValue={template.instructorSlug}
                    required
                    className="rounded-md bg-white/10 p-2 text-white"
                  >
                    {instructors.map((item) => (
                      <option
                        key={item.slug}
                        value={item.slug}
                        className="text-black"
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm text-gray-300">
                    Weekday
                    <select
                      name="weekday"
                      defaultValue={template.weekday}
                      className="rounded-md bg-white/10 p-2 text-white"
                    >
                      {weekdays.map((day, index) => (
                        <option key={day} value={index} className="text-black">
                          {day}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-300">
                    Start time
                    <input
                      name="startTime"
                      type="time"
                      defaultValue={template.startTime}
                      required
                      className="rounded-md bg-white/10 p-2 text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-300">
                    Duration (minutes)
                    <input
                      name="durationMin"
                      type="number"
                      min={1}
                      defaultValue={template.durationMin}
                      required
                      className="rounded-md bg-white/10 p-2 text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-300">
                    Capacity
                    <input
                      name="capacity"
                      type="number"
                      min={1}
                      max={20}
                      defaultValue={template.capacity}
                      required
                      className="rounded-md bg-white/10 p-2 text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-300">
                    Effective from
                    <input
                      name="effectiveFrom"
                      type="date"
                      defaultValue={template.effectiveFrom}
                      required
                      className="rounded-md bg-white/10 p-2 text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-300">
                    Effective until
                    <input
                      name="effectiveTo"
                      type="date"
                      defaultValue={template.effectiveTo ?? ""}
                      className="rounded-md bg-white/10 p-2 text-white"
                    />
                  </label>
                </div>

                <div>
                  <h2 className="font-semibold">Publish schedule</h2>
                  <p className="text-sm text-gray-400">
                    Create any missing class sessions for the next eight weeks.
                  </p>
                </div>
                <SubmitBtn label="Save" actionType="edit" />
              </FormContainer>
            )}
          </div>
        );
      })}
      <FormContainer
        action={publishSchedule}
        border
        onSuccess={() => router.refresh()}
      >
        <div>
          <h2 className="font-semibold">Publish schedule</h2>
          <p className="text-sm text-gray-400">
            Generate any missing sessions for the next eight weeks.
          </p>
        </div>
        <SubmitBtn label="Publish schedule" />
      </FormContainer>
    </section>
  );
}
