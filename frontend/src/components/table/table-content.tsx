import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import * as React from "react";
import type { Table } from "@tanstack/table-core";

type Props<T> = {
  table: Table<T>;
  dataLength: number;
};

export const TableContent = <T,>(props: Props<T>) => {
  return (
    <TableBody>
      {props.table.getRowModel().rows?.length ? (
        props.table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{
                  width: cell.column.getSize(),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={props.dataLength} className="h-24 text-center">
            There are no items in the table
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
