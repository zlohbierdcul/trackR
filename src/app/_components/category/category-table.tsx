"use client";

import { Button } from "~/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { useState } from "react";

export function CategoryTable() {
  const categories = api.category.getAllCategories.useQuery();

  const handleCategoryDelete = (id: number) => {
    deleteCategory.mutate(id)
  };

  const deleteCategory = api.category.deleteCategoryById.useMutation({
    onSuccess: async () => {
      await categories.refetch()
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.isLoading && (
          <TableRow>
            <TableCell>
              <Skeleton className="h-4 w-[20px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[75px]" />
            </TableCell>
            <TableCell className="flex gap-2">
              <Skeleton className="h-[32px] w-[32px]" />
              <Skeleton className="h-[32px] w-[32px]" />
            </TableCell>
          </TableRow>
        )}
        {categories.data?.map((category, index) => (
          <TableRow key={`category_row_${index}`}>
            <TableCell>{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>Category</TableCell>
            <TableCell className="flex gap-2">
              <Button
                size={"smallIcon"}
                Icon={Edit}
                iconPlacement="left"
                iconSize={18}
                variant={"ghostSelected"}
              />
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    size={"smallIcon"}
                    Icon={Trash}
                    iconPlacement="left"
                    iconSize={18}
                    variant={"destructive"}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the category.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCategoryDelete(category.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
