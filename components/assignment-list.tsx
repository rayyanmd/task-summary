"use client"

import { useEffect, useState } from "react"
import {
  CheckIcon,
  ClockIcon,
  MoreHorizontalIcon,
  PercentCircleIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"
import { Skeleton } from "./ui/skeleton"

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

export default function AssignmentList({
  assignments,
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
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [completedAssignments, setCompletedAssignments] = useState<Set<number>>(
    new Set()
  )

  useEffect(() => {
    setIsLoading(false)
    const stored = localStorage.getItem("completed-assignments")
    if (!stored) return

    try {
      setCompletedAssignments(new Set(JSON.parse(stored) as number[]))
    } catch {
      localStorage.removeItem("completed-assignments")
    }
  }, [])

  function toggleCompleted(id: number) {
    setCompletedAssignments((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem("completed-assignments", JSON.stringify([...next]))
      return next
    })
  }

  const sortedAssignments = [...assignments].sort(
    (a, b) =>
      Number(completedAssignments.has(a.id)) -
      Number(completedAssignments.has(b.id))
  )

  const completed = assignments.filter((a) =>
    completedAssignments.has(a.id)
  ).length

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex w-full flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-start">
              <ClockIcon className="mr-2 shrink-0 text-red-500" />
              <span>Belum Dikerjakan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {isLoading ? (
              <Skeleton className="h-10 w-10" />
            ) : (
              assignments.length - completed
            )}
          </CardContent>
        </Card>

        <Card className="flex w-full flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-start">
              <CheckIcon className="mr-2 shrink-0 text-green-500" />
              <span>Sudah Dikerjakan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {isLoading ? <Skeleton className="h-10 w-10" /> : completed}
          </CardContent>
        </Card>

        <Card className="flex w-full flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-start">
              <PercentCircleIcon className="mr-2 shrink-0 text-blue-500" />
              <span>Persentase</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              (completed / assignments.length) * 100 + "%"
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
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
            {sortedAssignments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  yey ngga ada tugas
                </TableCell>
              </TableRow>
            ) : (
              sortedAssignments.map((assignment) => {
                const isCompleted = completedAssignments.has(assignment.id)

                return (
                  <TableRow
                    key={assignment.id}
                    className={
                      isCompleted
                        ? "bg-secondary text-muted-foreground line-through"
                        : undefined
                    }
                  >
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.course}</TableCell>
                    <TableCell>
                      {assignment.type == "individual"
                        ? "Individu"
                        : "Kelompok"}
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <Link href={assignment.guide!} target="_blank">
                            <DropdownMenuItem>
                              Panduan Pengerjaan
                            </DropdownMenuItem>
                          </Link>
                          <Link href={assignment.submission!} target="_blank">
                            <DropdownMenuItem>
                              Link Pengumpulan
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => toggleCompleted(assignment.id)}
                          >
                            {isCompleted ? "Tandai Belum" : "Tandai Sudah"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
