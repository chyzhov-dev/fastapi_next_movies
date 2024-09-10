import { env } from "@/env";
import { toast } from "sonner";

type ApiResponse<T> = {
  data: T;
  error?: string;
  status: number;
};

type ApiCallOptions = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  params?: URLSearchParams;
};

export const apiCall = async <T>(options: ApiCallOptions) => {
  let url = `${env.NEXT_PUBLIC_BACKEND_URL}/${options.endpoint}`;
  if (options.params) {
    console.log(options.params.toString());
    url += `?${options.params.toString()}`;
  }

  const response = await fetch(url, {
    method: options.method,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200 && response.status !== 201) {
    if (response.headers.get("Content-Type") === "application/json") {
      const json = await response.json();
      throw json;
    }

    throw "Something went wrong";
  }

  const json = (await response.json()) as ApiResponse<T>;

  if (json.error) {
    throw json.error;
  }

  return json.data;
};

export const apiCallWrapper = async <T>(
  options: ApiCallOptions & { onError?: (error: unknown) => void },
) => {
  try {
    return await apiCall<T>(options);
  } catch (error) {
    if (options.onError) {
      options.onError(error);
    }
  }
};

export const logOnError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
};

export const toastOnError = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(JSON.stringify(error));
  }
};
