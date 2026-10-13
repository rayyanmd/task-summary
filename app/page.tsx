import AssignmentList from "@/components/assignment-list"
import { db } from "@/db/drizzle"
import { assignmentTable, courseTable } from "@/db/schema"
import { eq, gte } from "drizzle-orm"

export default async function Page() {
  const assignments = await db
    .select({
      id: assignmentTable.id,
      title: assignmentTable.title,
      course: courseTable.name,
      deadline: assignmentTable.deadline,
      type: assignmentTable.type,
      guide: assignmentTable.guide,
      submission: assignmentTable.submission,
    })
    .from(assignmentTable)
    .where(gte(assignmentTable.deadline, new Date()))
    .orderBy(assignmentTable.deadline)
    .innerJoin(courseTable, eq(assignmentTable.courseId, courseTable.id))

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">
          Tumpukan Tugas SS23
        </h1>
        <p className="text-sm font-light text-muted-foreground">
          jangan lupa dikerjain yaa...
        </p>
      </div>
      <AssignmentList assignments={assignments} />
    </div>
  )
}
