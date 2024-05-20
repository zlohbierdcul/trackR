import { api } from '~/trpc/server';
import CategoryCard from '../_components/category/category-card';
import CategoryAdd from '../_components/category/category-add';
import { category } from '~/server/db/schema';

export default async function Categories() {
    const createCategoryObjects = async () => {
        let categoryArray: {
            id: number;
            name: string | null;
            type: 'Expense' | 'Income';
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
                type: category.type,
                subCategories: [],
            });
        });

        categoryArray = categoryArray.map((category) => {
            const matchingSubCategories = subcategoryData?.filter(
                (subCategory) => subCategory.categoryId === category.id
            );
            return {
                id: category.id,
                name: category.name,
                type: category.type,
                subCategories: matchingSubCategories,
            };
        });

        return categoryArray.sort((a, b) => (a.subCategories.length < b.subCategories.length ? 1 : -1));
    };

    return (
        <main className="w-full">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1>Categories</h1>
                <CategoryAdd></CategoryAdd>
            </div>
            <h1 className="mb-5">Expense Categories</h1>
            <div className="mb-20 grid grid-cols-1 items-start justify-start gap-10 sm:grid-cols-1 md:mb-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {(await createCategoryObjects())
                    .filter((category) => category.type === 'Expense')
                    .map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={{
                                ...category,
                                subcategories: category.subCategories,
                            }}
                        />
                    ))}
            </div>
            <h1 className="my-5">Income Categories</h1>
            <div className="mb-20 grid grid-cols-1 items-start justify-start gap-10 sm:grid-cols-1 md:mb-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {(await createCategoryObjects())
                    .filter((category) => category.type === 'Income')
                    .map((category) => (
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
