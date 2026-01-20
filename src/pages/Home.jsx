import { useState } from "react";
import HeroBanner from "../Components/HeroBanner";
import FilterRow from "../Components/FiltersRow";
import ProductsGrid from "../Components/ProductsGrid";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("__all__");

  return (
    <>
      <HeroBanner />

      {/* <p>Love to hear from you, Get in touch 👋</p> */}

      <FilterRow
        value={selectedCategory}
        onChange={(val) => setSelectedCategory(val)}
      />

      <ProductsGrid category={selectedCategory} />
    </>
  );
}
