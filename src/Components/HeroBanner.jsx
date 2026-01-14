import React from "react";
import heroimg from "../assets/image-1.png";
import { Button } from "./ui/button";

const HeroBanner = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 h-[287px]">
        {/* make overflow-visible so image can sit above the card */}
        <div className="mt-[60px] overflow-visible rounded-2xl bg-gradient-to-r from-purple-50 to-violet-100">
          <div className="grid items-center gap-6 px-6 py-8 md:grid-cols-2 md:px-10 md:py-10">
            {/* LEFT */}
            <div>
              <h2 className="text-2xl font-bold font-inter leading-snug text-slate-700 md:text-3xl">
                Grab Upto 50% Off On <br className="hidden md:block" />
                Selected Headphone
              </h2>
              <Button className="mt-6 rounded-full bg-slate-700 px-7 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Buy Now
              </Button>
            </div>

            {/* RIGHT */}
            <div className="relative flex justify-center md:justify-end h-full">
              <img
                src={heroimg}
                alt="Headphone promo"
                className="relative -mt-8 h-64 w-auto md:-mt-14 md:h-80 "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
