
import { api } from "~/trpc/server";
import CategoryCard from "../_components/category/category-card";

export default async function Categories() {

  const createCategoryObjects = async () => {
    let categoryArray: {id: number, name: string | null, subCategories: {
      id: number;
      name: string | null;
      categoryId: number | null;
  }[]}[] = []
    const categoryData = await api.category.getAllCategories();
    const subcategoryData = await api.subCategory.getAllCategories();

    categoryData?.forEach(category => {
      categoryArray.push({
        id: category.id,
        name: category.name,
        subCategories: []
      })
    })

    categoryArray = categoryArray.map(category => {
      const matchingSubCategories = subcategoryData?.filter(subCategory => subCategory.categoryId === category.id)
      return {
        id: category.id,
        name: category.name,
        subCategories: matchingSubCategories
      }
    })

    return categoryArray
  }

  return (
    <main className="w-full">
      <h1>Categories</h1>
      <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 md:mb-0 mb-16 grid-cols-1 items-start justify-start gap-10">
        {(await createCategoryObjects()).map(category => (
          <CategoryCard key={category.id} category={{...category, subcategories: category.subCategories}} />
        ))}
      </div>
    </main>
  );
}   
