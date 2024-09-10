"use client";

import { memo, type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  icon: ReactNode;
  text: string;
  href: string;
  isOpen: boolean;
};

export const SidebarItem = memo((props: Props) => {
  const pathname = usePathname();
  const isActive = pathname.includes(props.href) && props.href !== "/";

  const [beenOpen, setBeenOpen] = useState(false);
  useEffect(() => {
    if (props.isOpen) setBeenOpen(true);
  }, [props.isOpen]);

  const MotionButton = motion(Button);

  return (
    <Link href={props.href} className={"w-full"}>
      <MotionButton
        layout
        variant={isActive ? "default" : "ghost"}
        className={`flex w-full items-center justify-start px-2.5`}
      >
        <motion.div layout>{props.icon}</motion.div>

        <motion.p
          layout
          animate={
            props.isOpen
              ? { opacity: 1, scale: 1, width: "fit-content" }
              : { opacity: 0, scale: 0.7, width: 0 }
          }
          className={`ml-2 ${!beenOpen && "w-0 scale-0 opacity-0"}`}
        >
          {props.text}
        </motion.p>
      </MotionButton>
    </Link>
  );
});
