"use client";

import * as React from "react";
import { type ChangeEvent, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { type CheckedState } from "@radix-ui/react-checkbox";

export type SearchField = {
  displayName: string;
  searchFieldName: string;
};

type Props = {
  availableSearchFields: Array<SearchField>;

  query: string | undefined;
  setQuery: (query: string) => void;

  searchField: string | undefined;
  setSearchField: (searchField: string) => void;
};

export const TableSearch = (props: Props) => {
  const query = props.query;
  const setQuery = props.setQuery;
  const checkedFields = [props.searchField];
  const setSearchFields = props.setSearchField;

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [setQuery],
  );

  const handleCheckedFieldsChange = useCallback(
    (searchFieldName: string) => {
      const index = checkedFields.indexOf(searchFieldName);
      if (index !== -1) {
        checkedFields.splice(index, 1);
      } else {
        checkedFields.push(searchFieldName);
      }

      setSearchFields(searchFieldName);
    },
    [checkedFields, setSearchFields],
  );

  const isInCheckedFields = useCallback(
    (searchFieldName: string) => {
      return checkedFields.includes(searchFieldName);
    },
    [checkedFields],
  );

  return (
    <>
      <Input
        autoFocus={true}
        placeholder={"Search.."}
        defaultValue={query ?? ""}
        onChange={debounce(handleQueryChange)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={"icon"}
            className="relative w-10 shrink-0"
          >
            <ListFilter className={"h-5 w-5"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {props.availableSearchFields.map((searchField) => {
            return (
              <DropdownMenuCheckboxItem
                key={searchField.searchFieldName}
                className="capitalize"
                checked={
                  isInCheckedFields(searchField.searchFieldName) as CheckedState
                }
                onCheckedChange={() =>
                  handleCheckedFieldsChange(searchField.searchFieldName)
                }
              >
                {searchField.displayName}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
