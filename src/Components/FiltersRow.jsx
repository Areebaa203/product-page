import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUE = "__all__";

const FilterRow = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://dummyjson.com/products/categories"
        );
        setCategories(res.data);
      } catch (e) {
        console.log("categories error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-12">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <p>categories</p>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-9 w-[180px] rounded-full bg-slate-100 border-0 shadow-none text-xs font-medium">
              <SelectValue placeholder={loading ? "Loading..." : "Category"} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_VALUE}>All</SelectItem>

              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterRow;
