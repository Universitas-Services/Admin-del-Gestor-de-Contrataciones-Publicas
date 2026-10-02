'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, FileText, Trash2, Upload } from 'lucide-react';
import { type DocumentoEjemplo } from '@/services/documentoEjemploService';
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

export type ActivoFilter = 'all' | 'true' | 'false';

const PREVIEW_MAX_LENGTH = 60;

interface DocumentosEjemploTableProps {
  data: DocumentoEjemplo[];
  page: number;
  lastPage: number;
  total: number;
  search: string;
  activoFilter: ActivoFilter;
  onSearchChange: (value: string) => void;
  onActivoFilterChange: (value: ActivoFilter) => void;
  onPageChange: (page: number) => void;
  onEdit: (item: DocumentoEjemplo) => void;
  onReplaceImage: (item: DocumentoEjemplo) => void;
  onDelete: (item: DocumentoEjemplo) => void;
}

export function DocumentosEjemploTable({
  data,
  page,
  lastPage,
  total,
  search,
  activoFilter,
  onSearchChange,
  onActivoFilterChange,
  onPageChange,
  onEdit,
  onReplaceImage,
  onDelete,
}: DocumentosEjemploTableProps) {
  const columns: ColumnDef<DocumentoEjemplo>[] = [
    {
      id: 'archivo',
      header: 'Archivo',
      cell: ({ row }) => {
        const url = row.original.url;
        const isImage = /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url);
        if (isImage) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={row.original.nombre}
              className="mx-auto h-12 w-12 rounded-md border object-cover"
            />
          );
        }
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border bg-slate-50 hover:bg-teal-50"
            title="Abrir archivo"
          >
            <FileText className="h-5 w-5 text-slate-500" />
          </a>
        );
      },
    },
    {
      accessorKey: 'codigo',
      header: 'Código',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-slate-700">
          {row.getValue('codigo') as string}
        </span>
      ),
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => {
        const text = row.getValue('nombre') as string;
        return (
          <p
            className="line-clamp-2 text-left text-sm leading-snug font-medium break-words text-slate-800"
            title={text}
          >
            {truncateText(text, PREVIEW_MAX_LENGTH)}
          </p>
        );
      },
    },
    {
      accessorKey: 'orden',
      header: 'Orden',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.getValue('orden')}</span>
      ),
    },
    {
      accessorKey: 'activo',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.getValue('activo') as boolean;
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
      id: 'acciones',
      header: 'Acción',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-8 w-8 hover:text-orange-500"
            title="Editar metadatos"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-8 w-8 hover:text-teal-600"
            title="Reemplazar archivo"
            onClick={() => onReplaceImage(row.original)}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-8 w-8"
            title="Eliminar"
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
        <CardTitle>Documentos registrados</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, código o descripción..."
            className="w-full min-w-0 sm:max-w-sm"
          />
          <Select
            value={activoFilter}
            onValueChange={(value) =>
              onActivoFilterChange(value as ActivoFilter)
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
                    const widths: Record<string, string> = {
                      archivo: 'w-[12%]',
                      codigo: 'w-[18%]',
                      nombre: 'w-[28%]',
                      orden: 'w-[10%]',
                      activo: 'w-[12%]',
                      acciones: 'w-[20%]',
                    };
                    const isText =
                      header.id === 'nombre' || header.id === 'codigo';
                    return (
                      <TableHead
                        key={header.id}
                        className={`${widths[header.id] ?? ''} text-muted-foreground px-2 text-center font-semibold ${isText ? 'whitespace-normal' : ''}`}
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
                      const isText =
                        cell.column.id === 'nombre' ||
                        cell.column.id === 'codigo';
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            isText
                              ? 'max-w-0 px-2 py-3 align-middle whitespace-normal'
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
                    No hay documentos de ejemplo registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {total > 0 && (
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              {total} documento{total === 1 ? '' : 's'} en total
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
