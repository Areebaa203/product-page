import Navbar from "./Components/Navbar";
import HeroBanner from "./Components/HeroBanner";
import ProductsGrid from "./Components/ProductsGrid";
import { useState } from "react";
import FilterRow from "./Components/FiltersRow";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("__all__");

  return (
    <>
      <Navbar />
      <HeroBanner />

      <FilterRow
        value={selectedCategory}
        onChange={(val) => setSelectedCategory(val)}
      />

      <ProductsGrid category={selectedCategory} />
    </>
  );
}
