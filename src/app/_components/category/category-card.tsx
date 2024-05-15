'use client';

import BasicCard from '../card';
import { Button } from '~/components/ui/button';
import { Edit, Trash } from 'lucide-react';

import { cn } from '~/lib/utils';

import { AdaptiveDialog } from '../adaptive-dialog';

import useBetterMediaQuery from '~/lib/useBetterMediaQuery';
import DeleteForm from '~/app/forms/delete-form';

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
    const isDesktop = useBetterMediaQuery();

    return (
        <BasicCard
            className={cn(
                'p-5',
                isDesktop ? 'min-w-[220px] max-w-[400px]' : 'w-[100%]',
            )}
        >
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-xl truncate">
                    {category.name}
                </h1>
                <div className="flex gap-2">
                    <Button
                        size={'smallIcon'}
                        Icon={Edit}
                        iconPlacement="left"
                        iconSize={18}
                        variant={'ghostSelected'}
                    />
                    <AdaptiveDialog
                        key={`del_form_cat_${category.id}`}
                        title="Delete category?"
                        description='This permanatly deletes this category and all its sub categories. Are you sure?'
                    >
                        <Button
                            size={'smallIcon'}
                            Icon={Trash}
                            iconPlacement="left"
                            iconSize={18}
                            variant={'destructive'}
                        />
                        <DeleteForm idToDelete={category.id} />
                    </AdaptiveDialog>
                </div>
            </div>
            {category.subcategories.map((subCategory) => (
                <h2 key={`sub_${subCategory.id}`}>{subCategory.name}</h2>
            ))}
        </BasicCard>
    );
}
