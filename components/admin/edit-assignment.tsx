"use client"
import { courseTable } from "@/db/schema"
import { editAssignment } from "@/app/admin/actions"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import type { Dispatch, SetStateAction } from "react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const formSchema = z.object({
  title: z.string().min(1, "Nama tugas wajib diisi"),
  course: z.number().int().positive("Mata kuliah wajib dipilih"),
  deadline: z.string().min(1, "Batas waktu wajib diisi").datetime(),
  type: z.enum(["individual", "group"]),
  guide: z.string().url("Link panduan harus berupa url").or(z.literal("")),
  submission: z
    .string()
    .url("Link pengumpulan harus berupa url")
    .or(z.literal("")),
})

export function EditAssignment({
  assignment,
  courses,
  isOpen,
  setIsOpen,
}: {
  assignment: {
    id: number
    title: string | null
    course: string | null
    deadline: Date | null
    type: "individual" | "group" | null
    guide: string | null
    submission: string | null
  }
  courses: (typeof courseTable.$inferSelect)[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
  const courseItems = courses.map((course) => ({
    label: course.name ?? "",
    value: course.id,
  }))
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      title: assignment.title ?? "",
      course: assignment.course
        ? (courseItems.find((e) => e.label == assignment.course)?.value ?? -1)
        : -1,
      deadline: assignment.deadline?.toISOString() ?? "",
      type: assignment.type ?? "individual",
      guide: assignment.guide ?? "",
      submission: assignment.submission ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      startTransition(async () => {
        try {
          await editAssignment({ id: assignment.id, ...value })
          form.reset()
          setIsOpen(false)
          toast.success("Tugas berhasil diubah")
          router.refresh()
        } catch (error) {
          setSubmitError(
            error instanceof Error
              ? error.message
              : "Tugas gagal disimpan. Silakan coba lagi."
          )
        }
      })
    },
  })

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        form.reset()
        setIsOpen(open)
        if (open) setSubmitError(null)
      }}
    >
      <form
        id="edit-assignment-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Tugas</DialogTitle>
            <DialogDescription>
              Ubah tugas {assignment.title} di sini. Klik simpan jika sudah
              selesai.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Nama Tugas</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Tugas Mandiri 1"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="course"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Mata Kuliah</FieldLabel>
                    <Select
                      id={field.name}
                      name={field.name}
                      value={field.state.value == -1 ? null : field.state.value}
                      onValueChange={(e) => field.handleChange(e!)}
                      items={courseItems}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mata kuliah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {courseItems.map((course) => (
                            <SelectItem key={course.value} value={course.value}>
                              {course.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="deadline"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                const deadline = field.state.value
                  ? new Date(field.state.value)
                  : undefined
                const timeValue = deadline
                  ? `${String(deadline.getHours()).padStart(2, "0")}:${String(
                      deadline.getMinutes()
                    ).padStart(2, "0")}`
                  : "23:59"

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Batas Waktu</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            id={field.name}
                            type="button"
                            variant="outline"
                            className="w-full justify-start font-normal"
                            aria-invalid={isInvalid}
                          />
                        }
                      >
                        {deadline
                          ? deadline.toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Pilih batas waktu"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3" align="start">
                        <Calendar
                          mode="single"
                          selected={deadline}
                          onSelect={(date) => {
                            if (!date) return
                            const [hours, minutes] = timeValue
                              .split(":")
                              .map(Number)
                            date.setHours(hours, minutes, 0, 0)
                            field.handleChange(date.toISOString())
                          }}
                        />
                        <Input
                          type="time"
                          value={timeValue}
                          onChange={(event) => {
                            const [hours, minutes] = event.target.value
                              .split(":")
                              .map(Number)
                            const nextDate = deadline ?? new Date()
                            nextDate.setHours(hours, minutes, 0, 0)
                            field.handleChange(nextDate.toISOString())
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="type"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                const typeItems = [
                  { label: "Individu", value: "individual" },
                  { label: "Kelompok", value: "group" },
                ]

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Jenis Tugas</FieldLabel>
                    <Select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value!)}
                      items={typeItems}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis tugas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {typeItems.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="guide"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Link Panduan</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="https://drive.google.com/panduan"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="submission"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Link Pengumpulan
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="https://class.ipb.ac.id/pengumpulan"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
          <DialogFooter>
            {submitError && (
              <p className="text-sm text-destructive" role="alert">
                {submitError}
              </p>
            )}
            <Button
              type="submit"
              form="edit-assignment-form"
              disabled={isPending}
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
