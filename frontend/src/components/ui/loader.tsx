"use client";

import { forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { LoadingIcon } from "@/components/ui/loading-icon";
import { cn } from "@/lib/utils";

type Props = {
  key?: string;
  className?: string;
};

export const Loader = memo(
  forwardRef((props: Props, ref) => {
    return (
      <motion.div
        key={props.key ?? "loader"}
        initial={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "z-30 flex h-full min-h-[200px] w-full items-center justify-center rounded-lg bg-black/70",
          props.className,
        )}
      >
        <LoadingIcon show={true} className={"h-8 w-8"} />
      </motion.div>
    );
  }),
);
