import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function FaqPage() {
  const categories = useMemo(
    () => [
      { id: "all", label: "All" },
      { id: "orders", label: "Orders" },
      { id: "shipping", label: "Shipping" },
      { id: "returns", label: "Returns" },
      { id: "payments", label: "Payments" },
      { id: "products", label: "Products" },
      { id: "account", label: "Account" },
    ],
    [],
  );

  const faqs = useMemo(
    () => [
      {
        id: "f1",
        category: "shipping",
        q: "How long does delivery take?",
        a: "Usually 2-5 working days depending on your city and courier availability.",
      },
      {
        id: "f2",
        category: "shipping",
        q: "Do you deliver nationwide?",
        a: "Yes, we deliver across Pakistan where courier service is available.",
      },
      {
        id: "f3",
        category: "returns",
        q: "What is your return policy?",
        a: "Returns are accepted within 7 days if the item is unused, unwashed, and tags are intact. Some sale items may be non-returnable.",
      },
      {
        id: "f4",
        category: "returns",
        q: "How do I request a return or exchange?",
        a: "Contact us with your Order ID, item details, and the reason. We’ll guide you through the process.",
      },
      {
        id: "f5",
        category: "payments",
        q: "Is Cash on Delivery available?",
        a: "Yes, COD is available in most cities. Some remote locations may require prepaid orders.",
      },
      {
        id: "f6",
        category: "products",
        q: "How do I choose the right size?",
        a: "Use the size chart on the product page. If you're between sizes, choose the larger size for comfort.",
      },
      {
        id: "f7",
        category: "orders",
        q: "Can I cancel or change my order?",
        a: "Yes—if the order hasn't been dispatched. Message us as soon as possible with your Order ID.",
      },
    ],
    [],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery =
        q === "" ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [faqs, query, category]);

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-12 py-10">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">FAQs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quick answers to common questions about orders, shipping, returns,
            and more.
          </p>
        </div>

        {/* Hero banner */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-[#f4e9fb]">
          <div className="grid gap-6 p-6 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                Need help?
              </h2>
              <p className="mt-3 max-w-[55ch] text-sm text-slate-600">
                sele Search FAQs or choose a category. If you still need help,
                contact us with your Order ID.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 cursor-pointer">
                <Pill label="Support" value="Mon-Sat • 10am-7pm" />
                <Pill label="Email" value="support@fashionhub.com" />
                <Pill label="WhatsApp" value="+92 300 1234567" />
              </div>
            </div>

            {/* Search card */}
            <div className="rounded-3xl bg-white/70 p-4 shadow-sm">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">
                  Search FAQs
                </div>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search (e.g., return, delivery, COD)..."
                    className="h-12 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 cursor-pointer [&::-webkit-search-cancel-button]:cursor-pointer"
                  />
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value)}
                  >
                    <SelectTrigger className="h-12 w-full sm:w-52 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-slate-300">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-3 text-xs text-slate-500 cursor-pointer">
                  Showing{" "}
                  <span className="font-semibold">{filtered.length}</span>{" "}
                  result(s)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ list */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
                <div className="text-sm font-semibold text-slate-900">
                  No results found
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Try a different keyword or select “All”.
                </div>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-3">
                {filtered.map((item) => (
                  <FaqAccordionItem
                    key={item.id}
                    id={item.id}
                    q={item.q}
                    a={item.a}
                  />
                ))}
              </Accordion>
            )}
          </div>

          {/* Side card */}
          <aside className="space-y-4 cursor-pointer">
            <SideCard title="Still stuck?" desc="We can help you quickly">
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <Row k="Email" v="support@fashionhub.com" />
                <Row k="WhatsApp" v="+92 300 1234567" />
                <Row k="Hours" v="Mon-Sat • 10am-7pm" />
              </div>

              <Link
                to="/contact"
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.99]"
              >
                Go to Contact Page
              </Link>
            </SideCard>

            <SideCard title="Popular topics" desc="Quick shortcuts">
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag onClick={() => setQuery("return")}>Returns</Tag>
                <Tag onClick={() => setQuery("delivery")}>Delivery</Tag>
                <Tag onClick={() => setQuery("COD")}>COD</Tag>
                <Tag onClick={() => setQuery("size")}>Size</Tag>
                <Tag onClick={() => setQuery("exchange")}>Exchange</Tag>
              </div>
            </SideCard>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function FaqAccordionItem({ id, q, a }) {
  return (
    <AccordionItem
      value={id}
      className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-1"
    >
      <AccordionTrigger className="py-3 text-left text-sm font-semibold text-slate-900 hover:no-underline">
        {q}
      </AccordionTrigger>
      <AccordionContent className="pb-4 text-sm leading-relaxed text-slate-700">
        {a}
      </AccordionContent>
    </AccordionItem>
  );
}

function Pill({ label, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm">
      <span className="font-semibold text-slate-900">{label}:</span>
      <span className="text-slate-600">{value}</span>
    </div>
  );
}

function SideCard({ title, desc, children }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{desc}</div>
      {children}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2">
      <span className="text-slate-500">{k}</span>
      <span className="font-medium text-slate-900">{v}</span>
    </div>
  );
}

function Tag({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 active:scale-[0.99]"
    >
      {children}
    </button>
  );
}
