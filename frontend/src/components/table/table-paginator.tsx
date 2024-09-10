import { Paginator } from "@/components/paginator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  page: number | undefined;
  setPage: (page: number) => void;
  pageSize: number | undefined;
  setPageSize: (pageSize: number) => void;
  totalPages: number | undefined;
};

export const TablePaginator = (props: Props) => {
  return (
    <div className="mt-4 flex w-full items-center justify-between">
      <Paginator
        number={Number(props.page)}
        totalPages={Number(props.totalPages)}
        setCurrentPage={props.setPage}
      />

      <Select
        value={String(props.pageSize)}
        onValueChange={(value) => props.setPageSize(Number(value))}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Select page size" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
