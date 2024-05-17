

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
import { Switch } from '~/components/ui/switch';
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
import { useEffect } from 'react';

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must have at least 2 characters.' })
        .max(30, { message: 'Name must have fewer than 30 characters.' }),
    type: z.boolean().optional(),
    subcategory: z.string().optional(),
});

export default function CategoryForm({ className }: React.ComponentProps<'form'>) {
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
            createSubCategory.mutate({
                name: values.name,
                categoryId: parseInt(values.subcategory),
            });
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


    // This code somehow fixes a bug where the height of the DrawerContent gets a fixed value, when the drawer resizes while an input is focused
    let mutationObserver: MutationObserver;

    if (typeof window !== 'undefined') {
        mutationObserver = new window.MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                const node = mutation.target as unknown as HTMLElement
                if (node.style.height) {
                    node.style.removeProperty("height")
                }

            })
        })
    }

    useEffect(() => {
        const drawerContent = document.getElementById("drawer-content")
        if (drawerContent && mutationObserver) {
            mutationObserver.observe(drawerContent, { attributes: true, attributeFilter: ["style"]})
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
                <Button variant={'ghostSelected'} type="submit">
                    Add category
                </Button>
            </form>
        </Form>
    );
}