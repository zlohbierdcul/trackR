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
import { Dispatch, SetStateAction } from 'react';
import { useDrawerObserver } from '~/lib/useDrawerObserver';

const formSchema = z.object({
    amount: z.number(),
    category: z.string(),
    subCategory: z.string(),
    description: z.string().optional(),
});

export default function EntryAddForm({
    type,
    setOpen,
    className,
}: {
    type: 'Income' | 'Expense';
    setOpen: Dispatch<SetStateAction<boolean>>;
    className?: React.ComponentProps<'form'>;
}) {
    useDrawerObserver();

    const categories = api.category.getAllCategories.useQuery();
    const subCategories = api.subCategory.getAllCategories.useQuery();

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: (values: z.infer<typeof formSchema>) => void = (values) => {
        setOpen(false);
        console.log(values)
        createEntry.mutate({
            type: type,
            amount: values.amount,
            category: +values.category,
            subCategory: +values.subCategory,
            desciption: values.description ? values.description : null
        })
    };

    const createEntry = api.entry.createEntry.useMutation({
        onSuccess: () => {
            router.refresh()
        }
    })

    return (
        <Form {...form}>
            <form
                className={cn('mx-4 grid items-start gap-4 md:mx-0', className)}
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step={0.01}
                                    min={0}
                                    placeholder="10.50"
                                    {...field}
                                    onChange={(e) => field.onChange(+e.target.value)}></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category"></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.data?.map((category) => (
                                            <SelectItem key={`select_${category.id}`} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                {form.watch().category && (
                    <FormField
                        control={form.control}
                        name="subCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sub Category"></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subCategories.data
                                                ?.filter(
                                                    (subCategory) =>
                                                        subCategory.categoryId === parseInt(form.watch().category)
                                                )
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
                                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Coffee"
                                    {...field}
                                    ></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}></FormField>
                <Button variant={'ghostSelected'} type="submit">
                    Add {type}
                </Button>
            </form>
        </Form>
    );
}
