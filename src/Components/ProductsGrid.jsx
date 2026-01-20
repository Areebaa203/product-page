// src/Components/ProductsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import logo from "../assets/fashionhub-logo.png";
import ProductPagination from "./Pagination";
import ProductCard from "./ProductCard";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toggleWishlist } from "../redux/wishlistSlice";

//shadcn skeleton (adjust path if needed)
import { Skeleton } from "@/components/ui/skeleton";

const ProductsGrid = ({ category }) => {
  const dispatch = useDispatch();

  // stable selector (no new Set inside useSelector)
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // fast lookup: ids Set
  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((i) => i.id)),
    [wishlistItems]
  );

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 12;

  const skip = useMemo(() => (page - 1) * limit, [page]);
  const totalPages = useMemo(
    () => Math.ceil(total / limit) || 1,
    [total, limit]
  );

  // reset to page 1 when category changes
  useEffect(() => {
    setPage(1);
  }, [category]);

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const url =
          !category || category === "__all__"
            ? "https://dummyjson.com/products"
            : `https://dummyjson.com/products/category/${category}`;

        const res = await axios.get(url, { params: { limit, skip } });

        setProducts(res.data.products || []);
        setTotal(res.data.total ?? 0);
      } catch (err) {
        console.log("Error fetching products:", err);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, skip]);

  // ---------------- POST: ADD ONE ----------------
  const addOneProduct = async () => {
    try {
      setLoading(true);

      const payload = {
        title: "FashionHub New Product",
        description: "Added from FashionHub UI (demo)",
        price: 999,
        brand: "FashionHub",
        category: category && category !== "__all__" ? category : "smartphones",
        thumbnail: logo,
      };

      const res = await axios.post(
        "https://dummyjson.com/products/add",
        payload
      );

      // update UI list: add at top
      setProducts((prev) => [res.data, ...prev]);
      setTotal((prev) => prev + 1);
    } catch (err) {
      console.log("ADD error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 mt-8">
      {/* Top info + actions */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Page <span className="font-semibold">{page}</span> / {totalPages} •
          Total <span className="font-semibold">{total}</span>
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={addOneProduct}
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            disabled={loading}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        //  Skeleton Grid (same layout as product grid)
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              {/* image */}
              <Skeleton className="h-40 w-full rounded-xl" />

              {/* title + price + buttons */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
                <div className="pt-2 space-y-2">
                  <Skeleton className="h-9 w-full rounded-xl" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-10 text-slate-500">No products found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={wishlistIds.has(p.id)}
              onAddToCart={(prod) => dispatch(addToCart(prod))}
              onToggleWishlist={(prod) => dispatch(toggleWishlist(prod))}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <ProductPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        loading={loading}
      />
    </div>
  );
};

export default ProductsGrid;
