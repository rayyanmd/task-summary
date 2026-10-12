import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  CheckIcon,
  ClockIcon,
  MoreHorizontalIcon,
  PercentCircleIcon,
} from "lucide-react"

export default function Page() {
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
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex w-full flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-start">
              <ClockIcon className="mr-2 shrink-0 text-red-500" />
              <span>Belum Dikerjakan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">3</CardContent>
        </Card>

        <Card className="flex w-full flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-start">
              <CheckIcon className="mr-2 shrink-0 text-green-500" />
              <span>Sudah Dikerjakan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">5</CardContent>
        </Card>

        <Card className="flex w-full flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-start">
              <PercentCircleIcon className="mr-2 shrink-0 text-blue-500" />
              <span>Persentase</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">25%</CardContent>
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
            <TableRow>
              <TableCell>
                <p>Tugas Mandiri pekan 1</p>
              </TableCell>
              <TableCell>Fisika Umum</TableCell>
              <TableCell>Individu</TableCell>
              <TableCell>
                <Badge variant="destructive">Hari ini, 23:59</Badge>
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
                    <DropdownMenuItem>Panduan Pengerjaan</DropdownMenuItem>
                    <DropdownMenuItem>Link Pengumpulan</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Tandai Sudah</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
