"use client";

import * as React from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableColumns } from "@/components/table/table-columns";
import { TableHeading } from "@/components/table/table-heading";
import { TableContent } from "@/components/table/table-content";
import { TablePaginator } from "@/components/table/table-paginator";
import { type SearchField, TableSearch } from "@/components/table/table-search";
import {
  TableProvider,
  useTableContext,
} from "@/components/table/stores/table-store";
import { AnimatePresence } from "framer-motion";
import { Loader } from "@/components/ui/loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCallWrapper, toastOnError } from "@/lib/api-client";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { GenreEditModalContent } from "./genre-edit-modal";
import {
  TableParamsProvider,
  useTableParamsContext,
} from "@/components/table/stores/table-params-store";
import { TableSortButton } from "@/components/table/table-sort-button";
import { TableActions } from "@/components/table/table-actions";

export type Genre = {
  id: number;
  name: string;
};

export type GenrePage = {
  items: Genre[];
  current_page: number;
  total_pages: number;
};

const availableSearchFields: Array<SearchField> = [
  {
    displayName: "ID",
    searchFieldName: "id",
  },
  {
    displayName: "Name",
    searchFieldName: "name",
  },
];

const Actions = ({ row }: { row: Row<Genre> }) => {
  const genre = row.original;
  const queryClient = useQueryClient();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            className="mt-0.5 gap-2 hover:!bg-destructive hover:!text-destructive-foreground"
            onClick={() => {
              if (!confirm("Are you sure you want to delete this genre?"))
                return;

              apiCallWrapper({
                endpoint: `api/genres/${genre.id}`,
                method: "DELETE",
                onError: toastOnError,
              }).then((response) => {
                if (!response) return;

                toast.success("Genre deleted successfully");
                queryClient.invalidateQueries({
                  queryKey: ["genres"],
                });
              });
            }}
          >
            <Trash className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <GenreEditModalContent genre={genre} />
    </Dialog>
  );
};

const columns: ColumnDef<Genre>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <TableSortButton column={column}>ID</TableSortButton>
    ),
    cell: ({ row }) => {
      return <div className="lowercase">{row.getValue("id")}</div>;
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <TableSortButton column={column}>Name</TableSortButton>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

export const GenreTable = () => {
  return (
    <TableParamsProvider>
      <TableProvider name={"genre-table-state"}>
        <GenreTableContent />
      </TableProvider>
    </TableParamsProvider>
  );
};

const GenreTableContent = () => {
  const [rowSelection, setRowSelection] = React.useState({});

  const sizingState = useTableContext((s) => s.sizingState);
  const orderingState = useTableContext((s) => s.orderingState);
  const visibilityState = useTableContext((s) => s.visibilityState);

  const setSizingState = useTableContext((s) => s.setSizeState);
  const setOrderingState = useTableContext((s) => s.setOrderingState);
  const setVisibilityState = useTableContext((s) => s.setVisibilityState);

  const hasHydrated = useTableContext((s) => s._hasHydrated);

  const store = useTableParamsContext((s) => s);

  const query = useQuery({
    queryKey: [
      "genres",
      store.searchField,
      store.searchQuery,
      store.page,
      store.pageSize,
      store.sorting,
    ],
    queryFn: async () => {
      const params = store.getUrlParams();

      const result = await apiCallWrapper<GenrePage>({
        endpoint: "api/genres",
        method: "GET",
        onError: toastOnError,
        params,
      });

      store.setTotalPages(result?.total_pages);
      store.setPage(result?.current_page);

      return result?.items ?? [];
    },
  });

  const data = React.useMemo(() => query.data ?? [], [query.data]);

  const actions = React.useMemo(
    () => [
      {
        label: "Delete",
        disabled: false,
        onClick: (rowKeys: string[]) => {
          if (!confirm("Are you sure you want to delete selected genres?"))
            return;

          const ids = rowKeys.map((id) => Number(id));

          ids.forEach((id) => {
            apiCallWrapper({
              endpoint: `api/genres/${id}`,
              method: "DELETE",
              onError: toastOnError,
            }).then((response) => {
              if (!response) return;

              toast.success("Genres deleted successfully");
              query.refetch();
            });
          });
        },
      },
    ],
    [rowSelection],
  );

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getRowId: (row) => String(row.id),
    rowCount: data.length,
    onSortingChange: (updater) => {
      const newDate =
        updater instanceof Function ? updater(store.sorting) : updater;
      store.setSorting(newDate);
    },
    onColumnVisibilityChange: setVisibilityState,
    onColumnSizingChange: setSizingState,
    onColumnOrderChange: setOrderingState,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting: store.sorting,
      rowSelection,

      columnSizing: sizingState ?? {},
      columnOrder: orderingState ?? [],
      columnVisibility: visibilityState ?? {},
    },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  return (
    <AnimatePresence mode={"popLayout"}>
      {!hasHydrated ? (
        <Loader />
      ) : (
        <div className="w-full">
          <div className="flex w-full items-center gap-2 py-4">
            <TableSearch
              availableSearchFields={availableSearchFields}
              query={store.searchQuery}
              setQuery={store.setSearchQuery}
              searchField={store.searchField}
              setSearchField={store.setSearchField}
            />
            <TableColumns table={table} />
          </div>

          <div className="relative rounded-lg border">
            {query.isFetching && <Loader className={"absolute inset-0"} />}
            <ScrollArea className={"w-full"}>
              <Table className={"w-full"}>
                <TableHeading table={table} />
                <TableContent table={table} dataLength={columns.length} />
              </Table>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <TablePaginator
            page={store.page}
            setPage={store.setPage}
            pageSize={store.pageSize}
            setPageSize={store.setPageSize}
            totalPages={store.totalPages}
          />

          <TableActions table={table} actions={actions} />
        </div>
      )}
    </AnimatePresence>
  );
};
