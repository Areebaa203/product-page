import React from "react";
import heroimg from "../assets/image-1.png";
import { Button } from "./ui/button";

const HeroBanner = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-8">
        {/* CARD */}
        <div
          className="mt-16 relative rounded-2xl bg-[#F3DBF6]/60 min-h-[220px] font-inter"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {/* CONTENT WRAPPER */}
          <div className="relative z-10 grid gap-6 px-6 py-10 md:grid-cols-2 md:px-10">
            {/* LEFT */}
            <div>
              <h1 className="text-2xl font-bold font-inter leading-snug text-slate-700 md:text-3xl">
                Grab Upto 50% Off On <br className="hidden md:block" />
                Selected Headphone
              </h1>

              <Button className="mt-6 rounded-full bg-slate-700 px-7 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Buy Now
              </Button>
            </div>

            {/* RIGHT EMPTY COLUMN (just to reserve space on desktop) */}
            <div className="hidden md:block" />
          </div>

          {/* IMAGE (ABSOLUTE) */}
          <img
            src={heroimg}
            alt="Headphone promo"
            className="
              absolute bottom-0 right-30
              h-[210px] md:h-[260px]
              w-auto object-contain
              pointer-events-none select-none
            "
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
