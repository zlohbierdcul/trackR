'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~/components/ui/drawer';
import BasicCard from '../card';
import { CategoryTable } from './category-table';
import { Button } from '~/components/ui/button';
import { useMediaQuery } from 'usehooks-ts';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddCategoryDialog } from './add-category';

export default function CategoryCard() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <BasicCard className="p-5">
            <h1>Manage your categories</h1>
            <CategoryTable />
            <AddCategoryDialog></AddCategoryDialog>
        </BasicCard>
    );
}
