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

import { Button } from '~/components/ui/button';
import { useMediaQuery } from 'usehooks-ts';
import { Dispatch, SetStateAction, useState } from 'react';

export function AdaptiveDialog({
    children,
    title,
    description,
    open,
    setOpen
}: {
    children: React.ReactNode[];
    title: string,
    description: string,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children[0]}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    {children[1]}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children[0]}
            </DrawerTrigger>
            <DrawerContent id="drawer-content">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add new category</DrawerTitle>
                    <DrawerDescription>
                        Add a new category and add it to the database.
                    </DrawerDescription>
                </DrawerHeader>
                    {children[1]}
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}


