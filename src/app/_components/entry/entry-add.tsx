'use client';

import { Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AdaptiveDialog } from '../adaptive-dialog';
import CategoryAddForm from '~/app/forms/category-add-form';
import { useState } from 'react';
import { cn } from '~/lib/utils';
import EntryAddForm from '~/app/forms/entry-add-form';

export default function EntryAdd({ type, className }: { type: 'Income' | 'Expense', className?: string }) {
    const [open, setOpen] = useState(false);

    return (
        <AdaptiveDialog
            title={"Add " + type}
            description={"Add a new " + type.toLowerCase() + " and add it to the database."}
            open={open}
            setOpen={setOpen}>
            <Button
                Icon={Plus}
                iconPlacement="left"
                iconSize={20}
                variant="ghostSelected"
                className={cn("justify-center gap-2", className)}>
                Add {type}
            </Button>
            <EntryAddForm type={type} setOpen={setOpen}></EntryAddForm>
        </AdaptiveDialog>
    );
}
