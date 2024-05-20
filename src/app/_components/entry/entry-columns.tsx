'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '~/components/ui/button';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Entry = {
    id: number;
    createdAt: Date;
    amount: number;
    category: string;
    subCategory: string;
    type: 'Income' | 'Expense';
    description: string | null;
};

export const columns: ColumnDef<Entry>[] = [
    {
        accessorKey: 'createdAt',
        id: "date",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date: Date = row.getValue('createdAt');
            const formatted = Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
            }).format(date);

            return formatted;
        },
    },
    {
        accessorKey: 'type',
        id: 'type',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'category',
        id: 'category',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'subCategory',
        id: 'subCategory',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Sub Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'amount',
        id: 'amount',
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        className="ml-auto"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            const formatted = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
            }).format(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: 'description',
        id: 'description',
        header: 'Description',
    },
];
