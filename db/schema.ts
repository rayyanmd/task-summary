import { defineRelations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const courses = pgTable("courses", {
  id: integer().primaryKey(),
  name: text(),
})

export const typeEnum = pgEnum("types", ["individual", "group"])

export const assignments = pgTable("assignments", {
  id: integer().primaryKey(),
  title: text(),
  courseId: integer("course_id"),
  deadline: timestamp(),
  type: typeEnum().default("individual"),
  guide: text(),
  submission: text(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const relations = defineRelations({ courses, assignments }, (r) => ({
  assignments: {
    course: r.one.courses({ from: r.assignments.courseId, to: r.courses.id }),
  },
  courses: { assignments: r.many.assignments() },
}))
