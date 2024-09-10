"use client";

import { SidebarItem } from "./sidebar-item";
import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SidebarLogo } from "@/app/dashboard/components/sidebar/sidebar-logo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";

const sidebarContent = [
  {
    icon: <Icon icon="ri:movie-2-line" className={"h-5 w-5"} />,
    text: "Movies",
    href: "/dashboard/movies",
  },
  {
    icon: <Icon icon="lucide:drama" className={"h-5 w-5"} />,
    text: "Genres",
    href: "/dashboard/genres",
  },
];

export const Sidebar = memo(() => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <motion.aside
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      animate={isOpen ? { width: "250px" } : { width: "50px" }}
      className={`fixed top-0 z-20 flex h-full flex-col items-center gap-2 overflow-y-auto overflow-x-hidden rounded-lg border-r bg-background px-1 py-6`}
      layout
    >
      <div className={`h-20`}>
        <SidebarLogo isOpen={isOpen} />
      </div>

      {sidebarContent.map((item, idx) => (
        <SidebarItem {...item} isOpen={isOpen} key={idx} />
      ))}
    </motion.aside>
  );
});
