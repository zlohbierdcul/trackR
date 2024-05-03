"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChartHorizontal,
  BookDashed,
  ListMinus,
  PanelLeftClose,
  PanelRightClose,
  Settings,
  StretchHorizontal,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

export default function LeftNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 overflow-hidden rounded-lg border-2 bg-card p-3 shadow-lg shadow-border transition-all",
        expanded ? "animate-accordion-right" : "animate-accordion-left",
      )}
    >
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => setExpanded(!expanded)}
      >
        <PanelLeftClose
          className={cn("m-0 transition-all", expanded ? "rotate-180" : "")}
        />
      </Button>
      <Button
        variant={pathname === "/" ? "ghostSelected" : "ghost"}
        size={expanded ? "iconText" : "icon"}
        Icon={BarChartHorizontal}
        className={expanded ? "pr-20" : ""}
        iconPlacement="left"
        onClick={() => router.push("/")}
      >
        Overview
      </Button>
      <Button
        variant={pathname === "/entries" ? "ghostSelected" : "ghost"}
        size={expanded ? "iconText" : "icon"}
        Icon={ListMinus}
        className={expanded ? "pr-20" : ""}
        iconPlacement="left"
        onClick={() => router.push("/entries")}
      >
        Entries
      </Button>
      <Button
        variant={pathname === "/income" ? "ghostSelected" : "ghost"}
        size={expanded ? "iconText" : "icon"}
        Icon={ArrowUpRight}
        className={expanded ? "pr-20" : ""}
        iconPlacement="left"
        onClick={() => router.push("/income")}
      >
        Income
      </Button>
      <Button
        variant={pathname === "/expenses" ? "ghostSelected" : "ghost"}
        size={expanded ? "iconText" : "icon"}
        Icon={ArrowDownRight}
        className={expanded ? "pr-20" : ""}
        iconPlacement="left"
        onClick={() => router.push("/expenses")}
      >
        Expenses
      </Button>
      <Button
        variant={pathname === "/categories" ? "ghostSelected" : "ghost"}
        size={expanded ? "iconText" : "icon"}
        Icon={StretchHorizontal}
        className={expanded ? "pr-20" : ""}
        iconPlacement="left"
        onClick={() => router.push("/categories")}
      >
        Categories
      </Button>
      <Button
        variant={pathname === "/settings" ? "ghostSelected" : "ghost"}
        size={expanded ? "iconText" : "icon"}
        Icon={Settings}
        className={expanded ? "pr-20" : ""}
        iconPlacement="left"
        onClick={() => router.push("/settings")}
      >
        Settings
      </Button>
    </div>
  );
}
