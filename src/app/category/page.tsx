import Link from "next/link";

import { CreateCategory } from "~/app/_components/create-category";
import { api } from "~/trpc/server";

export default async function Home() {

  return (
    <main className="">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {

  const allCategories = await api.category.getAllCategories();

  return (
    <div className="w-full max-w-xs">
      {
        allCategories.map((category, index) => (
          <p key={`entry_${index}`}>{category.id} --- {category.name}</p>
        ))
      }

      <CreateCategory />
    </div>
  );
}
