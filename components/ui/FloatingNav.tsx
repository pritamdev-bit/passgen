"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { HoverBorderGradientButton } from "../hovergradientbutton";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(true);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed sm:top-10 top-5 inset-x-0 mx-auto border  dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4 border-neutral-400",
          className
        )}
      >
        {navItems.map((navItem: { name: string; link: string; icon?: React.ReactNode }, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}
        {isSignedIn ? (
          <>
            <button onClick={() => signOut({redirectUrl: "/"})} className="border cursor-pointer dark:hover:bg-neutral-900 hover:bg-neutral-100 text-sm font-medium relative border-neutral-400 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
              <span>Sign out</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
            </button>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <button className="border cursor-pointer dark:hover:bg-neutral-900 hover:bg-neutral-100 text-sm font-medium relative border-neutral-400 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
                <span>Sign in</span>
                <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
              </button>
            </Link>
            <HoverBorderGradientButton />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
