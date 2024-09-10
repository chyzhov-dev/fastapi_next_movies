import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";

type Props<T> = {
  table: Table<T>;

  actions: Array<{
    label: string;
    disabled: boolean;
    onClick: (rowKeys: string[]) => void;
  }>;
};

export function TableActions<T>(props: Props<T>) {
  if (props.actions.length === 0) return null;
  const selectedRows = props.table.getSelectedRowModel().rows;

  if (selectedRows.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 m-auto flex w-fit flex-row flex-wrap gap-2 rounded-lg border bg-background p-1">
      {props.actions.map((action) => (
        <Button
          key={action.label}
          size={"sm"}
          variant={"secondary"}
          disabled={action.disabled}
          onClick={() => action.onClick(selectedRows.map((row) => row.id))}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
