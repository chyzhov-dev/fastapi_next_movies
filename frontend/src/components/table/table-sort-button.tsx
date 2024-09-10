import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";

export const TableSortButton = <T,>({
  column,
  children,
}: React.PropsWithChildren<{ column: Column<T> }>) => {
  const sort = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      {sort === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
      {sort === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
    </Button>
  );
};
