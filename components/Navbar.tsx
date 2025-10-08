"use client";
import React from "react";
import { IconHome, IconLockSquareRounded } from "@tabler/icons-react";
import { FloatingNav } from "@/components/ui/FloatingNav"

export function Navbar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Vault",
      link: "/vault",
      icon: <IconLockSquareRounded className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    
  ];
  return (
    <div className="relative  w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}

