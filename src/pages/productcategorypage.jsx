import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsGrid from "../components/ProductsGrid";
import { ArrowLeft } from "lucide-react";

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-8 py-6">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">
            {slug.replaceAll("-", " ")}
          </h1>
          <p className="text-sm text-slate-500">
            Browse products in this category
          </p>
        </div>

        <button
          onClick={() => navigate("/category")}
          className="hidden sm:inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
        </button>
      </div>

      {/* Products */}
      <ProductsGrid category={slug} isNested={true} />
    </div>
  );
}
