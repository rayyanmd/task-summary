"use client"
import { MoreHorizontalIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { EditAssignment } from "./edit-assignment"
import { courseTable } from "@/db/schema"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { deleteAssignment } from "@/app/admin/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function formatDeadline(deadline: Date | null) {
  if (!deadline) return "Tidak ada deadline"

  const today = new Date()
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  const deadlineDate = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate()
  )

  const diffDays = Math.round(
    (deadlineDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(deadline)

  if (diffDays === 0) return `Hari ini, ${time}`
  if (diffDays === 1) return `Besok, ${time}`

  const date = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(deadline)

  return date
}

function getDeadlineVariant(deadline: Date | null) {
  if (!deadline) return "default" as const

  const today = new Date()
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  const deadlineDate = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate()
  )
  const diffDays = Math.round(
    (deadlineDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return "destructive" as const
  if (diffDays === 1) return "secondary" as const
  return "default" as const
}

export default function AdminAssignmentList({
  assignments,
  courses,
}: {
  assignments: {
    id: number
    title: string | null
    course: string | null
    deadline: Date | null
    type: "individual" | "group" | null
    guide: string | null
    submission: string | null
  }[]
  courses: (typeof courseTable.$inferSelect)[]
}) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedAssignment, setAssignment] = useState<{
    id: number
    title: string | null
    course: string | null
    deadline: Date | null
    type: "individual" | "group" | null
    guide: string | null
    submission: string | null
  }>({
    id: -1,
    title: "",
    course: "",
    deadline: null,
    type: null,
    guide: null,
    submission: null,
  })
  const [isPending, setIsPending] = useState(false)

  return (
    <div className="rounded-md border">
      <EditAssignment
        assignment={selectedAssignment}
        courses={courses}
        isOpen={isEditing}
        setIsOpen={setIsEditing}
      />

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Ngga bisa balik lagi kalo udah dihapus
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                setIsPending(true)
                await deleteAssignment(selectedAssignment.id)
                setIsDeleting(false)
                setIsPending(false)
                toast.success("Tugas berhasil dihapus")
                router.refresh()
              }}
              disabled={isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tugas</TableHead>
            <TableHead>Mata Kuliah</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Batas Waktu</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.title}</TableCell>
              <TableCell>{assignment.course}</TableCell>
              <TableCell>
                {assignment.type == "individual" ? "Individu" : "Kelompok"}
              </TableCell>
              <TableCell>
                <Badge variant={getDeadlineVariant(assignment.deadline)}>
                  {formatDeadline(assignment.deadline)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setAssignment(assignment)
                        setIsEditing(true)
                      }}
                    >
                      Ubah
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setAssignment(assignment)
                        setIsDeleting(true)
                      }}
                    >
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
