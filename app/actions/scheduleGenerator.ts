import "server-only";
import { DateTime } from "luxon";
import db from "@/app/actions/db";

export async function generateSessionsForNextEightWeeks() {
  const templates = await db.scheduleTemplate.findMany();
  let created = 0;

  for (const template of templates) {
    const zone = template.timezone;
    const from = DateTime.fromISO(
      template.effectiveFrom.toISOString().slice(0, 10),
      { zone },
    ).startOf("day");
    const now = DateTime.now().setZone(zone);
    const today = now.startOf("day");
    const through = today.plus({ weeks: 8 });
    const start = from > today ? from : today;
    const end = template.effectiveTo
      ? DateTime.fromISO(template.effectiveTo.toISOString().slice(0, 10), {
          zone,
        })
      : through;
    const last = end < through ? end : through;
    const sessions = [];

    for (let day = start; day <= last; day = day.plus({ days: 1 })) {
      if (day.weekday - 1 !== template.weekday) continue;

      const [hour, minute] = template.startTime.split(":").map(Number);
      const localStart = day.set({ hour, minute });
      if (!localStart.isValid) throw new Error("Invalid local class time");
      if (localStart <= now) continue;

      sessions.push({
        templateId: template.id,
        startsAt: localStart.toUTC().toJSDate(),
        capacity: template.capacity,
      });
    }

    const result = await db.classSession.createMany({
      data: sessions,
      skipDuplicates: true,
    });
    created += result.count;
  }

  return created;
}
