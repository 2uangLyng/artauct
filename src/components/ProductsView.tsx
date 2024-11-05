"use client";

import { Category, Product } from "../../sanity.types";
import ProductGrid from "@/components/ProductGrid";

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
  return (
    <div className="flex flex-col w-full">
      {/* categories */}
      <div className="w-full sm:w-[200px]">
        {/*<CategorySelectorComponent categories={categories} />*/}
      </div>

      {/*products*/}
      <div>
        <div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
