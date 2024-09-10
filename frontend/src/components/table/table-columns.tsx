"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Columns3 } from "lucide-react";
import * as React from "react";
import type { Table } from "@tanstack/table-core";
import { Reorder, useDragControls } from "framer-motion";
import { ReorderIcon } from "@/components/ui/reorder-icon";

type Props<T> = {
  table: Table<T>;
};

function sortByReferenceArray<T extends { id: string }>(
  arr: T[],
  referenceArr: string[],
): T[] {
  const idIndexMap = new Map(referenceArr.map((id, index) => [id, index]));

  return arr.sort((a, b) => {
    const indexA = idIndexMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const indexB = idIndexMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return indexA - indexB;
  });
}

export const TableColumns = <T,>(props: Props<T>) => {
  const columns = (() => {
    const unorderedColumns = props.table.getAllColumns();
    const order = props.table.getState().columnOrder;

    return sortByReferenceArray<(typeof unorderedColumns)[0]>(
      unorderedColumns,
      order,
    );
  })();

  const dragControls = useDragControls();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={"icon"}
          className="relative w-10 shrink-0"
        >
          <Columns3 className={"h-5 w-5"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Reorder.Group
          axis="y"
          values={columns.map((c) => c.id)}
          onReorder={props.table.setColumnOrder}
        >
          {columns.map((column) => {
            return (
              <Reorder.Item
                value={column.id}
                key={column.id}
                className={"flex items-center justify-between gap-2 px-2"}
              >
                <DropdownMenuCheckboxItem
                  className="w-full capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => {
                    column.toggleVisibility(value);
                  }}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>

                <ReorderIcon
                  dragControls={dragControls}
                  className={"h-5 w-5"}
                />
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
