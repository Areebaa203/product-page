// src/Components/ProductsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import ProductPagination from "./Pagination";
import ProductCard from "./ProductCard";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toggleWishlist } from "../redux/wishlistSlice";

const ProductsGrid = ({ category }) => {
  const dispatch = useDispatch();

  // ✅ stable selector (NO new Set inside useSelector → no redux warning)
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // optional: fast lookup set, memoized (stable between renders)
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

  return (
    <div className="mx-auto max-w-7xl px-4 mt-8">
      {/* Top info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Page <span className="font-semibold">{page}</span> / {totalPages} •
          Total <span className="font-semibold">{total}</span>
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-10 text-slate-500">Loading...</div>
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
