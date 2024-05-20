import { api } from '~/trpc/server';
import EntryAdd from '../_components/entry/entry-add';
import { EntryDataTable } from '../_components/entry/entry-data-table';
import { Entry, columns } from '../_components/entry/entry-columns';

const createTableData = (
    data: {
        entries: {
            type: 'Income' | 'Expense';
            id: number;
            createdAt: Date;
            amount: number;
            categoryId: number | null;
            subCategoryId: number | null;
            description: string | null;
        };
        category: { type: 'Income' | 'Expense'; id: number; name: string };
        subcategories: { id: number; name: string; categoryId: number | null } | null;
    }[]
) => {
    const newData: Entry[] = [];

    data.forEach((entry) => {
        newData.push({
            id: entry.entries.id,
            createdAt: entry.entries.createdAt,
            type: entry.entries.type,
            amount: entry.entries.amount,
            category: entry.category.name,
            subCategory: entry.subcategories ? entry.subcategories.name : "--",
            description: entry.entries.description ? entry.entries.description : "--",
        });
    });
    return newData
};

export default async function Entries() {
    const data = await api.entry.getAllEntriesWithCategory();
    const newData = createTableData(data);

    return (
        <main className="w-full mb-10">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1>Entries</h1>
                <div className="flex flex-row gap-4">
                    <EntryAdd type="Expense" className="grow"></EntryAdd>
                    <EntryAdd type="Income" className="grow"></EntryAdd>
                </div>
            </div>
            <div className="mb-6 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <EntryDataTable columns={columns} data={newData}></EntryDataTable>
            </div>
        </main>
    );
}
