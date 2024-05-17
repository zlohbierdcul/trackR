import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function DeleteForm({
    className,
    idToDelete,
}: {
    className?: React.ComponentProps<'form'>;
    idToDelete: number;
}) {
    const router = useRouter();

    const handleCategoryDelete = async (
        e: FormEvent<HTMLFormElement>,
        id: number,
    ) => {
        e.preventDefault();
        await deleteSubCategory.mutateAsync(id);
        deleteCategory.mutate(id);
    };

    const deleteCategory = api.category.deleteCategoryById.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    const deleteSubCategory =
        api.subCategory.deleteSubCategoryByCategory.useMutation();

    return (
        <form
            className={cn('mx-4 grid items-start gap-4 md:mx-0', className)}
            onSubmit={(e) => handleCategoryDelete(e, idToDelete)}
        >
            <Button variant={'ghostSelected'} type="submit">
                Delete
            </Button>
        </form>
    );
}