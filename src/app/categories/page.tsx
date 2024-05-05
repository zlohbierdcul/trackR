
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
      console.log(matchingSubCategories)
      return {
        id: category.id,
        name: category.name,
        subCategories: matchingSubCategories
      }
    })

    return categoryArray
  }

  console.log(await createCategoryObjects())

  return (
    <main className="">
      <div className="container flex flex-row items-start justify-center gap-12">
        {(await createCategoryObjects()).map(category => (
          <CategoryCard key={category.id} category={{...category, subcategories: category.subCategories}} />
        ))}
      </div>
    </main>
  );
}   
