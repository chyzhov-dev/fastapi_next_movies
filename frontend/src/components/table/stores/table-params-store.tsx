import { createStore, useStore } from "zustand";
import { SortingState } from "@tanstack/react-table";

import { createContext, PropsWithChildren, useContext, useRef } from "react";

export type TableParamsStoreState = {
  searchField: string | undefined;
  setSearchField: (value: string | undefined) => void;

  searchQuery: string | undefined;
  setSearchQuery: (value: string | undefined) => void;

  page: number | undefined;
  setPage: (value: number | undefined) => void;

  totalPages: number | undefined;
  setTotalPages: (value: number | undefined) => void;

  pageSize: number | undefined;
  setPageSize: (value: number | undefined) => void;

  sorting: SortingState;
  setSorting: (value: SortingState) => void;

  getUrlParams: () => URLSearchParams;
};

export type TableParamsStore = ReturnType<typeof createTableParamsStore>;

export const createTableParamsStore = () => {
  return createStore<TableParamsStoreState>()((set, get) => ({
    searchField: undefined,
    setSearchField: (value) => set({ searchField: value ?? undefined }),

    searchQuery: undefined,
    setSearchQuery: (value) =>
      set({
        page: undefined,
        searchQuery: value ?? undefined,
      }),

    page: 1,
    setPage: (value) => set({ page: value ?? undefined }),

    totalPages: 0,
    setTotalPages: (value) => set({ totalPages: value ?? undefined }),

    pageSize: 10,
    setPageSize: (value) =>
      set({
        page: undefined,
        pageSize: value ?? undefined,
      }),

    sorting: [],
    setSorting: (value) =>
      set({
        sorting: value,
      }),

    getUrlParams: () => {
      const params = new URLSearchParams();
      const store = get();
      if (store.searchField) {
        params.set("search_field", store.searchField);
      }
      if (store.searchQuery) {
        params.set("search_query", store.searchQuery);
      }
      if (store.page) {
        params.set("page", String(store.page));
      }
      if (store.pageSize) {
        params.set("page_size", String(store.pageSize));
      }
      if (store.sorting.length) {
        const sort = store.sorting[0];

        if (sort) {
          params.set("sort_by", sort.id);
          params.set("sort_direction", sort.desc ? "desc" : "asc");
        }
      }

      return params;
    },
  }));
};

type TableParamsProviderProps = PropsWithChildren<{}>;

export const TableParamsContext = createContext<TableParamsStore | null>(null);

export function TableParamsProvider(props: TableParamsProviderProps) {
  const storeRef = useRef<TableParamsStore>();
  if (!storeRef.current) {
    storeRef.current = createTableParamsStore();
  }

  return (
    <TableParamsContext.Provider value={storeRef.current}>
      {props.children}
    </TableParamsContext.Provider>
  );
}

export function useTableParamsContext<T>(
  selector: (state: TableParamsStoreState) => T,
): T {
  const store = useContext(TableParamsContext);
  if (!store) throw new Error("Missing TableContext.Provider in the tree");

  return useStore(store, selector);
}
