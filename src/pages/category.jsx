import { useNavigate } from "react-router-dom";

const categories = [
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
  "furniture",
  "tops",
  "womens-dresses",
  "mens-shirts",
  "mens-shoes",
  "womens-shoes",
  "watches",
];

export default function Category() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-10 md:px-12 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Shop by Category
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(`/category/${cat}`)}
            className="rounded-xl border bg-white p-6 text-center font-semibold capitalize hover:bg-slate-50"
          >
            {cat.replace("-", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
