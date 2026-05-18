'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { SupervisorListItem } from '@/services/supervisorService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';

interface SupervisoresTableProps {
  data: SupervisorListItem[];
}

export function SupervisoresTable({ data }: SupervisoresTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<SupervisorListItem>[] = [
    {
      accessorKey: 'nombre',
      header: ({ column }) => {
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="hover:bg-muted"
            >
              Nombre del Supervisor
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <Link
          href={`/dashboard/supervisor/${row.original.id}`}
          className="text-foreground hover:text-primary font-semibold transition-colors hover:underline"
        >
          {row.getValue('nombre')}
        </Link>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Correo Electrónico',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'cantidadEntesAsignados',
      header: 'Entes Asignados',
      cell: ({ row }) => {
        return (
          <span className="font-medium">
            {row.getValue('cantidadEntesAsignados')}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Registro',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <span className="text-muted-foreground">
            {date.toLocaleDateString('es-VE', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </span>
        );
      },
    },
    {
      accessorKey: 'activo',
      header: 'Estatus',
      cell: ({ row }) => {
        const isActive = row.getValue('activo') as boolean;
        return (
          <Badge
            variant="outline"
            className={
              isActive
                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                : 'border-red-500/20 bg-red-500/10 text-red-600'
            }
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      id: 'acciones',
      header: 'Acción',
      cell: () => {
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-8 w-8 hover:text-orange-500"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-card overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground max-w-[150px] px-2 text-center align-middle font-semibold break-words whitespace-normal"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="max-w-[150px] px-2 py-3 text-center align-middle break-words whitespace-normal"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <div className="text-muted-foreground px-2 text-sm">
          Página{' '}
          <span className="text-foreground font-medium">
            {table.getState().pagination.pageIndex + 1}
          </span>{' '}
          de{' '}
          <span className="text-foreground font-medium">
            {table.getPageCount() || 1}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
