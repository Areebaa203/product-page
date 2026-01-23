import { useState } from "react";
import HeroBanner from "../components/HeroBanner";
import FilterRow from "../components/FiltersRow";
import ProductsGrid from "../components/ProductsGrid";

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
