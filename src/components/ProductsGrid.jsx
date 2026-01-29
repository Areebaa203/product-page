// src/Components/ProductsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import logo from "../assets/fashionhub-logo.png";
import ProductPagination from "./Pagination";
import ProductCard from "./ProductCard";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toggleWishlist } from "../redux/wishlistSlice";
import { useNavigate } from "react-router-dom";

//shadcn skeleton (adjust path if needed)
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ProductsGrid = ({ category, isNested = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // stable selector (no new Set inside useSelector)
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // fast lookup: ids Set
  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((i) => i.id)),
    [wishlistItems],
  );

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 12;

  const skip = useMemo(() => (page - 1) * limit, [page]);
  const totalPages = useMemo(
    () => Math.ceil(total / limit) || 1,
    [total, limit],
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

        // Merge Local Products
        const localProducts = JSON.parse(
          localStorage.getItem("userProducts") || "[]",
        );
        // Filter by category if selected
        const visibleLocalProducts = localProducts.filter(
          (p) => !category || category === "__all__" || p.category === category,
        );

        // Prepend local products only on the first page
        const combinedProducts =
          page === 1
            ? [...visibleLocalProducts, ...(res.data.products || [])]
            : res.data.products || [];

        setProducts(combinedProducts);
        setTotal((res.data.total ?? 0) + visibleLocalProducts.length);
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
        payload,
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

  // ---------------- DELETE LOCAL PRODUCT ----------------
  const handleDeleteProduct = (productId) => {
    try {
      // 1. Update Local Storage
      const localProducts = JSON.parse(
        localStorage.getItem("userProducts") || "[]",
      );
      const updatedLocal = localProducts.filter((p) => p.id !== productId);
      localStorage.setItem("userProducts", JSON.stringify(updatedLocal));

      // 2. Update State
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setTotal((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const gridContent = (
    <>
      {/* Top info + actions */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Page <span className="font-semibold">{page}</span> / {totalPages} •
          Total <span className="font-semibold">{total}</span>
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => navigate("/create-product")}
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 hover:opacity-90 disabled:opacity-60"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        //  Skeleton Grid (same layout as product grid)
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-10 text-slate-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={wishlistIds.has(p.id)}
              onAddToCart={(prod) => dispatch(addToCart(prod))}
              onToggleWishlist={(prod) => dispatch(toggleWishlist(prod))}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      <ProductPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        loading={loading}
      />
    </>
  );

  if (isNested) {
    return <div className="mt-8">{gridContent}</div>;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-8 mt-8">
      {gridContent}
    </div>
  );
};

export default ProductsGrid;
