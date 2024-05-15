"use client"

import { Plus } from "lucide-react";
import CategoryForm from "~/app/forms/category-form";
import { Button } from "~/components/ui/button";
import { AdaptiveDialog } from "../adaptive-dialog";

export default function CategoryAdd() {
    return (
        <AdaptiveDialog
            title="Add category"
            description="Add a new category and add it to the database."
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
            <CategoryForm></CategoryForm>
        </AdaptiveDialog>
    );
}
