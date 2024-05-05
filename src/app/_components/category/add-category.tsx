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

import { Button } from '~/components/ui/button';
import { useMediaQuery } from 'usehooks-ts';
import { useState } from 'react';
import { cn } from '~/lib/utils';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Plus } from 'lucide-react';
import { Switch } from '~/components/ui/switch';
import { api } from '~/trpc/react';
import { SelectValue,Select, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/select';

export function AddCategoryDialog() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        Icon={Plus}
                        iconPlacement="left"
                        iconSize={20}
                        variant="ghostSelected"
                        className="justify-center gap-2"
                    >
                        Add new category
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-card sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add new category</DialogTitle>
                        <DialogDescription>
                            Add a new category and add it to the database.
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    Icon={Plus}
                    iconPlacement="left"
                    iconSize={20}
                    variant="ghostSelected"
                    className="justify-center gap-2"
                >
                    Add new category
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-card">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add new category</DrawerTitle>
                    <DrawerDescription>
                        Add a new category and add it to the database.
                    </DrawerDescription>
                </DrawerHeader>
                <CategoryForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function CategoryForm({ className }: React.ComponentProps<'form'>) {
    const [subChecked, setSubChecked] = useState(false);
    const categories = api.category.getAllCategories.useQuery();


    return (
        <form className={cn('grid items-start gap-4', className)}>
            <div className="grid gap-2">
                <Label htmlFor="name">Category name</Label>
                <Input type="text" id="name" placeholder="Transportation" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="type">Subcategory?</Label>
                <Switch
                    id="type"
                    className='bg-accent'
                    checked={subChecked}
                    onCheckedChange={() => setSubChecked(!subChecked)}
                ></Switch>
            </div>
            {subChecked &&
              <div className="grid gap-2">
                <Label htmlFor="assosiatedCategory">Assosiated Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Category"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.data?.map(category => (
                      <SelectItem value={category.id.toString()}>{category.name}</SelectItem>
                    ))

                    }
                  </SelectContent>
                </Select>
              </div>
            }
            <Button variant={"ghostSelected"} type="submit">Save changes</Button>
        </form>
    );
}
