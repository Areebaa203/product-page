// src/pages/contact.jsx  (or wherever your contact page lives)
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Briefcase, Phone, MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";

// shadcn form + inputs
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/Components/ui/form";

import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phoneCode: z.string().trim().min(1),
  phone: z
    .string()
    .trim()
    .min(7, "Phone too short")
    .max(20, "Phone too long")
    .regex(/^[+()0-9\s-]+$/, "Invalid phone"),
  interest: z.string().min(1, "Select an option"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

const BRAND = "#1472B2";
const BRAND_HOVER = "#0F5F96";

export default function ContactUs() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phoneCode: "+92",
      phone: "",
      interest: "Design & Branding",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setIsSubmitted(true);
    console.log("CONTACT FORM:", data);
    form.reset();
    
    // Smoothly hide the success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-12 py-12">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* LEFT CARD */}
          <div className="rounded-2xl bg-slate-50 p-7 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 font-montserrat">
              Other ways to connect
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              We'd love to hear from you. Our friendly team is always here to
              chat.
            </p>

            <div className="mt-6 space-y-6">
              <InfoBlock
                icon={<Mail className="h-5 w-5 text-[#1472B2]" />}
                title="Reach us on email"
                subtitle="Our friendly team is here to help."
                linkText="info@yourmail.com"
                href="mailto:info@yourmail.com"
              />

              <InfoBlock
                icon={<Briefcase className="h-5 w-5 text-[#1472B2]" />}
                title="For Careers"
                subtitle="Send your resume on"
                linkText="careers@yourmail.com"
                href="mailto:careers@yourmail.com"
              />

              <InfoBlock
                icon={<Phone className="h-5 w-5 text-[#1472B2]" />}
                title="Phone"
                subtitle="Mon-Fri from 8am to 5pm."
              >
                <a
                  href="tel:+14558758005"
                  className="mt-2 block text-sm font-medium text-[#1472B2] hover:underline"
                >
                  +01 (455) 875 8005
                </a>
                <a
                  href="tel:+14556522654"
                  className="mt-1 block text-sm font-medium text-[#1472B2] hover:underline"
                >
                  +01 (455) 652 6254
                </a>
              </InfoBlock>

              <InfoBlock
                icon={<MapPin className="h-5 w-5 text-[#1472B2]" />}
                title="Office"
                subtitle="Come say hello at our office HQ."
              >
                <div className="mt-2 text-sm text-[#1472B2] leading-relaxed">
                  2814 Fisher Rd, 1st Floor, Opp. alex street,
                  <br />
                  Columbus, Ohio 43204
                </div>
              </InfoBlock>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="rounded-2xl bg-white p-7 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-semibold text-slate-900 font-montserrat">
              Love to hear from you,
              <br />
              Get in touch{" "}
              <span role="img" aria-label="wave">
                👋
              </span>
            </h2>

            <Form {...form}>
              {isSubmitted && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm font-medium leading-none">
                    Your form has been submitted successfully!
                  </p>
                </div>
              )}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
              >
                {/* Row 1 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1.5 block text-sm font-medium text-slate-700">
                          Your Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your Name"
                            className={[
                              "h-11 w-full rounded-md border bg-slate-50 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400",
                              "focus:border-[#1472B2] focus:ring-2 focus:ring-[#1472B2]/20",
                              form.formState.errors.name
                                ? "border-rose-300"
                                : "border-slate-200",
                            ].join(" ")}
                          />
                        </FormControl>
                        <FormMessage className="mt-1 text-xs text-rose-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1.5 block text-sm font-medium text-slate-700">
                          Your Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your Email"
                            className={[
                              "h-11 w-full rounded-md border bg-slate-50 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400",
                              "focus:border-[#1472B2] focus:ring-2 focus:ring-[#1472B2]/20",
                              form.formState.errors.email
                                ? "border-rose-300"
                                : "border-slate-200",
                            ].join(" ")}
                          />
                        </FormControl>
                        <FormMessage className="mt-1 text-xs text-rose-600" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2 */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Phone grouped */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1.5 block text-sm font-medium text-slate-700">
                          Phone No.
                        </FormLabel>

                        <div
                          className={[
                            "flex h-11 w-full overflow-hidden rounded-md border bg-slate-50",
                            "focus-within:border-[#1472B2] focus-within:ring-2 focus-within:ring-[#1472B2]/20",
                            form.formState.errors.phone
                              ? "border-rose-300"
                              : "border-slate-200",
                          ].join(" ")}
                        >
                          {/* phoneCode */}
                          <FormField
                            control={form.control}
                            name="phoneCode"
                            render={({ field: codeField }) => (
                              <Select
                                value={codeField.value}
                                onValueChange={codeField.onChange}
                              >
                                <SelectTrigger className="h-full w-20 border-0 bg-transparent px-3 text-sm text-slate-700 shadow-none focus:ring-0">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="+92">+92</SelectItem>
                                  <SelectItem value="+1">+1</SelectItem>
                                  <SelectItem value="+44">+44</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />

                          <div className="h-full w-px bg-slate-200" />

                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your phone no."
                              className="h-full w-full border-0 bg-transparent px-3 text-sm text-slate-700 shadow-none outline-none placeholder:text-slate-400 focus-visible:ring-0"
                            />
                          </FormControl>
                        </div>

                        <FormMessage className="mt-1 text-xs text-rose-600" />
                      </FormItem>
                    )}
                  />

                  {/* Interest */}
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1.5 block text-sm font-medium text-slate-700">
                          What you are interested
                        </FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={[
                                "h-11 w-full rounded-md border bg-slate-50 px-3 text-sm text-slate-700 outline-none",
                                "focus:border-[#1472B2] focus:ring-2 focus:ring-[#1472B2]/20",
                                form.formState.errors.interest
                                  ? "border-rose-300"
                                  : "border-slate-200",
                              ].join(" ")}
                            >
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="Design & Branding">
                              Design & Branding
                            </SelectItem>
                            <SelectItem value="Web Design">
                              Web Design
                            </SelectItem>
                            <SelectItem value="Development">
                              Development
                            </SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage className="mt-1 text-xs text-rose-600" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1.5 block text-sm font-medium text-slate-700">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="Let tell us know your project about"
                          className={[
                            "w-full rounded-md border bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400",
                            "focus:border-[#1472B2] focus:ring-2 focus:ring-[#1472B2]/20",
                            form.formState.errors.message
                              ? "border-rose-300"
                              : "border-slate-200",
                          ].join(" ")}
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-rose-600" />
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: BRAND }}
                  className="inline-flex w-64 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = BRAND_HOVER)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = BRAND)
                  }
                >
                  <span>{isSubmitting ? "Sending..." : "Send message"}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- helper component ---------------------- */
function InfoBlock({ icon, title, subtitle, linkText, href, children }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>

      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-xs text-slate-500">{subtitle}</div>

        {linkText && href && (
          <a
            href={href}
            className="mt-2 block text-sm font-medium text-[#1472B2] hover:underline"
          >
            {linkText}
          </a>
        )}

        {children}
      </div>
    </div>
  );
}
