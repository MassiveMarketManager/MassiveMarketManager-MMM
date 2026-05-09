import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical, 
  IconChevronLeft, 
  IconChevronRight, 
  IconChevronsLeft, 
  IconChevronsRight,
  IconPencil, 
  IconCash, 
  IconPlus, 
  IconPlayerStop 
 } from "@tabler/icons-react"
 import { Play } from "lucide-react"


export function BotTable({data, openDialog, onRun, onSelect }) {
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const botColumns = [
    { accessorKey: "bot", header: "Bot" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <Badge variant="secondary" className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "Running" ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            {status}
          </Badge>
        )
      },
    },
    { accessorKey: "initial", header: "Initial Deposit" },
    {
      accessorKey: "profit",
      header: "Profit/Loss",
      cell: ({ getValue }) => {
        const profit = getValue()
        return (
          <span
            className="font-semibold"
          >
            {profit}
          </span>
        )
      },
    },
    { accessorKey: "balance", header: "Balance" },
    { accessorKey: "strategy", header: "Strategy" },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8 text-muted-foreground" size="icon">
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onSelect(row.original, "edit")}>
              <IconPencil className=" h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelect(row.original, "withdraw")}><IconCash className=" h-4 w-4" />Withdraw</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelect(row.original, "topup")}><IconPlus className=" h-4 w-4" />Top up</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
                if (row.original.status === "Running") {
                  openDialog(true)
                  onSelect(row.original, "destructive")
                } else {
                  onRun(row.original)
                }
              }}>
              {row.original.status === "Running" ? <><IconPlayerStop className=" h-4 w-4 text-red-500" />Stop</> : <><Play className="h-4 w-4 text-green-500" />Run</>}
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: data,
    columns: botColumns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={botColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end px-4">
        <span className="text-sm pr-3">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <IconChevronsLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <IconChevronLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
