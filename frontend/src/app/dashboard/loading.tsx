"use client";

import { LoadingIcon } from "@/components/ui/loading-icon";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function Loading(props: Props) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/70",
        props.className,
      )}
    >
      <LoadingIcon show={true} className={"h-8 w-8"} />
    </div>
  );
}
