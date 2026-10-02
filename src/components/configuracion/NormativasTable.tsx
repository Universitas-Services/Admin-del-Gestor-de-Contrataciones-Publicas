'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { type Normativa } from '@/services/normativaService';
import { truncateText } from '@/lib/utils/text';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type IndActivoFilter = 'all' | 'true' | 'false';

const PREVIEW_MAX_LENGTH = 80;

interface NormativasTableProps {
  data: Normativa[];
  page: number;
  lastPage: number;
  total: number;
  search: string;
  indActivoFilter: IndActivoFilter;
  onSearchChange: (value: string) => void;
  onIndActivoFilterChange: (value: IndActivoFilter) => void;
  onPageChange: (page: number) => void;
  onEdit: (item: Normativa) => void;
  onDelete: (item: Normativa) => void;
}

export function NormativasTable({
  data,
  page,
  lastPage,
  total,
  search,
  indActivoFilter,
  onSearchChange,
  onIndActivoFilterChange,
  onPageChange,
  onEdit,
  onDelete,
}: NormativasTableProps) {
  const columns: ColumnDef<Normativa>[] = [
    {
      accessorKey: 'textoNormativaCompleto',
      header: 'Normativa',
      cell: ({ row }) => {
        const text = row.getValue('textoNormativaCompleto') as string;
        return (
          <p
            className="line-clamp-2 text-left text-sm leading-snug break-words text-slate-700"
            title={text}
          >
            {truncateText(text, PREVIEW_MAX_LENGTH)}
          </p>
        );
      },
    },
    {
      accessorKey: 'indActivo',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.getValue('indActivo') as boolean;
        return (
          <Badge
            variant="outline"
            className={
              isActive
                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                : 'border-slate-400/20 bg-slate-400/10 text-slate-600'
            }
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualización',
      cell: ({ row }) => {
        const raw = row.original.updatedAt ?? row.original.createdAt;
        if (!raw) {
          return <span className="text-muted-foreground text-sm">—</span>;
        }
        const date = new Date(raw);
        return (
          <span className="text-muted-foreground text-sm">
            {date.toLocaleDateString('es-VE', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            })}
          </span>
        );
      },
    },
    {
      id: 'acciones',
      header: 'Acción',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-8 w-8 hover:text-orange-500"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-8 w-8"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: lastPage,
  });

  return (
    <Card className="w-full max-w-full min-w-0 overflow-hidden border shadow-sm">
      <CardHeader>
        <CardTitle>Normativas registradas</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar en el texto de la normativa..."
            className="w-full min-w-0 sm:max-w-sm"
          />
          <Select
            value={indActivoFilter}
            onValueChange={(value) =>
              onIndActivoFilterChange(value as IndActivoFilter)
            }
          >
            <SelectTrigger className="w-full shrink-0 sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Activos</SelectItem>
              <SelectItem value="false">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card w-full min-w-0 overflow-hidden rounded-md border">
          <Table className="table-fixed">
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const isNormativa = header.id === 'textoNormativaCompleto';
                    const isEstado = header.id === 'indActivo';
                    const isFecha = header.id === 'updatedAt';
                    const isAcciones = header.id === 'acciones';

                    return (
                      <TableHead
                        key={header.id}
                        className={
                          isNormativa
                            ? 'text-muted-foreground w-[50%] px-3 text-left font-semibold whitespace-normal'
                            : isEstado
                              ? 'text-muted-foreground w-[15%] px-2 text-center font-semibold'
                              : isFecha
                                ? 'text-muted-foreground w-[20%] px-2 text-center font-semibold'
                                : isAcciones
                                  ? 'text-muted-foreground w-[15%] px-2 text-center font-semibold'
                                  : 'text-muted-foreground px-2 text-center font-semibold'
                        }
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
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isNormativa =
                        cell.column.id === 'textoNormativaCompleto';
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            isNormativa
                              ? 'max-w-0 px-3 py-3 align-middle whitespace-normal'
                              : 'px-2 py-3 text-center align-middle'
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-muted-foreground h-24 text-center whitespace-normal"
                  >
                    No hay normativas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {total > 0 && (
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              {total} normativa{total === 1 ? '' : 's'} en total
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <div className="text-muted-foreground px-2 text-sm">
                Página{' '}
                <span className="text-foreground font-medium">{page}</span> de{' '}
                <span className="text-foreground font-medium">
                  {lastPage || 1}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= lastPage}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
