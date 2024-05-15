'use client';

import BasicCard from '../card';
import { Button } from '~/components/ui/button';
import { Edit, Plus, Trash } from 'lucide-react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '~/components/ui/select';
import { FormEvent, useState } from 'react';
import { cn } from '~/lib/utils';
import { Switch } from '~/components/ui/switch';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { AdaptiveDialog } from '../adaptive-dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form';
import useBetterMediaQuery from '~/lib/useBetterMediaQuery';

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
    const isDesktop = useBetterMediaQuery()

    return (
        <BasicCard className={cn("p-5", isDesktop ? "min-w-[250px] max-w-[400px]" : "w-[100%]")}>
            <div className="flex flex-row items-start justify-between">
                <h1 className="font-bold text-accent-foreground">
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
                        description="Are you sure?"
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
            <AdaptiveDialog
                title="Add category"
                description="Add a new category and add it to the database."
            >
                <Button
                    Icon={Plus}
                    iconPlacement="left"
                    iconSize={20}
                    variant="ghostSelected"
                    className="justify-center gap-2"
                >
                    Add new category
                </Button>
                <CategoryForm></CategoryForm>
            </AdaptiveDialog>
        </BasicCard>
    );
}

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must have at least 2 characters.' })
        .max(30, { message: 'Name must have fewer than 30 characters.' }),
    type: z.boolean().optional(),
    subcategory: z.string().optional(),
});

function CategoryForm({ className }: React.ComponentProps<'form'>) {
    const categories = api.category.getAllCategories.useQuery();

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (values.subcategory) {
            createSubCategory.mutate({ name: values.name, categoryId: parseInt(values.subcategory)})
        } else {
            createCategory.mutate({ name: values.name });
        }
    };

    const createCategory = api.category.createCategory.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });
    
    const createSubCategory = api.subCategory.createCategory.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    return (
        <Form {...form}>
            <form
                className={cn('grid items-start gap-4', className)}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Transportation"
                                    {...field}
                                ></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                ></FormField>
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Subcategory?</FormLabel>
                            <FormControl>
                                <Switch
                                    id="type"
                                    className="bg-accent"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                ></Switch>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                ></FormField>
                {form.watch().type && (
                    <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assosiated Category</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Category"></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.data?.map(
                                                (category) => (
                                                    <SelectItem
                                                        key={`select_${category.id}`}
                                                        value={category.id.toString()}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}
                    ></FormField>
                )}
                <Button
                    variant={'ghostSelected'}
                    type="submit"
                >
                    Add category
                </Button>
            </form>
        </Form>
    );
}

function DeleteForm({
    className,
    idToDelete,
}: {
    className?: React.ComponentProps<'form'>;
    idToDelete: number;
}) {
    const router = useRouter();

    const handleCategoryDelete = async (
        e: FormEvent<HTMLFormElement>,
        id: number,
    ) => {
        e.preventDefault();
        await deleteSubCategory.mutateAsync(id)
        deleteCategory.mutate(id);
    };

    const deleteCategory = api.category.deleteCategoryById.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    const deleteSubCategory = api.subCategory.deleteSubCategoryByCategory.useMutation()

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            onSubmit={(e) => handleCategoryDelete(e, idToDelete)}
        >
            <Button variant={'ghostSelected'} type="submit">
                Delete
            </Button>
        </form>
    );
}
