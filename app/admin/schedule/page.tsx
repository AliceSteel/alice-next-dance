import db from "@/app/actions/db";
import ScheduleEditor from "./components/ScheduleEditClient";

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default async function SchedulePage() {
  const [templates, classes, instructors] = await Promise.all([
    db.scheduleTemplate.findMany({
      orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    }),
    db.class.findMany({
      select: { slug: true, title: true },
      orderBy: { title: "asc" },
    }),
    db.instructor.findMany({
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const editorTemplates = templates.map((template) => ({
    id: template.id,
    classSlug: template.classSlug,
    instructorSlug: template.instructorSlug,
    weekday: template.weekday,
    startTime: template.startTime,
    durationMin: template.durationMin,
    effectiveFrom: toDateInputValue(template.effectiveFrom),
    effectiveTo: template.effectiveTo
      ? toDateInputValue(template.effectiveTo)
      : null,
    capacity: template.capacity,
  }));

  return (
    <ScheduleEditor
      templates={editorTemplates}
      classes={classes}
      instructors={instructors}
    />
  );
}
