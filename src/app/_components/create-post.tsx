"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState(0);
  const [subCategory, setSubCategory] = useState(0);
  const [desciption, setDesciption] = useState("");
  const [type, setType] = useState<"Income" | "Expense">("Expense");

  const createPost = api.entry.createExpenseEntry.useMutation({
    onSuccess: () => {
      router.refresh();
      setAmount(0);
      setCategory(0);
      setSubCategory(0);
      setDesciption("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ type: type, amount, category, subCategory, desciption });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(parseInt(e.target.value))}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="Sub Category"
        value={subCategory}
        onChange={(e) => setSubCategory(parseInt(e.target.value))}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="Description"
        value={desciption}
        onChange={(e) => setDesciption(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
