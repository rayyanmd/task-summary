import AdminAssignmentList from "@/components/admin/admin-assignment-list"
import { CreateAssignment } from "@/components/admin/create-assignment"
import { db } from "@/db/drizzle"
import { assignmentTable, courseTable } from "@/db/schema"
import { eq, gte } from "drizzle-orm"

export default async function Admin() {
  const courses = await db.select().from(courseTable)

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
          halaman komti dan pj
        </p>
      </div>
      <CreateAssignment courses={courses} />
      <AdminAssignmentList assignments={assignments} courses={courses} />
    </div>
  )
}
