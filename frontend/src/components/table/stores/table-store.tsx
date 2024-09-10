import type {
  ColumnOrderState,
  ColumnSizingState,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useRef,
} from "react";

export type TableStoreProps = {
  name: string;
};

export type TableStoreState = {
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  sizingState: ColumnSizingState;
  orderingState: ColumnOrderState;
  visibilityState: VisibilityState;

  setSizeState: (updaterOrValue: Updater<ColumnSizingState>) => void;
  setOrderingState: (updaterOrValue: Updater<ColumnOrderState>) => void;
  setVisibilityState: (updaterOrValue: Updater<VisibilityState>) => void;
};

export type TableStore = ReturnType<typeof createTableStore>;

export const createTableStore = (props: TableStoreProps) => {
  return createStore<TableStoreState>()(
    persist(
      (set, get) => ({
        _hasHydrated: false,
        setHasHydrated: (value) => {
          return set({
            _hasHydrated: value,
          });
        },

        sizingState: {},
        orderingState: [],
        visibilityState: {},

        setSizeState: (updaterOrValue) => {
          const prev = get();
          const newValue =
            typeof updaterOrValue === "function"
              ? updaterOrValue(prev.sizingState)
              : updaterOrValue;

          return set({
            sizingState: newValue,
          });
        },

        setOrderingState: (updaterOrValue) => {
          const prev = get();
          const newValue =
            typeof updaterOrValue === "function"
              ? updaterOrValue(prev.orderingState)
              : updaterOrValue;

          return set({
            orderingState: newValue,
          });
        },

        setVisibilityState: (updaterOrValue) => {
          const prev = get();
          const newValue =
            typeof updaterOrValue === "function"
              ? updaterOrValue(prev.visibilityState)
              : updaterOrValue;

          return set({
            visibilityState: newValue,
          });
        },
      }),
      {
        name: props.name,
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  );
};

type TableProviderProps = PropsWithChildren<TableStoreProps>;

export const TableContext = createContext<TableStore | null>(null);

export function TableProvider(props: TableProviderProps) {
  const storeRef = useRef<TableStore>();
  if (!storeRef.current) {
    storeRef.current = createTableStore(props);
  }

  return (
    <TableContext.Provider value={storeRef.current}>
      {props.children}
    </TableContext.Provider>
  );
}

export function useTableContext<T>(selector: (state: TableStoreState) => T): T {
  const store = useContext(TableContext);
  if (!store) throw new Error("Missing TableContext.Provider in the tree");

  return useStore(store, selector);
}
