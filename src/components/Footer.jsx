import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const subscriptionSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function Footer() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(subscriptionSchema),
  });

  const onSubmit = (data) => {
    setIsSubscribed(true);
    console.log("Newsletter Subscribe:", data.email);
    reset();

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 5000);
  };
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white">
      {/* Soft top strip */}
      <div className="bg-purple-50/70">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-8 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-800">
                Stay in the loop
              </h3>
              <p className="mt-1 text-slate-500">
                Get updates on new arrivals, offers and best picks.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative w-full">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className={`w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 ${
                    errors.email ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.email && (
                  <p className="absolute -bottom-5 left-2 text-destructive text-[11px] font-medium leading-none">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-slate-800 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-slate-900"
              >
                Subscribe
              </button>
            </form>
          </div>

          {isSubscribed && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-emerald-700 max-w-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-medium">
                Successfully subscribed! Check your inbox for updates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-semibold text-slate-800">
              FashionHub
            </Link>

            <p className="mt-3 max-w-sm text-slate-500">
              Minimal, modern shopping experience. Discover quality products,
              curated brands, and clean design.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {/* Socials: these should be external links (open new tab) */}
              <SocialIcon href="https://instagram.com" Icon={Instagram} />
              <SocialIcon href="https://facebook.com" Icon={Facebook} />
              <SocialIcon href="https://twitter.com" Icon={Twitter} />
              <SocialIcon href="https://linkedin.com" Icon={Linkedin} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Shop</h4>
            <ul className="mt-4 space-y-3 text-slate-500">
              <FooterLink label="Category" to="/category" />
              <FooterLink label="Brand" to="/brand" />
              <FooterLink label="Offers" to="/offers" />
              <FooterLink label="New Arrivals" to="/new-arrivals" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Support</h4>
            <ul className="mt-4 space-y-3 text-slate-500">
              <FooterLink label="FAQs" to="/faqs" />
              <FooterLink label="Contact" to="/contact" />
              <FooterLink label="Returns" to="/returns" />
              <FooterLink label="Shipping" to="/shipping" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Contact</h4>
            <div className="mt-4 space-y-3 text-slate-500">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span>Karachi, Pakistan</span>
              </div>

              <a
                href="tel:+923000000000"
                className="flex items-center gap-3 hover:text-slate-800"
              >
                <Phone className="h-5 w-5 text-slate-400" />
                <span>+92 300 0000000</span>
              </a>

              <a
                href="mailto:support@fashionhub.com"
                className="flex items-center gap-3 hover:text-slate-800"
              >
                <Mail className="h-5 w-5 text-slate-400" />
                <span>support@fashionhub.com</span>
              </a>

              <div className="mt-4 rounded-2xl bg-purple-50/70 p-4">
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Tip:</span> Use
                  the filters to quickly find the best deals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FashionHub. All rights reserved.</p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="hover:text-slate-800" to="/terms">
              Terms
            </Link>
            <Link className="hover:text-slate-800" to="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-slate-800" to="/cookies">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label, to }) {
  return (
    <li>
      <Link
        to={to}
        className="transition hover:text-slate-800 hover:underline underline-offset-4"
      >
        {label}
      </Link>
    </li>
  );
}

function SocialIcon({ Icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
      aria-label="social"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
