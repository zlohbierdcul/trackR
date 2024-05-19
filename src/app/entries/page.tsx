import EntryAdd from '../_components/entry/entry-add';

export default async function Entries() {
    return (
        <main className="w-full">
          <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6'>

            <h1>Entries</h1>
            <div className='flex flex-row gap-4'>
                <EntryAdd type="Expense" className='grow'></EntryAdd>
                <EntryAdd type="Income" className='grow'></EntryAdd>
            </div>
          </div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"></div>
        </main>
    );
}
