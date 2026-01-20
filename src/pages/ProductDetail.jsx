// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Truck, Package, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice"; // adjust path if needed

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/Components/ui/breadcrumb";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { Skeleton } from "@/Components/ui/skeleton";
import { Button } from "@/Components/ui/button";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    setQty(1);
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        console.log("Product details:", res.data);
        setProduct(res.data);
        setActiveImg(res.data?.thumbnail || res.data?.images?.[0] || "");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // -------------------- Reviews (API) --------------------
  const reviews = useMemo(
    () => (Array.isArray(product?.reviews) ? product.reviews : []),
    [product],
  );

  const totalReviews = reviews.length;

  // counts for 1..5 stars
  const counts = useMemo(() => {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const r of reviews) {
      const rating = Number(r?.rating);
      if (!Number.isFinite(rating)) continue;

      const bucket = Math.max(1, Math.min(5, Math.round(rating)));
      c[bucket] += 1;
    }

    return c;
  }, [reviews]);

  const percentFor = (star) =>
    totalReviews ? Math.round((counts[star] / totalReviews) * 100) : 0;

  // avg rating from reviews
  const avgRating = useMemo(() => {
    if (!totalReviews) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r?.rating || 0), 0);
    return sum / totalReviews;
  }, [reviews, totalReviews]);

  // ✅ NEW: one rating used everywhere (TOP + REVIEWS)
  const displayRating = useMemo(() => {
    // if we actually have reviews, use calculated average
    if (totalReviews) return avgRating;

    // otherwise fallback to product.rating
    const pr = Number(product?.rating || 0);
    return Number.isFinite(pr) ? pr : 0;
  }, [avgRating, totalReviews, product]);

  // -------------------- Skeleton --------------------
  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-44 rounded-lg" />
          <Skeleton className="h-5 w-28 rounded-md" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-50 p-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="mt-4 flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-64 rounded-md" />
            <Skeleton className="h-10 w-3/4 rounded-md" />
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-10 w-48 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        </div>

        <div className="mt-10">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="mt-6 h-40 w-full rounded-md" />
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <p className="mt-6 text-slate-600">Product not found.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => navigate("/create-product")}>
          Add a Product
        </Button>
      </div>

      {/* Top row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Images */}
        <div className="rounded-2xl bg-slate-50 p-6">
          <img
            src={activeImg || product.thumbnail}
            alt={product.title}
            className="rounded-2xl h-96 object-contain w-full"
          />

          {Array.isArray(product.images) && product.images.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {product.images.slice(0, 8).map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImg(img)}
                  className={[
                    "h-16 w-16 rounded-xl overflow-hidden border flex-shrink-0 bg-white",
                    img === activeImg ? "border-blue-600" : "border-slate-200",
                  ].join(" ")}
                  title="View image"
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/category/${product.category}`}>
                    {product.category}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage className="cursor-pointer">
                  {product.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-2xl font-semibold text-slate-900">
            {product.title}
          </h1>
          <p className="text-slate-500 mt-1">{product.brand}</p>

          <div className="mt-4 text-3xl font-bold text-slate-900">
            $ {Number(product.price).toFixed(2)}
          </div>

          {/* ✅ UPDATED: Product rating now uses displayRating (same everywhere) */}
          <div className="mt-3 flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-amber-500">
                {i + 1 <= Math.round(displayRating) ? "★" : "☆"}
              </span>
            ))}
            <span className="ml-2 text-sm text-slate-500">
              {Number(displayRating || 0).toFixed(1)}
              {totalReviews ? (
                <span className="ml-2 text-slate-400">
                  ({totalReviews} reviews)
                </span>
              ) : null}
            </span>
          </div>

          <p className="mt-5 text-sm text-slate-600">{product.description}</p>

          {/* Qty + Add to cart row */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full bg-slate-100 px-2 py-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-9 w-10 rounded-full text-slate-600 hover:bg-white"
                aria-label="Decrease quantity"
              >
                -
              </button>

              <div className="w-10 text-center text-sm font-semibold text-slate-900">
                {qty}
              </div>

              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="h-9 w-10 rounded-full text-slate-600 hover:bg-white"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                for (let i = 0; i < qty; i++) dispatch(addToCart(product));

                alert(
                  `Added to cart:\n${product.title}\nQty: ${qty}\nTotal: ₹ ${(
                    Number(product.price) * qty
                  ).toFixed(2)}`,
                );
              }}
              className="flex-1 h-12 rounded-full bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900"
            >
              Add To Cart
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start gap-3 p-5">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-rose-50">
                <Truck className="h-4 w-4 text-rose-500" />
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  Free Delivery
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Enter your Postal code for Delivery Availability
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="flex items-start gap-3 p-5">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-rose-50">
                <Package className="h-4 w-4 text-rose-500" />
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  Return Delivery
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Free 30 days Delivery Return.{" "}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                    onClick={() => alert("Return policy details")}
                  >
                    Details <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- TABS -------------------- */}
      <div className="mt-10">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start gap-8 rounded-none bg-transparent p-0 border-b border-slate-200">
            <TabsTrigger
              value="description"
              className="
                relative rounded-none bg-transparent px-0 pb-3
                text-sm font-semibold text-slate-400
                data-[state=active]:text-blue-700
                data-[state=active]:after:absolute
                data-[state=active]:after:left-0
                data-[state=active]:after:bottom-[-1px]
                data-[state=active]:after:h-[2px]
                data-[state=active]:after:w-full
                data-[state=active]:after:bg-blue-700
              "
            >
              Description
            </TabsTrigger>

            <TabsTrigger
              value="reviews"
              className="
                relative rounded-none bg-transparent px-0 pb-3
                text-sm font-semibold text-slate-400
                data-[state=active]:text-blue-700
                data-[state=active]:after:absolute
                data-[state=active]:after:left-0
                data-[state=active]:after:bottom-[-1px]
                data-[state=active]:after:h-[2px]
                data-[state=active]:after:w-full
                data-[state=active]:after:bg-blue-700
              "
            >
              Reviews ({totalReviews})
            </TabsTrigger>
          </TabsList>

          {/* Description */}
          <TabsContent value="description" className="pt-6 max-w-3xl">
            <h3 className="text-sm font-semibold text-slate-900">
              Product Description
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="pt-6 max-w-5xl">
            <h3 className="text-base font-semibold text-slate-900 mb-4">
              Customers Feedback
            </h3>

            <div className="grid lg:grid-cols-[300px_1fr] gap-6">
              {/* Left card */}
              <div className="rounded-2xl bg-slate-50 p-6">
                {/* ✅ UPDATED: use displayRating so it matches top rating */}
                <div className="text-5xl font-extrabold text-blue-700">
                  {displayRating.toFixed(1)}
                </div>

                <div className="mt-2 flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-amber-500">
                      {i + 1 <= Math.round(displayRating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  Product Rating
                </div>
              </div>

              {/* Right distribution */}
              <div className="rounded-2xl bg-slate-50 p-6">
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <div key={s} className="flex items-center gap-6">
                      <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-green-700 rounded-full"
                          style={{ width: `${percentFor(s)}%` }}
                        />
                      </div>

                      <div className="w-28 flex justify-end text-amber-500 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>

                      <div className="w-12 text-right text-blue-700 text-sm font-medium">
                        {percentFor(s)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews list */}
            <div className="mt-10">
              <h4 className="text-base font-semibold text-slate-900 mb-4">
                Reviews
              </h4>

              {totalReviews === 0 ? (
                <div className="text-sm text-slate-500">No reviews yet.</div>
              ) : (
                <div className="space-y-8">
                  {reviews.map((r, i) => {
                    const name = r?.reviewerName || "Customer";
                    const initials = name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0].toUpperCase())
                      .join("");

                    const rating = Math.max(
                      1,
                      Math.min(5, Math.round(Number(r?.rating || 0))),
                    );

                    const dateText = r?.date
                      ? new Date(r.date).toLocaleDateString()
                      : "";

                    return (
                      <div key={i} className="border-b border-slate-100 pb-8">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-blue-800 text-white flex items-center justify-center font-semibold">
                            {initials || "U"}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="font-semibold text-slate-900">
                                {name}
                              </div>
                              {dateText && (
                                <div className="text-sm text-slate-400">
                                  {dateText}
                                </div>
                              )}
                            </div>

                            <div className="mt-1 text-amber-500">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <span key={j}>
                                  {j + 1 <= rating ? "★" : "☆"}
                                </span>
                              ))}
                            </div>

                            <p className="mt-3 text-sm text-slate-600">
                              {r?.comment || ""}
                            </p>

                            <div className="mt-4 flex gap-6 text-sm">
                              <button
                                type="button"
                                className="text-slate-400 hover:text-slate-600"
                                onClick={() => alert("Liked")}
                              >
                                Like
                              </button>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => alert("Reply")}
                              >
                                Replay
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    className="block mx-auto text-sm text-red-500 hover:text-red-600"
                    onClick={() => alert("View all reviews")}
                  >
                    View All Reviews
                  </button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
