"use client";

// General
import { useRouter } from "next/navigation";
import { useState } from "react";

// From
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// API
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must have at least 2 characters." })
    .max(30, { message: "Name must have fewer than 30 characters." }),
});

export function CreateCategory() {
  const router = useRouter();
  const [name, setName] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    createPost.mutate({ name: values.name });
  };

  const createPost = api.category.createCategory.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Transportation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {createPost.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
    // <form
    //   onSubmit={(e) => {
    //     e.preventDefault();
    //     createPost.mutate({ type: type, amount, category, subCategory, desciption });
    //   }}
    //   className="flex flex-col gap-2"
    // >
    //   <input
    //     type="text"
    //     placeholder="Name"
    //     value={amount}
    //     onChange={(e) => setAmount(parseInt(e.target.value))}
    //     className="w-full rounded-full px-4 py-2 text-black"
    //   />
    //   <button
    //     type="submit"
    //     className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
    //     disabled={createPost.isPending}
    //   >
    //
    //   </button>
    // </form>
  );
}
