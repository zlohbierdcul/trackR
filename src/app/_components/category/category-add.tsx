"use client"

import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { AdaptiveDialog } from "../adaptive-dialog";
import CategoryAddForm from "~/app/forms/category-add-form";
import { useState } from "react";

export default function CategoryAdd() {
    const [open, setOpen] = useState(false)

    return (
        <AdaptiveDialog
            title="Add category"
            description="Add a new category and add it to the database."
            open={open}
            setOpen={setOpen}
        >
            <Button
                Icon={Plus}
                iconPlacement="left"
                iconSize={20}
                variant="ghostSelected"
                className="justify-center gap-2 px-10"
            >
                Add new category
            </Button>
            <CategoryAddForm></CategoryAddForm>
        </AdaptiveDialog>
    );
}
