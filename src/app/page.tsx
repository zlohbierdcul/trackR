import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {

  const allEntries = await api.expenseEntries.getAllEntries();

  return (
    <div className="w-full max-w-xs">
      {
        allEntries.map((entry, index) => (
          <p key={`entry_${index}`}>{entry.amount}--{entry.category}--{entry.subCategory}--{entry.subCategory}</p>
        ))
      }

      <CreatePost />
    </div>
  );
}
