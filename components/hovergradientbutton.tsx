"use client";
import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import Link from "next/link";

export function HoverBorderGradientButton() {
    return (
        <div className=" flex justify-center text-center">
            <Link href="/sign-up">
                <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center cursor-pointer"
                >
                    <span>Sign up</span>
                </HoverBorderGradient>
            </Link>
        </div>
    );
}
