"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type BillingCycle = "monthly" | "quarterly" | "semiannual" | "yearly";

type Product = {
  id: string;
  name: string;
  lane: string;
  focus: string;
  price: number;
  cadence: string;
  highlight: string;
  benefits: string[];
  education: string;
  image: string;
  imageAlt: string;
};

const BILLING_OPTIONS: {
  value: BillingCycle;
  label: string;
  months: number;
  discount: number;
}[] = [
  { value: "monthly", label: "Monthly", months: 1, discount: 0.05 },
  { value: "quarterly", label: "Quarterly", months: 3, discount: 0.05 },
  { value: "semiannual", label: "Semi-Annual", months: 6, discount: 0.1 },
  { value: "yearly", label: "Yearly", months: 12, discount: 0.15 },
];

const DEFAULT_BILLING_CYCLE: BillingCycle = "monthly";

const PRODUCTS: Product[] = [
  {
    id: "androgen-enclomiphene",
    name: "Enclomiphene",
    lane: "Androgen Lane",
    focus: "Androgen",
    price: 129,
    cadence: "Monthly",
    highlight: "Support your body's natural testosterone production.",
    benefits: [
      "Supports energy and performance",
      "Designed for physician-guided optimization",
    ],
    education:
      "Enclomiphene is commonly used in male hormone optimization protocols to support endogenous testosterone production under clinician supervision.",
    image: "/medications/Enclomiphene.png",
    imageAlt: "Enclomiphene medication card image",
  },
  {
    id: "metabolic-tirzepatide",
    name: "Tirzepatide",
    lane: "Metabolic / GLP-1 Lane",
    focus: "Metabolic / GLP-1",
    price: 289,
    cadence: "Monthly",
    highlight:
      "Metabolic support option for appetite and glucose control.",
    benefits: [
      "Supports appetite regulation",
      "Targets sustainable fat-loss adherence",
    ],
    education:
      "Tirzepatide can support satiety and metabolic control. Dosing and progression are individualized to reduce side effects and maximize consistency.",
    image: "/medications/Tirzepatide.png",
    imageAlt: "Tirzepatide medication card image",
  },
  {
    id: "recovery-sermorelin",
    name: "Sermorelin",
    lane: "Recovery / GHRH Lane",
    focus: "Recovery / GHRH",
    price: 179,
    cadence: "Monthly",
    highlight:
      "Peptide pathway support for recovery and sleep depth.",
    benefits: [
      "Supports overnight recovery quality",
      "Useful for high-stress or high-output routines",
    ],
    education:
      "Sermorelin is a growth-hormone releasing hormone analog that may support recovery and sleep quality as part of comprehensive wellness plans.",
    image: "/medications/Sermorelin.jpg",
    imageAlt: "Sermorelin medication card image",
  },
  {
    id: "recovery-tesamorelin",
    name: "Tadalafil",
    lane: "Recovery / GHRH Lane",
    focus: "Recovery / GHRH",
    price: 249,
    cadence: "Monthly",
    highlight:
      "Supports blood flow and muscle fullness during training.",
    benefits: [
      "Supports body-composition goals",
      "Supports blood-flow and training consistency",
    ],
    education:
      "Tesamorelin is used in targeted body-composition protocols, and low-dose tadalafil is often selected to support vascular function and performance confidence.",
    image: "/medications/tesamorelin-tadalafil.jpg",
    imageAlt: "Tesamorelin and tadalafil medication card image",
  },
];

const TESTIMONIALS = [
  {
    title: "Appetite Finally Under Control",
    quote:
      "I came in skeptical. By week 6, my appetite finally felt manageable and I had a realistic routine I could stick with.",
    author: "Avery M., 39",
  },
  {
    title: "Actually Felt Personalized",
    quote:
      "The advisor call made all the difference. My protocol felt personalized, not generic.",
    author: "Chris D., 44",
  },
  {
    title: "First Program I Completed",
    quote:
      "Fast onboarding, clear dosing instructions, and consistent follow-up made this the first program I actually completed.",
    author: "Jordan R., 36",
  },
];

const ADVISORS = [
  {
    name: "Dr. Priya Shah, MD",
    title: "Medical Director, Hormone Optimization",
    detail:
      "Board-certified in internal medicine, focused on hormone and longevity protocols.",
    image: "/advisors/advisor1.png",
  },
  {
    name: "Dr. Michael Crane, DO",
    title: "Clinical Lead, Metabolic Health",
    detail:
      "Specializes in obesity medicine and personalized GLP-1 treatment plans.",
    image: "/advisors/advisor2.png",
  },
  {
    name: "Dr. Elena Ortiz, MD",
    title: "Advising Physician, Recovery Medicine",
    detail:
      "Expert in performance recovery protocols and patient safety monitoring.",
    image: "/advisors/advisor3.png",
  },
];

const SHOW_PRODUCT_BENEFITS = false;

const getBillingOption = (cycle: BillingCycle) =>
  BILLING_OPTIONS.find((option) => option.value === cycle) ?? BILLING_OPTIONS[0];

const getCyclePrice = (monthlyPrice: number, cycle: BillingCycle) => {
  const option = getBillingOption(cycle);
  return Math.round(monthlyPrice * option.months * (1 - option.discount));
};

const getCycleListPrice = (monthlyPrice: number, cycle: BillingCycle) => {
  const option = getBillingOption(cycle);
  return monthlyPrice * option.months;
};

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openBillingDropdownFor, setOpenBillingDropdownFor] = useState<
    string | null
  >(null);
  const [billingByProduct, setBillingByProduct] = useState<
    Record<string, BillingCycle>
  >(() =>
    PRODUCTS.reduce<Record<string, BillingCycle>>(
      (acc, product) => ({
        ...acc,
        [product.id]: DEFAULT_BILLING_CYCLE,
      }),
      {}
    )
  );
  const builderRef = useRef<HTMLDivElement>(null);

  const selectedProducts = useMemo(
    () => PRODUCTS.filter((product) => selectedIds.includes(product.id)),
    [selectedIds]
  );

  const subtotal = useMemo(
    () =>
      selectedProducts.reduce((total, item) => {
        const cycle = billingByProduct[item.id] ?? DEFAULT_BILLING_CYCLE;
        return total + getCyclePrice(item.price, cycle);
      }, 0),
    [selectedProducts, billingByProduct]
  );

  const addProduct = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      const nextSelected = [...current, id];
      setBillingByProduct((previousBilling) => {
        const selectedCycle = previousBilling[id] ?? DEFAULT_BILLING_CYCLE;
        const synced = { ...previousBilling };

        // Keep add-on defaults aligned to the most recently selected cycle.
        PRODUCTS.forEach((product) => {
          if (!nextSelected.includes(product.id)) {
            synced[product.id] = selectedCycle;
          }
        });

        return synced;
      });
      setIsDrawerOpen(true);
      return nextSelected;
    });
  };

  const removeProduct = (id: string) => {
    setSelectedIds((current) => current.filter((currentId) => currentId !== id));
  };

  const toggleProduct = (id: string) => {
    setSelectedIds((current) => {
      const isAlreadySelected = current.includes(id);
      if (isAlreadySelected) {
        return current.filter((currentId) => currentId !== id);
      }

      const nextSelected = [...current, id];
      setBillingByProduct((previousBilling) => {
        const selectedCycle = previousBilling[id] ?? DEFAULT_BILLING_CYCLE;
        const synced = { ...previousBilling };

        PRODUCTS.forEach((product) => {
          if (!nextSelected.includes(product.id)) {
            synced[product.id] = selectedCycle;
          }
        });

        return synced;
      });
      setIsDrawerOpen(true);
      return nextSelected;
    });
  };

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openCart = () => {
    setIsDrawerOpen(true);
  };

  const handleStickyCtaClick = () => {
    if (selectedProducts.length > 0) {
      openCart();
      return;
    }
    scrollToBuilder();
  };

  const addOnProducts = useMemo(
    () => PRODUCTS.filter((product) => !selectedIds.includes(product.id)),
    [selectedIds]
  );

  return (
    <div className="relative min-h-screen bg-[#fcfcfa]">
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-3 pb-32 pt-3 lg:max-w-none lg:gap-7 lg:px-2 lg:pb-24 lg:pt-6 xl:px-3">
        <section className="rounded-[24px] border border-black/10 bg-white">
          <div className="bg-black px-5 py-6 text-white lg:px-12 lg:py-10">
            <p className="text-[16px] uppercase tracking-[0.22em] lg:text-[20px]">
              BROUGHT BY ADVISORY TEAM
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/80 lg:text-[13px]">
              TAILORED FOR YOUR BIOLOGY & GOALS
            </p>
            <h1 className="mt-3 text-[28px] leading-[1.06] [font-family:var(--font-gt-america-extended)] lg:text-[56px]">
             YOUR PERSONALIZED PROTOCOL
            </h1>
          </div>
          <div className="p-5 lg:px-12 lg:py-8">
            <div
              ref={builderRef}
              id="protocol-builder"
              className="sr-only"
            >
              <h2 className="text-[22px] leading-tight [font-family:var(--font-gt-america-extended)]">
                BUILD YOUR
                <br />
                PERSONALIZED PROTOCOLS
              </h2>
              <button
                type="button"
                onClick={openCart}
                className="rounded-full border border-[#0033FF] bg-[#0033FF] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white"
              >
                Cart ({selectedProducts.length})
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
            {PRODUCTS.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                const selectedCycle =
                  billingByProduct[product.id] ?? DEFAULT_BILLING_CYCLE;
                const selectedBillingOption = getBillingOption(selectedCycle);
                const cyclePrice = getCyclePrice(product.price, selectedCycle);
                const cycleListPrice = getCycleListPrice(
                  product.price,
                  selectedCycle
                );
                const isBillingOpen = openBillingDropdownFor === product.id;

                return (
                  <div key={product.id} className="flex flex-col gap-1.5 lg:gap-2.5">
                    <div className="border-l-2 border-[#0033FF] px-1 pl-2">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-black/55 lg:text-[11px]">
                        Recommended
                      </p>
                      <p className="mt-0.5 text-[12px] leading-tight uppercase tracking-[0.08em] [font-family:var(--font-gt-america-extended)] text-black lg:text-[17px]">
                        {product.focus}
                      </p>
                    </div>
                    <article
                      className={`relative flex h-full flex-col rounded-[18px] border p-3 transition lg:p-5 ${
                        isSelected
                          ? "border-[#0033FF]/35 bg-[rgba(0,51,255,0.06)] shadow-[0_0_0_1px_rgba(0,51,255,0.18)]"
                          : "border-[#e9e9e5] bg-white"
                      } ${isBillingOpen ? "z-20" : ""}`}
                    >
                      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-[14px] border border-[#e9e9e5] bg-[#fdfdfb]">
                        <Image
                          src={product.image}
                          alt={product.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 420px"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-1 text-[15px] leading-tight [font-family:var(--font-gt-america-extended)] lg:text-[22px]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-black/70 lg:text-[17px]">
                        {product.highlight}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          {cyclePrice < cycleListPrice ? (
                            <p className="text-base font-semibold text-black/45 line-through lg:text-[26px]">
                              ${cycleListPrice}
                            </p>
                          ) : null}
                          <p className="text-base font-semibold text-black lg:text-[26px]">
                            ${cyclePrice}
                          </p>
                          {selectedBillingOption.discount > 0 ? (
                            <span className="whitespace-nowrap rounded-full bg-[rgba(0,51,255,0.12)] px-2 py-1 text-[9px] leading-none uppercase tracking-[0.08em] text-[#0033FF] lg:text-[11px]">
                              {Math.round(selectedBillingOption.discount * 100)}%
                              Off
                            </span>
                          ) : null}
                        </div>
                      </div>
                      {SHOW_PRODUCT_BENEFITS ? (
                        <ul className="mt-3 space-y-1 text-sm text-black/75">
                          {product.benefits.map((benefit) => (
                            <li key={benefit}>+ {benefit}</li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="mt-auto pt-3">
                        <button
                          type="button"
                          onClick={() => toggleProduct(product.id)}
                          className={`w-full rounded-full border px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition lg:text-[12px] ${
                            isSelected
                              ? "border-[#0033FF] bg-[#0033FF] text-white"
                              : "border-[#0033FF] bg-white text-[#0033FF]"
                          }`}
                        >
                          {isSelected ? "Added" : "Select"}
                        </button>
                      </div>
                      <label className="mt-2 block text-[10px] uppercase tracking-[0.1em] text-black/55 lg:text-[11px]">
                        Billing cycle
                      </label>
                      <div
                        className="relative mt-1"
                        onBlur={(event) => {
                          const nextTarget = event.relatedTarget as Node | null;
                          if (!event.currentTarget.contains(nextTarget)) {
                            setOpenBillingDropdownFor((current) =>
                              current === product.id ? null : current
                            );
                          }
                        }}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl border border-black/20 bg-white px-3 py-2 text-sm [font-family:var(--font-gt-america)] text-black lg:text-[17px]"
                          onClick={() =>
                            setOpenBillingDropdownFor((current) =>
                              current === product.id ? null : product.id
                            )
                          }
                          aria-haspopup="listbox"
                          aria-expanded={isBillingOpen}
                        >
                          <span>{selectedBillingOption.label}</span>
                          <span className="text-black/65">⌄</span>
                        </button>
                        {isBillingOpen ? (
                          <div
                            role="listbox"
                            className="absolute left-0 right-0 top-[calc(100%+0.35rem)] overflow-hidden rounded-xl border border-[#0033FF]/25 bg-white shadow-[0_14px_28px_-20px_rgba(0,51,255,0.85)]"
                          >
                            {BILLING_OPTIONS.map((option) => {
                              const isActive = option.value === selectedCycle;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm [font-family:var(--font-gt-america)] ${
                                    isActive
                                      ? "bg-[rgba(0,51,255,0.12)] text-[#0033FF]"
                                      : "bg-white text-black hover:bg-[#f4f7ff]"
                                  }`}
                                  onClick={() => {
                                    setBillingByProduct((current) => ({
                                      ...current,
                                      [product.id]: option.value,
                                    }));
                                    setOpenBillingDropdownFor(null);
                                  }}
                                >
                                  <span>{option.label}</span>
                                  {isActive ? <span>✓</span> : null}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </div>
                );
            })}
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-black/10 bg-white p-4 lg:p-6">
          <h2 className="text-[20px] leading-tight [font-family:var(--font-gt-america-extended)] lg:text-[34px]">
            ADVISORY TEAM
          </h2>
          <p className="mt-2 text-sm text-black/70 lg:text-[15px]">
            The experts ensuring safety, efficacy, and science-backed results.
          </p>
          <div className="mt-3 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
            {ADVISORS.map((advisor) => (
              <article
                key={`advisor-${advisor.name}`}
                className="flex h-full items-start gap-3 rounded-[16px] border border-[#e9e9e5] bg-[#fdfdfb] p-3 lg:p-5"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-black/15 bg-white lg:h-14 lg:w-14">
                  <Image
                    src={advisor.image}
                    alt={`${advisor.name} profile`}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm [font-family:var(--font-gt-america-extended)] lg:text-[20px]">
                    {advisor.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-black/60 lg:text-[12px]">
                    {advisor.title}
                  </p>
                  <p className="mt-1 text-sm text-black/70 lg:text-[17px]">{advisor.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-black/10 bg-white p-4 lg:p-6">
          <h2 className="text-[20px] leading-tight [font-family:var(--font-gt-america-extended)] lg:text-[34px]">
            MEDICATION GUIDE
          </h2>
          <div className="mt-3 -mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:overflow-visible lg:px-0">
            <div className="flex snap-x snap-mandatory gap-3 lg:grid lg:grid-cols-4 lg:gap-5">
              {PRODUCTS.map((product, index) => {
                const isSelected = selectedIds.includes(product.id);
                const tags = product.focus
                  .split("/")
                  .map((tag) => tag.trim().toUpperCase())
                  .filter(Boolean);
                const educationImage =
                  index % 2 === 0
                    ? "/education/education1.jpg"
                    : "/education/education2.jpg";

                return (
                  <article
                    key={`${product.id}-education`}
                    className="min-w-[86%] snap-start rounded-[16px] border border-[#e9e9e5] bg-[#fdfdfb] p-3 lg:min-w-0 lg:p-4"
                  >
                    <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-[14px] border border-[#e9e9e5] bg-white">
                      <Image
                        src={educationImage}
                        alt={`${product.name} education`}
                        fill
                        sizes="(max-width: 768px) 86vw, 560px"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-[15px] leading-tight [font-family:var(--font-gt-america-extended)] text-black">
                      {product.name.toUpperCase()}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={`${product.id}-${tag}`}
                          className="rounded-full bg-[rgba(0,51,255,0.12)] px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-[#0033FF]"
                        >
                          + {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-black/70 lg:text-[15px]">
                      {product.education}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className={`mt-4 w-full rounded-full border px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition ${
                        isSelected
                          ? "border-[#0033FF] bg-[#0033FF] text-white"
                          : "border-[#0033FF] bg-white text-[#0033FF]"
                      }`}
                    >
                      {isSelected ? "Added" : "Select"}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-black/10 bg-white p-4 lg:p-6">
          <h2 className="text-[20px] leading-tight [font-family:var(--font-gt-america-extended)] lg:text-[34px]">
            REAL CUSTOMERS
          </h2>
          <div className="mt-3 space-y-3 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
            {TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.author}
                className="rounded-[12px] border border-[#e9e9e5] bg-[#fdfdfb] p-3 lg:p-5"
              >
                <p className="text-sm [font-family:var(--font-gt-america-extended)] text-black lg:text-[20px]">
                  {testimonial.title}
                </p>
                <p className="text-sm leading-relaxed text-black/75 lg:text-[17px]">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="mt-2 text-sm [font-family:var(--font-gt-america-extended)] lg:text-[16px]">
                  {testimonial.author}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <button
        type="button"
        onClick={handleStickyCtaClick}
        className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-full border border-[#0033FF] bg-[#0033FF] px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white shadow-xl lg:w-[calc(100%-1rem)] lg:max-w-none"
      >
        {selectedProducts.length > 0
          ? `Review ${selectedProducts.length} Item${
              selectedProducts.length > 1 ? "s" : ""
            } • $${subtotal}`
          : "Select Protocol Options"}
      </button>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 bg-black/50">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="h-full w-full"
            aria-label="Close cart drawer"
          />
          <aside className="absolute bottom-0 left-0 right-0 rounded-t-[28px] border-t border-black/10 bg-white p-4 shadow-2xl">
            <div className="mx-auto w-10 rounded-full border-2 border-black/10" />
            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-lg [font-family:var(--font-gt-america-extended)]">
                ADDED TO CART
              </h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-[11px] uppercase tracking-[0.14em] text-black/65"
              >
                Close
              </button>
            </div>
            {selectedProducts.length === 0 ? (
              <p className="mt-4 text-sm text-black/70">
                Your cart is empty. Add your recommended options first.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {selectedProducts.map((product) => (
                  <article
                    key={`${product.id}-cart`}
                    className="rounded-[12px] border border-black/10 p-3"
                  >
                    {(() => {
                      const cycle =
                        billingByProduct[product.id] ?? DEFAULT_BILLING_CYCLE;
                      const cycleLabel = getBillingOption(cycle).label;
                      const cyclePrice = getCyclePrice(product.price, cycle);

                      return (
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm [font-family:var(--font-gt-america-extended)]">
                              {product.name}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.14em] text-black/55">
                              {product.lane}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.14em] text-black/45">
                              {cycleLabel}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-black">
                              ${cyclePrice}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#0033FF]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </article>
                ))}
                {addOnProducts.length > 0 ? (
                  <div className="rounded-[12px] border border-black/10 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-black/65">
                      Add-ons
                    </p>
                    <div className="mt-2 space-y-2">
                      {addOnProducts.map((product) => {
                        const cycle =
                          billingByProduct[product.id] ?? DEFAULT_BILLING_CYCLE;
                        const cyclePrice = getCyclePrice(product.price, cycle);

                        return (
                          <article
                            key={`${product.id}-addon`}
                            className="rounded-[10px] border border-black/10 p-2.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm [font-family:var(--font-gt-america-extended)]">
                                  {product.name}
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.12em] text-black/55">
                                  {product.focus}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-black">
                                ${cyclePrice}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div
                                className="relative min-w-0 flex-1"
                                onBlur={(event) => {
                                  const nextTarget =
                                    event.relatedTarget as Node | null;
                                  if (!event.currentTarget.contains(nextTarget)) {
                                    setOpenBillingDropdownFor((current) =>
                                      current === product.id ? null : current
                                    );
                                  }
                                }}
                              >
                                <button
                                  type="button"
                                  className="flex h-9 w-full items-center justify-between rounded-xl border border-black/20 bg-white px-3 text-xs [font-family:var(--font-gt-america)] text-black"
                                  onClick={() =>
                                    setOpenBillingDropdownFor((current) =>
                                      current === product.id ? null : product.id
                                    )
                                  }
                                  aria-haspopup="listbox"
                                  aria-expanded={openBillingDropdownFor === product.id}
                                >
                                  <span>
                                    {getBillingOption(cycle).label}
                                  </span>
                                  <span className="text-black/65">⌄</span>
                                </button>
                                {openBillingDropdownFor === product.id ? (
                                  <div
                                    role="listbox"
                                    className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 overflow-hidden rounded-xl border border-[#0033FF]/25 bg-white shadow-[0_14px_28px_-20px_rgba(0,51,255,0.85)]"
                                  >
                                    {BILLING_OPTIONS.map((option) => {
                                      const isActive = option.value === cycle;
                                      return (
                                        <button
                                          key={option.value}
                                          type="button"
                                          role="option"
                                          aria-selected={isActive}
                                          onClick={() => {
                                            setBillingByProduct((current) => ({
                                              ...current,
                                              [product.id]:
                                                option.value as BillingCycle,
                                            }));
                                            setOpenBillingDropdownFor(null);
                                          }}
                                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs [font-family:var(--font-gt-america)] ${
                                            isActive
                                              ? "bg-[rgba(0,51,255,0.18)] text-[#0033FF]"
                                              : "text-black hover:bg-[rgba(0,51,255,0.08)]"
                                          }`}
                                        >
                                          <span>{option.label}</span>
                                          {isActive ? <span>✓</span> : null}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                onClick={() => addProduct(product.id)}
                                className="rounded-full border border-[#0033FF] bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#0033FF]"
                              >
                                Select
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-black/60">
                    Subtotal
                  </p>
                  <p className="text-base font-semibold text-black">${subtotal}</p>
                </div>
              </div>
            )}
            <button
              type="button"
              disabled={selectedProducts.length === 0}
              className="mt-4 w-full rounded-full border border-[#0033FF] bg-[#0033FF] px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:border-black/20 disabled:bg-black/20"
            >
              CONTINUE
            </button>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
