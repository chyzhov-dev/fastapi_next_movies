"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clear = () => {
    router.replace(pathname);
  };

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const append = (key: string, ...value: string[]) => {
    const params = new URLSearchParams(searchParams);
    value.forEach((v) => params.append(key, v));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const appendJson = (key: string, value: unknown) => {
    const params = new URLSearchParams(searchParams);
    params.append(key, JSON.stringify(value));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const read = (key: string) => {
    return searchParams.get(key);
  };

  const readJson = <T,>(key: string) => {
    const value = searchParams.get(key);
    if (value) {
      return JSON.parse(value) as T;
    }
  };

  const set = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setJson = <T,>(key: string, value: T) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, JSON.stringify(value));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return {
    router,
    pathname,
    searchParams,
    clear,
    remove,
    append,
    appendJson,
    read,
    readJson,
    set,
    setJson,
  };
}
