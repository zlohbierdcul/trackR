'use client';

import BasicCard from '../card';
import { CategoryTable } from './category-table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { AddCategoryDialog } from './add-category';
import { Button } from '~/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';

export default function CategoryCard({
    category,
}: {
    category: {
        id: number;
        name: string | null;
        subcategories: {
            id: number;
            name: string | null;
            categoryId: number | null;
        }[];
    };
}) {
    const router = useRouter()

    const handleCategoryDelete = (id: number) => {
        deleteCategory.mutate(id);
    };

    const deleteCategory = api.category.deleteCategoryById.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    return (
        <BasicCard className="w-[300px] p-5">
            <div className="flex flex-row justify-between items-center">
                <h1 className="font-bold text-accent-foreground">
                    {category.name}
                </h1>
                <div className='flex gap-2'>
                    <Button
                        size={'smallIcon'}
                        Icon={Edit}
                        iconPlacement="left"
                        iconSize={18}
                        variant={'ghostSelected'}
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size={'smallIcon'}
                                Icon={Trash}
                                iconPlacement="left"
                                iconSize={18}
                                variant={'destructive'}
                            />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the category.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        handleCategoryDelete(category.id)
                                    }
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            {category.subcategories.map((subCategory) => (
                <h2 key={`sub_${subCategory.id}`}>{subCategory.name}</h2>
            ))}
        </BasicCard>
    );
}
