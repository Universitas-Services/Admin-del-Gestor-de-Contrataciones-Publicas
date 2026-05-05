'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { EnteListItem } from '@/services/enteService';
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
import { Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';

interface EntesTableProps {
  data: EnteListItem[];
}

export function EntesTable({ data }: EntesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<EnteListItem>[] = [
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
              Nombre del Ente
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-foreground font-semibold">
          {row.getValue('nombre')}
        </div>
      ),
    },
    {
      accessorKey: 'rif',
      header: 'RIF',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue('rif')}</div>
      ),
    },
    {
      id: 'ubicacion',
      header: 'Ubicación',
      cell: ({ row }) => {
        const estado = row.original.estado;
        const municipio = row.original.municipio;
        if (estado && municipio) {
          return (
            <span className="text-muted-foreground">{`${estado}, ${municipio}`}</span>
          );
        }
        return (
          <span className="text-muted-foreground">
            {estado || municipio || 'N/A'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
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
      id: 'usuarios',
      header: 'Usuarios',
      cell: ({ row }) => {
        return (
          <span className="font-medium">
            {row.original._count?.usuarios || 0}
          </span>
        );
      },
    },
    {
      accessorKey: 'datosConfirmados',
      header: 'Estatus',
      cell: ({ row }) => {
        const isConfirmed = row.getValue('datosConfirmados') as boolean;
        // Colores que empatan con el tema (evitando hex hardcodeados, usando variantes o colores estándar de tailwind)
        return (
          <Badge
            variant="outline"
            className={
              isConfirmed
                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600'
            }
          >
            {isConfirmed ? 'Completado' : 'Por completar'}
          </Badge>
        );
      },
    },
    {
      id: 'acciones',
      header: 'Acción',
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
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
