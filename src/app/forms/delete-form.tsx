import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function DeleteForm({
    className,
    deleteHandler,
}: {
    className?: React.ComponentProps<'form'>;
    deleteHandler: (e: FormEvent<HTMLFormElement>) => void;
}) {

    return (
        <form
            className={cn('mx-4 grid items-start gap-4 md:mx-0', className)}
            onSubmit={deleteHandler}
        >
            <Button variant={'ghostSelected'} type="submit">
                Delete
            </Button>
        </form>
    );
}