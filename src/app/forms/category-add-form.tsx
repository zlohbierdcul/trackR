import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Switch } from '~/components/ui/switch';
import { Input } from '~/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useDrawerObserver } from '~/lib/useDrawerObserver';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must have at least 2 characters.' })
        .max(30, { message: 'Name must have fewer than 30 characters.' }),
    type: z.boolean().optional(),
    categoryType: z.enum(['Income', 'Expense']),
    subcategory: z.string().optional(),
});

export default function CategoryAddForm({
    setOpen,
    className,
}: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    className?: React.ComponentProps<'form'>;
}) {
    useDrawerObserver();

    const categories = api.category.getAllCategories.useQuery();

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryType: 'Expense',
        },
    });

    const onSubmit: (values: z.infer<typeof formSchema>) => void = (values) => {
        console.log(values);
        if (values.subcategory) {
            createSubCategory.mutate({
                name: values.name,
                categoryId: parseInt(values.subcategory),
            });
        } else {
            console.log(values.categoryType)
            createCategory.mutate({ name: values.name, type: values.categoryType });
        }
        setOpen(false);
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
                className={cn('mx-4 grid items-start gap-4 md:mx-0', className)}
                onSubmit={form.handleSubmit(onSubmit)}>
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
                <FormField
                    control={form.control}
                    name="categoryType"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Category Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Expense" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Expense</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Income" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Income</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Subcategory?</FormLabel>
                            <FormControl>
                                <Switch
                                    disabled={form.watch().categoryType === 'Income'}
                                    id="type"
                                    className="bg-accent"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}></Switch>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                {form.watch().type && form.watch().categoryType === 'Expense' && (
                    <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assosiated Category</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Category"></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.data
                                                ?.filter((category) => category.type === 'Expense')
                                                .map((category) => (
                                                    <SelectItem
                                                        key={`select_${category.id}`}
                                                        value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}></FormField>
                )}
                <Button variant={'ghostSelected'} type="submit">
                    Add category
                </Button>
            </form>
        </Form>
    );
}
