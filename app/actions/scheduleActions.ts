"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/app/actions/db";
import type { ActionFnType } from "@/types/actionFnType";
import { generateSessionsForNextEightWeeks } from "./scheduleGenerator";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const isAdmin =
    (sessionClaims?.metadata as { isAdmin?: boolean } | undefined)?.isAdmin ===
    true;

  if (!isAdmin) throw new Error("Unauthorized");
}
export async function createBooking(sessionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.$transaction(async (tx) => {
    const session = await tx.classSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new Error("Class session not found");
    if (session.bookedCount >= session.capacity) {
      throw new Error("This class is fully booked");
    }

    const pass = await tx.pass.findFirst({
      where: {
        clerkId: userId,
        expiresAt: { gte: new Date() },
      },
      orderBy: { expiresAt: "asc" },
    });
    if (!pass) throw new Error("No available credits for this booking");

    const usedCount = await tx.booking.count({
      where: { passId: pass.id, status: "CONFIRMED" },
    });
    if (pass.creditsRemaining !== null && usedCount >= pass.creditsRemaining) {
      throw new Error("No available credits for this booking");
    }

    const booking = await tx.booking.create({
      data: { clerkId: userId, sessionId, passId: pass.id },
    });

    await tx.classSession.update({
      where: { id: sessionId },
      data: { bookedCount: { increment: 1 } },
    });

    return booking;
  });
}

export const saveScheduleTemplate: ActionFnType = async (
  _prevState,
  formData,
) => {
  try {
    await requireAdmin();

    const id = String(formData.get("id") ?? "").trim();
    const classSlug = String(formData.get("classSlug") ?? "").trim();
    const instructorSlug = String(formData.get("instructorSlug") ?? "").trim();
    const startTime = String(formData.get("startTime") ?? "").trim();
    const effectiveFromText = String(
      formData.get("effectiveFrom") ?? "",
    ).trim();
    const effectiveToText = String(formData.get("effectiveTo") ?? "").trim();

    const weekday = Number(formData.get("weekday"));
    const durationMin = Number(formData.get("durationMin"));
    const capacity = Number(formData.get("capacity"));

    if (!id || !classSlug || !instructorSlug) {
      return {
        errorMessage: "Template, class, and instructor are required.",
      };
    }

    if (
      !Number.isInteger(weekday) ||
      weekday < 0 ||
      weekday > 6 ||
      !Number.isInteger(durationMin) ||
      durationMin < 1 ||
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 20 ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)
    ) {
      return {
        errorMessage: "Check the weekday, time, duration, and capacity.",
      };
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveFromText)) {
      return { errorMessage: "Enter a valid start date." };
    }

    if (effectiveToText && !/^\d{4}-\d{2}-\d{2}$/.test(effectiveToText)) {
      return { errorMessage: "Enter a valid end date." };
    }

    const effectiveFrom = new Date(`${effectiveFromText}T00:00:00.000Z`);
    const effectiveTo = effectiveToText
      ? new Date(`${effectiveToText}T00:00:00.000Z`)
      : null;

    if (
      Number.isNaN(effectiveFrom.getTime()) ||
      (effectiveTo && Number.isNaN(effectiveTo.getTime())) ||
      (effectiveTo && effectiveTo < effectiveFrom)
    ) {
      return { errorMessage: "Enter a valid effective date range." };
    }

    const [template, danceClass, instructor] = await Promise.all([
      db.scheduleTemplate.findUnique({
        where: { id },
        select: { id: true },
      }),
      db.class.findUnique({
        where: { slug: classSlug },
        select: { slug: true },
      }),
      db.instructor.findUnique({
        where: { slug: instructorSlug },
        select: { slug: true },
      }),
    ]);

    if (!template) {
      return { errorMessage: "Schedule template not found." };
    }

    if (!danceClass || !instructor) {
      return {
        errorMessage: "Choose an existing class and instructor.",
      };
    }

    await db.scheduleTemplate.update({
      where: { id },
      data: {
        classSlug,
        instructorSlug,
        weekday,
        startTime,
        durationMin,
        capacity,
        effectiveFrom,
        effectiveTo,
      },
    });

    revalidatePath("/admin/schedule");

    return { successMessage: "Schedule template saved." };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error && error.message === "Unauthorized"
          ? "You are not authorized to edit the schedule."
          : "Could not save the schedule template.",
    };
  }
};

export const publishSchedule: ActionFnType = async (_prevState, _formData) => {
  try {
    await requireAdmin();

    const created = await generateSessionsForNextEightWeeks();

    revalidatePath("/admin/schedule");
    revalidatePath("/schedule");

    return {
      successMessage: `Published schedule; ${created} sessions added.`,
    };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error && error.message === "Unauthorized"
          ? "You are not authorized to publish the schedule."
          : "Could not publish the schedule.",
    };
  }
};
