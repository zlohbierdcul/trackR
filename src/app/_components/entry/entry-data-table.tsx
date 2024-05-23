'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    VisibilityState,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    SortingState,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowBigDown, ArrowDown, ArrowDownIcon, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import useBetterMediaQuery from '~/lib/useBetterMediaQuery';

import { Entry as DataEntry } from './entry-columns';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

const months = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export function EntryDataTable<TData, TValue>({ columns, data }: DataTableProps<DataEntry, TValue>) {
    const isDesktop = useBetterMediaQuery('(max-width: 768px)');
    const isSmallDesktop = useBetterMediaQuery('(max-width: 1000px)');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

    const [dataState, setDataState] = useState(data);

    const table = useReactTable({
        data: dataState,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        initialState: {
            pagination: {
                pageSize: 18,
            },
        },
    });

    useEffect(() => {
        setColumnVisibility({
            type: !!!isDesktop && !!!isSmallDesktop,
            subCategory: !!!isDesktop && !!!isSmallDesktop,
            description: !!!isDesktop,
        });
    }, [isDesktop, isSmallDesktop]);

    useEffect(() => {
        let temp = [...data];
        if (selectedMonths.length > 0) {
            temp = temp.filter((obj) => {
                return selectedMonths.includes(getDateMonth(obj.createdAt));
            });
        }
        setDataState(temp);
    }, [selectedMonths]);

    const getDateMonth = (date: Date) => {
        return Intl.DateTimeFormat('en-US', {
            month: 'long',
        }).format(date);
    };

    const setMonthAsSelected = (isChecked: boolean, month: string) => {
        const temp = [...selectedMonths];
        if (isChecked) {
            temp.push(month);
        } else {
            const index = temp.findIndex((m) => m === month);
            temp.splice(index, 1);
        }
        setSelectedMonths(temp);
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghostSelected" className="gap-2" Icon={ChevronDown} iconPlacement="right">
                            Month
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {months.map((month, index) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={`month_filter_${index}`}
                                    className="capitalize"
                                    checked={selectedMonths.includes(month)}
                                    onCheckedChange={(value) => setMonthAsSelected(value, month)}>
                                    {month}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghostSelected"
                            className="ml-auto gap-2"
                            Icon={ChevronDown}
                            iconPlacement="right">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    );
}
