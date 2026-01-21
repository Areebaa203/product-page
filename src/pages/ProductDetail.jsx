// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  Package,
  ChevronRight,
  Check,
  Share2,
  Bookmark,
  Heart,
  ShoppingBag,
  ChevronLeft,
  MessageSquareMore,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice"; // adjust path if needed

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import ProductDetailSkeleton from "@/Components/ProductDetailSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(5);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // gallery
  const [activeImg, setActiveImg] = useState("");
  const [thumbIndex, setThumbIndex] = useState(0);

  // UI selections (static like screenshot)
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Small");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // --- Review Form (exact like screenshot) ---
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");

  const StarRow = ({ value = 0, onChange, size = "text-sm" }) => {
    return (
      <div className={`flex items-center gap-0.5 ${size} text-amber-500`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          const filled = star <= Math.round(value);
          return (
            <button
              key={star}
              type="button"
              onClick={onChange ? () => onChange(star) : undefined}
              className={[
                "leading-none",
                onChange
                  ? "cursor-pointer hover:scale-[1.03] transition"
                  : "cursor-default",
              ].join(" ")}
              aria-label={`Rate ${star} stars`}
              disabled={!onChange}
            >
              {filled ? "★" : "☆"}
            </button>
          );
        })}
      </div>
    );
  };

  const handleSubmitReview = () => {
    // UI-only submit (DummyJSON reviews aren't writable from here)
    if (!newReviewRating) return alert("Please select a rating.");
    if (!newReviewTitle.trim()) return alert("Please enter a review title.");
    if (!newReviewComment.trim())
      return alert("Please enter your review content.");

    alert(
      `Review submitted!\n\nRating: ${newReviewRating}\nTitle: ${newReviewTitle}\nComment: ${newReviewComment}`,
    );

    setNewReviewRating(0);
    setNewReviewTitle("");
    setNewReviewComment("");
  };

  useEffect(() => {
    setQty(5);
    setSelectedColor(0);
    setSelectedSize("Small");
    setNewReviewRating(0);
    setNewReviewTitle("");
    setNewReviewComment("");
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) Check Local Storage first (for user-created products)
        const localProducts = JSON.parse(
          localStorage.getItem("userProducts") || "[]",
        );
        const localProduct = localProducts.find((p) => String(p.id) === id);

        if (localProduct) {
          setProduct(localProduct);
          const first =
            localProduct.thumbnail || localProduct.images?.[0] || "";
          setActiveImg(first);
          setThumbIndex(0);
          return;
        }

        // 2) If not local, fetch from API
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(res.data);

        const first = res.data?.thumbnail || res.data?.images?.[0] || "";
        setActiveImg(first);
        setThumbIndex(0);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
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

  // one rating used everywhere
  const displayRating = useMemo(() => {
    // User requested "dynamically from the api"
    // Prefer the explicit rating field from API as it's the source of truth
    const apiRating = Number(product?.rating);
    if (Number.isFinite(apiRating)) return apiRating;

    if (totalReviews) return avgRating;
    return 0;
  }, [avgRating, totalReviews, product]);

  // -------------------- Skeleton --------------------
  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
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
  }

  // -------------------- Gallery --------------------
  const images = Array.isArray(product.images) ? product.images : [];
  const thumbs = images.length ? images : [product.thumbnail].filter(Boolean);

  const visibleThumbs = thumbs.slice(thumbIndex, thumbIndex + 4);
  const canPrev = thumbIndex > 0;
  const canNext = thumbIndex + 4 < thumbs.length;

  // -------------------- Static UI (like screenshot) --------------------
  const colorOptions = ["#E5E7EB", "#A3E635", "#93C5FD", "#FBCFE8", "#D1D5DB"];
  const sizeOptions = ["Small", "Medium", "Large", "Extra Large", "XXL"];

  const likeCount = 109;

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-12 py-10">
      {/* Top row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: Image + thumbs */}
        <div>
          <div className="rounded-2xl bg-slate-50 p-6">
            <div className="rounded-2xl overflow-hidden bg-white">
              <img
                src={activeImg || product.thumbnail}
                alt={product.title}
                className="h-[440px] w-full object-contain"
              />
            </div>
          </div>

          {/* thumbs row + arrows */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setThumbIndex((v) => Math.max(0, v - 1))}
              disabled={!canPrev}
              className={[
                "grid h-10 w-10 place-items-center rounded-xl border bg-white transition",
                canPrev
                  ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                  : "border-slate-100 text-slate-300 cursor-not-allowed",
              ].join(" ")}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-3">
              {visibleThumbs.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImg(img)}
                  className={[
                    "h-16 w-16 rounded-xl overflow-hidden border bg-white",
                    img === activeImg
                      ? "border-blue-600"
                      : "border-slate-200 hover:border-slate-300",
                  ].join(" ")}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setThumbIndex((v) => Math.min(thumbs.length - 4, v + 1))
              }
              disabled={!canNext}
              className={[
                "grid h-10 w-10 place-items-center rounded-xl border bg-white transition",
                canNext
                  ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                  : "border-slate-100 text-slate-300 cursor-not-allowed",
              ].join(" ")}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* RIGHT: Bordered card like screenshot */}
        <div className="rounded-2xl bg-white p-6">
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

          {/* Title + icons */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {product.title}
              </h1>
              <p className="mt-1 text-xs text-slate-400">{product.brand}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <Heart className="h-4 w-4" />
              </button>

              <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <Bookmark className="h-4 w-4" />
              </button>

              <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Price + badges row */}
          {/* Price + badges row (Refactored Layout) */}
          <div className="mt-5 flex items-start gap-4">
            {/* Left: Price Stack */}
            <div className="flex flex-col">
              <div className="text-2xl font-extrabold text-slate-900">
                ${Number(product.price).toFixed(2)}
              </div>
              <div className="text-sm font-semibold text-slate-300 line-through">
                ${Number(product.price).toFixed(2)}
              </div>
            </div>

            {/* Right: Rating Stack */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("reviews");
                    document
                      .getElementById("reviews-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#FBF3EA] px-2 py-1 text-xs font-bold text-[#D48D3B] border border-amber-100 hover:bg-amber-50 transition"
                >
                  ★ {Number(displayRating || 0).toFixed(1)}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("reviews");
                    document
                      .getElementById("reviews-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EDF0F8] px-2.5 py-1 text-xs font-semibold text-[#3A4980] border border-slate-200 hover:bg-blue-100 transition"
                >
                  <MessageSquareMore className="h-3.5 w-3.5" />
                  {totalReviews || 67} Reviews
                </button>
              </div>

              <div className="text-[11px] font-semibold">
                <span className="text-[#3E9242]">93%</span>{" "}
                <span className="text-[#B9BBBF]">
                  of buyers have recommended this.
                </span>
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-slate-200" />

          {/* Choose color */}
          <div>
            <div className="text-xs text-slate-500 mb-3">Choose a Color</div>
            <div className="flex items-center gap-3">
              {colorOptions.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(i)}
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full border transition",
                    selectedColor === i
                      ? "border-slate-200 ring-2 ring-slate-200 ring-offset-2"
                      : "border-transparent hover:border-slate-200",
                  ].join(" ")}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${i + 1}`}
                >
                  {selectedColor === i && (
                    <Check className="h-4 w-4 text-[#3b4a74]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="my-5 h-px bg-slate-200" />

          {/* Choose size */}
          <div>
            <div className="text-xs text-slate-500 mb-3">Choose a Size</div>
            <div className="flex flex-wrap gap-4">
              {sizeOptions.map((s) => {
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <span
                      className={[
                        "grid h-3.5 w-3.5 place-items-center rounded-full border",
                        active ? "border-blue-600" : "border-slate-300",
                      ].join(" ")}
                    >
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      )}
                    </span>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-6 h-px bg-slate-200" />

          {/* Qty + Add to cart row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full bg-slate-100 px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-white hover:text-slate-900"
              >
                -
              </button>

              <div className="w-10 text-center text-sm font-bold text-slate-900">
                {qty}
              </div>

              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-white hover:text-slate-900"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                for (let i = 0; i < qty; i++) dispatch(addToCart(product));

                alert(
                  `Added to cart:\n${product.title}\nQty: ${qty}\nTotal: $${(
                    Number(product.price) * qty
                  ).toFixed(2)}`,
                );
              }}
              className="flex-1 h-11 rounded-full bg-[#3b4a74] text-white text-xs font-bold shadow-sm hover:bg-[#2d3a5e] inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Add To Cart
            </button>
          </div>

          {/* Delivery / Return */}
          <div className="mt-5 rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50">
                <Truck className="h-4 w-4 text-rose-500" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-900">
                  Free Delivery
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Enter your Postal code for Delivery Availability
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="flex items-start gap-3 p-4">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50">
                <Package className="h-4 w-4 text-rose-500" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-900">
                  Return Delivery
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Free 30 days Delivery Return.{" "}
                  <button
                    type="button"
                    className="font-semibold text-slate-600 hover:text-slate-900"
                    onClick={() => alert("Return policy details")}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- TABS (FIX WIDTH + EXACT REVIEWS UI) -------------------- */}
      <div className="mt-10" id="reviews-section">
        <div className="max-w-3xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 border-b border-slate-200">
              <TabsTrigger
                value="description"
                className="
                  relative rounded-none bg-transparent pb-3 pt-2 px-0 mr-8
                  text-xs font-semibold text-slate-400
                  hover:text-slate-600
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
                  relative rounded-none bg-transparent pb-3 pt-2 px-0
                  text-xs font-semibold text-slate-400
                  hover:text-slate-600
                  data-[state=active]:text-blue-700
                  data-[state=active]:after:absolute
                  data-[state=active]:after:left-0
                  data-[state=active]:after:bottom-[-1px]
                  data-[state=active]:after:h-[2px]
                  data-[state=active]:after:w-full
                  data-[state=active]:after:bg-blue-700
                "
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Description */}
            <TabsContent value="description" className="pt-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Product Description
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {product.description}
                </p>

                <div className="mt-7">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Durable leather is easily cleanable so you can keep your look fresh.",
                      "Water-repellent finish and internal membrane help keep your feet dry.",
                      "Toe piece with star pattern adds durability.",
                      "Synthetic insulation helps keep you warm.",
                      "Originally designed for performance hoops, the Air unit delivers lightweight cushioning.",
                      "Plush tongue wraps over the ankle to help keep out the moisture and cold.",
                      "Rubber outsole with aggressive traction pattern adds durable grip.",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs text-slate-600"
                      >
                        <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Product Details
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Not intended for use as Personal Protective Equipment (PPE)",
                      "Water-repellent finish and internal membrane help keep your feet dry.",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs text-slate-600"
                      >
                        <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="pt-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Customers Feedback
                </h3>

                {/* Rating card + distribution */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-start">
                  <div className="rounded-lg bg-slate-50 border border-slate-100 p-5">
                    <div className="text-3xl font-extrabold text-blue-700 leading-none">
                      {Number(displayRating || 0).toFixed(1)}
                    </div>
                    <div className="mt-2">
                      <StarRow value={displayRating} size="text-sm" />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500">
                      Product Rating
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((s) => (
                      <div key={s} className="flex items-center gap-3">
                        <div className="flex-1 h-[3px] bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-700 rounded-full"
                            style={{ width: `${percentFor(s)}%` }}
                          />
                        </div>

                        <div className="w-20 flex justify-start">
                          <StarRow value={s} size="text-[11px]" />
                        </div>

                        <div className="w-10 text-right text-[11px] font-semibold text-slate-500">
                          {percentFor(s)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews list */}
                <div className="mt-8">
                  <h4 className="text-xs font-semibold text-slate-900 mb-4">
                    Reviews
                  </h4>

                  <div className="space-y-6">
                    {(showAllReviews ? reviews : reviews.slice(0, 2)).map(
                      (r, i) => {
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
                          : "2 Days ago";

                        return (
                          <div
                            key={i}
                            className="border-b border-slate-100 pb-6"
                          >
                            <div className="flex gap-3">
                              <div className="h-9 w-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-[11px] font-bold">
                                {initials || "U"}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="text-xs font-semibold text-slate-900">
                                    {name}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {dateText}
                                  </div>
                                </div>

                                <div className="mt-1 flex items-center gap-2">
                                  <StarRow value={rating} size="text-[11px]" />
                                  <span className="text-[11px] font-medium text-slate-400">
                                    ({rating})
                                  </span>
                                </div>

                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                  {r?.comment || ""}
                                </p>

                                <div className="mt-3 flex items-center gap-4 text-[11px]">
                                  <button
                                    className="text-slate-400 hover:text-slate-600"
                                    type="button"
                                  >
                                    Like
                                  </button>
                                  <button
                                    className="text-rose-500 hover:text-rose-600"
                                    type="button"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}

                    {reviews.length > 2 && (
                      <button
                        type="button"
                        className="block mx-auto text-[11px] font-semibold text-rose-500 hover:text-rose-600"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                      >
                        {showAllReviews ? "Show Less" : "View All Reviews"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Write a Review */}
                <div className="mt-10">
                  <h4 className="text-xs font-semibold text-slate-900 mb-4">
                    Write a Review
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-700">
                        What is it like to Product?
                      </div>
                      <div className="mt-2">
                        <StarRow
                          value={newReviewRating}
                          onChange={setNewReviewRating}
                          size="text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">
                        Review Title
                      </label>
                      <input
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="Great Products"
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">
                        Review Content
                      </label>
                      <textarea
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        rows={5}
                        placeholder="It is a long established fact that a reader will be distracted by the readable content..."
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      className="mt-2 inline-flex items-center justify-center rounded-full bg-[#3b4a74] px-6 py-2.5 text-[11px] font-bold text-white hover:bg-[#2d3a5e]"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
