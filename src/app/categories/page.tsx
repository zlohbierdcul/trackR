import { api } from '~/trpc/server';
import CategoryCard from '../_components/category/category-card';
import { Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AdaptiveDialog } from '../_components/adaptive-dialog';
import CategoryForm from '../forms/category-form';
import CategoryAdd from '../_components/category/category-add';

export default async function Categories() {
    const createCategoryObjects = async () => {
        let categoryArray: {
            id: number;
            name: string | null;
            subCategories: {
                id: number;
                name: string | null;
                categoryId: number | null;
            }[];
        }[] = [];
        const categoryData = await api.category.getAllCategories();
        const subcategoryData = await api.subCategory.getAllCategories();

        categoryData?.forEach((category) => {
            categoryArray.push({
                id: category.id,
                name: category.name,
                subCategories: [],
            });
        });

        categoryArray = categoryArray.map((category) => {
            const matchingSubCategories = subcategoryData?.filter(
                (subCategory) => subCategory.categoryId === category.id,
            );
            return {
                id: category.id,
                name: category.name,
                subCategories: matchingSubCategories,
            };
        });

        return categoryArray.sort((a, b) =>
            a.subCategories.length < b.subCategories.length ? 1 : -1,
        );
    };

    return (
        <main className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1>Categories</h1>
                <CategoryAdd></CategoryAdd>
            </div>
            <div className="mb-20 grid grid-cols-1 items-start justify-start gap-10 sm:grid-cols-1 md:mb-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {(await createCategoryObjects()).map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={{
                            ...category,
                            subcategories: category.subCategories,
                        }}
                    />
                ))}
            </div>
        </main>
    );
}
