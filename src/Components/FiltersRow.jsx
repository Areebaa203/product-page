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
    <div className="mx-auto max-w-7xl px-4">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
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

          <div className="h-9 rounded-full bg-slate-100 px-4 text-xs font-medium text-slate-600 flex items-center">
            Price
          </div>
          <div className="h-9 rounded-full bg-slate-100 px-4 text-xs font-medium text-slate-600 flex items-center">
            Review
          </div>
          <div className="h-9 rounded-full bg-slate-100 px-4 text-xs font-medium text-slate-600 flex items-center">
            Offer
          </div>
        </div>

        <div className="h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-medium text-slate-600 flex items-center">
          Sort
        </div>
      </div>
    </div>
  );
};

export default FilterRow;
