"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";

import {BarChartHorizontal, BookDashed, PanelLeftClose, PanelRightClose} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

export default function LeftNav() {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false)
  
    return (
      <div className={cn("overflow-hidden flex flex-col gap-4 bg-card border-2 rounded-lg p-3 shadow-border shadow-lg transition-all", expanded ? "animate-accordion-right" : "animate-accordion-left")}>
          <Button variant={"outline"} size={"icon"} onClick={() => setExpanded(!expanded)}>
            <PanelLeftClose className={cn("m-0 transition-all", expanded ? "rotate-180" : "")} />
          </Button>
          <Button variant={"outline"} size={expanded ? "default" : "icon"} onClick={() => router.push("/category")}>
            <BarChartHorizontal className="m-0" />
            {expanded &&
              "Overview"
            }
          </Button>
      </div>
    )
  }