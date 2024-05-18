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
import { Input } from '~/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '~/components/ui/select';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { FormEvent, useEffect, useState } from 'react';

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must have at least 2 characters.' })
        .max(30, { message: 'Name must have fewer than 30 characters.' }),
    subcategory: z.object({
        id: z.number().optional(),
        name: z.string().optional(),
    }),
});

export default function CategoryEditForm({
    categoryId,
    className,
}: {
    categoryId: number;
    className?: React.ComponentProps<'form'>;
}) {
    const router = useRouter();
    const [subCategoriesData, setSubCategoriesData] = useState<
        { name: string | null; id: number; categoryId: number | null }[]
    >([]);
    const [changedSubCategories, setChangedSubCategories] = useState<
        Map<number, string>
    >(new Map());

    const category = api.category.getCategoryById.useQuery(categoryId);
    const subCategories =
        api.subCategory.getCategoriesById.useQuery(categoryId);

    useEffect(() => {
        const categoryName = category.data?.at(0)?.name;
        form.setValue('name', categoryName ? categoryName : '');
    }, [category.data]);

    useEffect(() => {
        setSubCategoriesData(subCategories.data ? subCategories.data : []);
        const categoryName = subCategories.data?.at(0)?.name;
        const categoryId = subCategories.data?.at(0)?.id;
        form.setValue('subcategory.id', categoryId ? categoryId : 0);
        form.setValue('subcategory.name', categoryName ? categoryName : 'test');
    }, [subCategories.data]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subcategory: { id: 0, name: '' },
        },
    });

    const onSubmit: (values: z.infer<typeof formSchema>) => void = (values) => {
        console.log(changedSubCategories);
        console.log(values.name);
    };

    const handleSelectChange = (e: string) => {
        const data: {
            name: string | undefined;
            id: string;
        } = JSON.parse(e) as {
            name: string | undefined;
            id: string;
        };
        form.setValue('subcategory.id', parseInt(data.id));
        form.setValue('subcategory.name', data.name);
    };

    const handleSubNameChange = (e: FormEvent<HTMLInputElement>) => {
        const currentSub = form.getValues('subcategory');
        const value = (e.target as HTMLInputElement).value;
        if (currentSub.name !== value) {
            const temp = changedSubCategories;
            temp.set(currentSub.id ?? -1, value);
            setChangedSubCategories(temp);
            form.setValue('subcategory.name', value);
        }
    };

    // This code somehow fixes a bug where the height of the DrawerContent gets a fixed value, when the drawer resizes while an input is focused
    let mutationObserver: MutationObserver;

    if (typeof window !== 'undefined') {
        mutationObserver = new window.MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const node = mutation.target as unknown as HTMLElement;
                if (node.style.height) {
                    node.style.removeProperty('height');
                }
            });
        });
    }

    useEffect(() => {
        const drawerContent = document.getElementById('drawer-content');
        if (drawerContent && mutationObserver) {
            mutationObserver.observe(drawerContent, {
                attributes: true,
                attributeFilter: ['style'],
            });
        }
    }, []);

    return (
        <Form {...form}>
            <form
                className={cn('mx-4 grid items-start gap-4 md:mx-0', className)}
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
                    name="subcategory.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assosiated Category</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(e) => handleSelectChange(e)}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        {subCategories.isFetched && (
                                            <SelectValue
                                                key={`select_${subCategories.data?.at(0)?.id}`}
                                                placeholder={
                                                    subCategories.data?.at(0)
                                                        ?.name
                                                }
                                            ></SelectValue>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subCategoriesData.map((category) => (
                                            <SelectItem
                                                key={`select_${category.id}`}
                                                value={`{"id": ${category.id}, "name": "${category.name}"}`}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                ></FormField>
                <FormField
                    control={form.control}
                    name="subcategory.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subcategory Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Fuel"
                                    onChangeCapture={handleSubNameChange}
                                    {...field}
                                ></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                ></FormField>

                <Button variant={'ghostSelected'} type="submit">
                    Save
                </Button>
            </form>
        </Form>
    );
}
