import { defineRelations } from "drizzle-orm"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const courseTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
})

export const typeEnum = pgEnum("types", ["individual", "group"])

export const assignmentTable = pgTable("assignments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
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

export const relations = defineRelations(
  { courseTable, assignmentTable },
  (r) => ({
    assignmentTable: {
      course: r.one.courseTable({
        from: r.assignmentTable.courseId,
        to: r.courseTable.id,
      }),
    },
    courseTable: { assignmentTable: r.many.assignmentTable() },
  })
)
