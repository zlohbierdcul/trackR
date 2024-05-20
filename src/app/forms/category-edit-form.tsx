import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { useDrawerObserver } from '~/lib/useDrawerObserver';
import { AdaptiveDialog } from '../_components/adaptive-dialog';
import { Trash } from 'lucide-react';
import DeleteForm from './delete-form';

type SubCategory = {
    name: string;
    id: number;
    categoryId: number | null;
};

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must have at least 2 characters.' })
        .max(30, { message: 'Name must have fewer than 30 characters.' }),
    subcategory: z.object({
        id: z.number(),
        name: z
            .string()
            .min(2, { message: 'Name must have at least 2 characters.' })
            .max(30, { message: 'Name must have fewer than 30 characters.' }),
    }),
});

// TODO: Refactor types
export default function CategoryEditForm({
    categoryId,
    setOpen,
    className,
}: {
    categoryId: number;
    setOpen: Dispatch<SetStateAction<boolean>>;
    className?: React.ComponentProps<'form'>;
}) {
    useDrawerObserver();

    // API calls
    const category = api.category.getCategoryById.useQuery(categoryId);
    const subCategories = api.subCategory.getCategoriesById.useQuery(categoryId);
    const deleteSubCategory = api.subCategory.deleteSubCategoyById.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });
    const editSubCategoryName = api.subCategory.editNameById.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });
    const editCategoryName = api.category.editNameById.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    const router = useRouter();

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [subCategoriesData, setSubCategoriesData] = useState<SubCategory[]>([]);
    const [changedSubCategories, setChangedSubCategories] = useState<Map<number, string>>(new Map());
    const [deletedSubCategories, setDeletedSubCategories] = useState<number[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const categoryName = category.data?.at(0)?.name;
        if (categoryName) {
            form.setValue('name', categoryName);
        }
    }, [category.data]);

    useEffect(() => {
        if (subCategories.data) {
            const subCategoryName = subCategories.data.at(0)?.name;
            const subCategoryId = subCategories.data.at(0)?.id;
            const subCategoryCategoryId = subCategories.data.at(0)?.categoryId;

            if (subCategoryId && subCategoryName && typeof subCategoryCategoryId !== 'undefined') {
                form.setValue('subcategory.id', subCategoryId);
                form.setValue('subcategory.name', subCategoryName);

                setSelectedSubCategory({ id: subCategoryId, name: subCategoryName, categoryId: subCategoryCategoryId });
            }
            setSubCategoriesData(subCategories.data);
        }
    }, [subCategories.data]);

    const handleSelectChange = (e: string) => {
        const subCategoryId = parseInt(e);
        const subCategory = subCategoriesData.find((subCategory) => subCategory.id === subCategoryId);

        if (subCategory) {
            form.setValue('subcategory.id', subCategory.id);
            form.setValue('subcategory.name', subCategory.name);
            setSelectedSubCategory(subCategory);
        }
    };

    const handleSubNameChange = (e: FormEvent<HTMLInputElement>) => {
        const currentSubCategory = form.getValues('subcategory');
        const newSubCategoryName = (e.target as HTMLInputElement).value;

        if (currentSubCategory.name !== newSubCategoryName) {
            const tempChangedSubCategories = changedSubCategories;
            tempChangedSubCategories.set(currentSubCategory.id, newSubCategoryName);
            setChangedSubCategories(tempChangedSubCategories);

            form.setValue('subcategory.name', newSubCategoryName);

            const tempSubCategoriesData = subCategoriesData;
            tempSubCategoriesData.map((sub) => {
                if (sub.id === currentSubCategory.id) sub.name = newSubCategoryName;
            });
            setSubCategoriesData(tempSubCategoriesData);

            setSelectedSubCategory(
                tempSubCategoriesData.find((subCategory) => subCategory.id === currentSubCategory.id)
            );
        }
    };

    const handleSubCategoryDelete = async (e: FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        e.stopPropagation();

        const tempDeleted = deletedSubCategories;
        tempDeleted.push(id);
        setDeletedSubCategories(tempDeleted);

        const tempData = subCategoriesData;
        tempData.splice(
            tempData.findIndex((sub) => sub.id === id),
            1
        );
        setSubCategoriesData(tempData);

        const newSelectedSubCategory = subCategoriesData[0];

        if (newSelectedSubCategory) {
            form.setValue('subcategory', {
                id: newSelectedSubCategory.id,
                name: newSelectedSubCategory.name,
            });

            setSelectedSubCategory(newSelectedSubCategory);
        }

        setDeleteOpen(false);
    };

    const handleFormSubmit: (values: z.infer<typeof formSchema>) => void = (values) => {
        if (values.name !== category.data?.at(0)?.name) {
            const categoryId = category.data?.at(0)?.id;
            if (categoryId) {
                editCategoryName.mutate({ id: categoryId, name: values.name });
            }
        }

        if (deletedSubCategories.length > 0) {
            deletedSubCategories.forEach((deletedSubCategoryId) => {
                deleteSubCategory.mutate(deletedSubCategoryId);
            });
        }

        if (changedSubCategories.size > 0) {
            changedSubCategories.forEach((changedSubCategoryName, changedSubCategoryId) => {
                editSubCategoryName.mutate({
                    id: changedSubCategoryId,
                    name: changedSubCategoryName,
                });
            });
        }

        setOpen(false);
    };

    return (
        <Form {...form}>
            <form
                className={cn('mx-4 grid items-start gap-4 md:mx-0', className)}
                onSubmit={form.handleSubmit(handleFormSubmit)}>
                {form.watch().name && (
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Transportation" {...field}></Input>
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}></FormField>
                )}
                {subCategoriesData.length > 0 && selectedSubCategory ? (
                    <>
                        <FormField
                            control={form.control}
                            name="subcategory.name"
                            render={({ field }) => (
                                <div className="flex w-full items-end gap-2">
                                    <FormItem className="grow">
                                        <FormLabel>Subcategory</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(e) => handleSelectChange(e)}
                                                defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue key={`sub_select_default_${selectedSubCategory.id}`}>
                                                        {selectedSubCategory.name}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subCategoriesData.map((category) => (
                                                        <SelectItem
                                                            key={`sub_select_${category.id}`}
                                                            value={`${category.id}`}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                    <AdaptiveDialog
                                        key={`del_form_cat_${selectedSubCategory.id}`}
                                        title="Delete category?"
                                        description="This permanatly deletes this category and all its sub categories. Are you sure?"
                                        open={deleteOpen}
                                        setOpen={setDeleteOpen}>
                                        <Button
                                            size={'icon'}
                                            Icon={Trash}
                                            iconPlacement="left"
                                            iconSize={20}
                                            variant={'destructive'}
                                        />
                                        <DeleteForm
                                            deleteHandler={(e) => handleSubCategoryDelete(e, selectedSubCategory.id)}
                                        />
                                    </AdaptiveDialog>
                                </div>
                            )}></FormField>
                        <FormField
                            control={form.control}
                            name="subcategory.name"
                            render={({ field }) => (
                                <FormItem className="grow">
                                    <FormLabel>Subcategory Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Fuel"
                                            onChangeCapture={handleSubNameChange}
                                            {...field}></Input>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}></FormField>
                    </>
                ) : (
                    category.data && category.data.at(0)?.type === 'Expense' && 'No subcatories'
                )}

                <Button variant={'ghostSelected'} type="submit">
                    Save
                </Button>
            </form>
        </Form>
    );
}
