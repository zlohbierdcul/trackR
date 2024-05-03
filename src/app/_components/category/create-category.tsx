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

// shadcn
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPost.mutate({ name: values.name });
  };

  const createPost = api.category.createCategory.useMutation({
    onSuccess: () => {
      router.refresh();
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
  );
}
