'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { type Clausula } from '@/services/clausulaService';
import { stripHtml, truncateText } from '@/lib/utils/text';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PREVIEW_MAX_LENGTH = 80;

interface ClausulasTableProps {
  data: Clausula[];
  page: number;
  lastPage: number;
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (item: Clausula) => void;
  onDelete: (item: Clausula) => void;
}

export function ClausulasTable({
  data,
  page,
  lastPage,
  total,
  search,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
}: ClausulasTableProps) {
  const columns: ColumnDef<Clausula>[] = [
    {
      accessorKey: 'titulo',
      header: 'Título',
      cell: ({ row }) => {
        const text = row.getValue('titulo') as string;
        return (
          <p
            className="line-clamp-2 text-left text-sm leading-snug font-semibold break-words text-slate-800"
            title={text}
          >
            {truncateText(text, PREVIEW_MAX_LENGTH)}
          </p>
        );
      },
    },
    {
      accessorKey: 'cuerpo',
      header: 'Cuerpo',
      cell: ({ row }) => {
        const plain = stripHtml(row.getValue('cuerpo') as string);
        return (
          <p
            className="line-clamp-2 text-left text-sm leading-snug break-words text-slate-600"
            title={plain}
          >
            {truncateText(plain, PREVIEW_MAX_LENGTH)}
          </p>
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
        <CardTitle>Cláusulas en biblioteca</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título o cuerpo..."
            className="w-full min-w-0 sm:max-w-sm"
          />
        </div>

        <div className="bg-card w-full min-w-0 overflow-hidden rounded-md border">
          <Table className="table-fixed">
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const isTitulo = header.id === 'titulo';
                    const isCuerpo = header.id === 'cuerpo';
                    const isFecha = header.id === 'updatedAt';
                    const isAcciones = header.id === 'acciones';

                    return (
                      <TableHead
                        key={header.id}
                        className={
                          isTitulo
                            ? 'text-muted-foreground w-[30%] px-3 text-left font-semibold whitespace-normal'
                            : isCuerpo
                              ? 'text-muted-foreground w-[40%] px-3 text-left font-semibold whitespace-normal'
                              : isFecha
                                ? 'text-muted-foreground w-[15%] px-2 text-center font-semibold'
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
                      const isTextCell =
                        cell.column.id === 'titulo' ||
                        cell.column.id === 'cuerpo';
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            isTextCell
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
                    No hay cláusulas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {total > 0 && (
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              {total} cláusula{total === 1 ? '' : 's'} en total
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
