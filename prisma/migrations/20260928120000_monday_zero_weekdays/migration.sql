UPDATE "ScheduleTemplate"
SET "weekday" = ("weekday" + 6) % 7
WHERE "weekday" BETWEEN 0 AND 6;