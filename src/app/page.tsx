"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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
  matchedInputs: string[];
  rationale: string;
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
    matchedInputs: ["Lower energy", "Preserve fertility", "Avoid injections"],
    rationale:
      "Based on your goals and preferences, this option supports testosterone optimization while preserving flexibility for fertility-focused planning.",
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
    matchedInputs: [
      "Body-fat reduction goal",
      "Appetite support priority",
      "Metabolic lane selected",
    ],
    rationale:
      "This was recommended to match your body-composition and appetite-control priorities with a clinician-guided metabolic pathway.",
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
    matchedInputs: [
      "Improve sleep",
      "Improve recovery from workouts",
      "Gentler support style",
    ],
    rationale:
      "This recommendation aligns with your recovery and sleep goals through a more gradual support profile often used in recovery protocols.",
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
    matchedInputs: [
      "Better blood flow and training support",
      "Performance consistency focus",
      "Recovery lane selected",
    ],
    rationale:
      "This option was included to support blood-flow and training consistency based on your selected recovery-focused performance priorities.",
  },
];

const HERO_SOCIAL_PROOF = [
  {
    title: "Doubled Free Testosterone",
    quote:
      "Three months in with another TRT provider, I was injecting and seeing marginal results. I switched to Enhanced, the bloodwork process was seamless, and I got more information in my first consultation than I'd had in months elsewhere. At my follow-up, my free testosterone had doubled.",
    author: "Samuel, 43",
  },
  {
    title: "Proven by Bloodwork",
    quote:
      "Enhanced has been a great experience, from ease of use to quick and responsive customer support. Scheduling blood tests, getting results, and meeting with the physician have been seamless. I've noticed a difference in energy and strength since being on enclomiphene, and the best part is I have bloodwork to support it.",
    author: "Cesar, 24",
  },
  {
    title: "Easy at Home",
    quote:
      "I've been using injectable NAD+ for close to a month now and it's been a really positive experience. The injections are quick, painless, and simple to do at home. No negative side effects at all, and customer support has been excellent from day one.",
    author: "Anthony, 25",
  },
  {
    title: "Great Experience",
    quote:
      "I had a great experience with Enhanced from start to finish. The onboarding process was smooth and straightforward, and I was able to get my first order quickly without any issues.",
    author: "Oliver, 47",
  },
];

const WHY_RECOMMENDED_CAROUSEL = [
  {
    productId: "androgen-enclomiphene",
    image: "/zRdzF7z2Kdpw1lpGFE1CWjQI4.jpg",
    headline: "Sharper Focus. Clearer Thinking.",
    body: "Your answers indicated energy and performance support needs. This protocol is selected to help improve consistency and cognitive sharpness.",
  },
  {
    productId: "metabolic-tirzepatide",
    image: "/zPaxSJTMq4VBXCDxjBh1nlXMf5g.jpg",
    headline: "Sustained Energy Without the Crash",
    body: "Based on your body-composition and appetite goals, this recommendation supports steadier daily momentum with clinician-guided dosing.",
  },
  {
    productId: "recovery-sermorelin",
    image: "/ZaP0NYNBmiEfClMDe6Jrk3LfOm4.jpg",
    headline: "Restore Your Drive and Confidence.",
    body: "Recovery and sleep priorities in your responses mapped to this option for more resilient training and better day-to-day readiness.",
  },
  {
    productId: "recovery-tesamorelin",
    image: "/URqZwtsHAxCJZBV5acsRAo6rEw.jpg",
    headline: "Performance Support That Stacks.",
    body: "Blood-flow and performance consistency goals from your quiz are why this recommendation is included in your personalized pathway.",
  },
];

const ADVISORS = [
  {
    name: "Dr. Jonathann Kuo, MD",
    title: "Extension Health | CEO",
    image: "/advisors/advisor1.png",
    highlights: [
      "Regenerative & Longevity medicine",
      "Over 50,000 patients treated",
      "Treats elite athletes, CEOs, and celebrities",
    ],
  },
  {
    name: "Dr. Abud Bakri, MD",
    title: "Health Optimization Expert",
    image: "/advisors/advisor2.png",
    quote:
      "One of the most forward thinking, valuable protocol offering MDs",
    quoteAttribution: "Andrew D. Huberman, Ph.D. (@hubermanlab)",
  },
  {
    name: "Dr. Paulina & Elena Rueda",
    title: "Dama Health | Co-Founders",
    image: "/advisors/advisor3.png",
    highlights: [
      "Forefront of advancing women's care",
      "Personalized, data-driven protocols",
      "150+ clinical data points assessed",
    ],
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
  const whyCarouselRef = useRef<HTMLDivElement>(null);
  const whySlideRefs = useRef<Array<HTMLElement | null>>([]);
  const skipCenterOnNextWhyActiveRef = useRef(false);
  const [activeWhySlide, setActiveWhySlide] = useState(0);

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

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveWhySlide((current) =>
        (current + 1) % WHY_RECOMMENDED_CAROUSEL.length
      );
    }, 4200);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const container = whyCarouselRef.current;
    const slideEl = whySlideRefs.current[activeWhySlide];
    if (!container || !slideEl) {
      return;
    }
    if (skipCenterOnNextWhyActiveRef.current) {
      skipCenterOnNextWhyActiveRef.current = false;
      return;
    }

    // Center the active slide to avoid partial clipping from rough offsets.
    const centeredLeft =
      slideEl.offsetLeft - (container.clientWidth - slideEl.clientWidth) / 2;
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    const targetLeft = Math.min(maxScrollLeft, Math.max(0, centeredLeft));
    container.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, [activeWhySlide]);

  useEffect(() => {
    const container = whyCarouselRef.current;
    if (!container) {
      return;
    }

    let rafId = 0;
    const updateActiveFromScroll = () => {
      const viewportCenter = container.scrollLeft + container.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      WHY_RECOMMENDED_CAROUSEL.forEach((_, index) => {
        const slide = whySlideRefs.current[index];
        if (!slide) {
          return;
        }
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const distance = Math.abs(slideCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveWhySlide((current) => {
        if (current === closestIndex) {
          return current;
        }
        skipCenterOnNextWhyActiveRef.current = true;
        return closestIndex;
      });
    };

    const onScroll = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(updateActiveFromScroll);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    updateActiveFromScroll();

    return () => {
      container.removeEventListener("scroll", onScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-3 pb-32 pt-3 lg:max-w-none lg:gap-7 lg:px-2 lg:pb-24 lg:pt-2 xl:px-3">
        <section className="mx-auto w-full max-w-[1220px] rounded-[24px] border border-[#d9d9d9] bg-white p-4 lg:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-5">
              <div className="pl-2 lg:pl-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#575757] lg:text-[12px]">
                  BROUGHT BY ADVISORY TEAM
                </p>
                <h1 className="mt-2 text-[28px] leading-[0.98] [font-family:var(--font-gt-america-extended)] text-[#181c23] lg:text-[46px]">
                  YOUR PERSONALIZED
                  <br />
                  PROTOCOL IS READY.
                  <br />
                  <span className="text-[#0033FF]">
                    ENHANCED
                    <br />
                    BUILDS IT.
                  </span>
                </h1>
                <ul className="mt-4 space-y-2 text-[16px] text-[#181c23] lg:mt-5 lg:text-[17px]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0033FF]">+</span>
                    <span>Physician-designed protocols personalized to your bloodwork</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0033FF]">+</span>
                    <span>Protocol designed to support energy, fat loss and strength</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0033FF]">+</span>
                    <span>Exclusive access to the ultimate peptide gudie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0033FF]">+</span>
                    <span>Shipping included for free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0033FF]">+</span>
                    <span>Physican consultaton included for free</span>
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={scrollToBuilder}
                  className="mt-4 w-full rounded-full bg-[#0033FF] px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-white lg:mt-5 lg:max-w-[400px] lg:text-[13px]"
                >
                  Continue
                </button>
                <p className="mt-3 text-[12px] uppercase tracking-[0.08em] text-[#575757] lg:text-[14px]">
                  Provider review required before fulfillment
                </p>
              </div>

              <div className="rounded-[20px] border border-[#d9d9d9] bg-white p-2.5 lg:p-3">
                <div className="grid h-full grid-cols-2 gap-2.5 lg:gap-2.5">
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
                      <article
                        key={`${product.id}-hero`}
                        className={`rounded-[12px] border p-2 transition lg:p-2.5 ${
                          isSelected
                            ? "border-[#0033FF]/40 bg-[rgba(0,51,255,0.05)]"
                            : "border-[#d9d9d9] bg-[#f8f8f9]"
                        }`}
                      >
                        <div className="border-l-[3px] border-[#0033FF] pl-1.5">
                          <p className="text-[8px] uppercase tracking-[0.14em] text-[#575757] lg:text-[9px]">
                            Recommended
                          </p>
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] [font-family:var(--font-gt-america-extended)] text-[#181c23] lg:text-[11px]">
                            {product.focus}
                          </p>
                        </div>
                        <div className="relative mt-1 aspect-[4/3] overflow-hidden rounded-[10px]">
                          <Image
                            src={product.image}
                            alt={`${product.name} preview`}
                            fill
                            sizes="(max-width: 1024px) 45vw, 240px"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-1.5 truncate text-[12px] [font-family:var(--font-gt-america-extended)] lg:text-[13px]">
                          {product.name}
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-[#575757] lg:text-[12px]">
                          {product.highlight}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          {cyclePrice < cycleListPrice ? (
                            <p className="text-[11px] font-semibold text-black/45 line-through lg:text-[12px]">
                              ${cycleListPrice}
                            </p>
                          ) : null}
                          <p className="text-[12px] font-semibold text-[#181c23] lg:text-[13px]">
                            ${cyclePrice}
                          </p>
                          {selectedBillingOption.discount > 0 ? (
                            <span className="rounded-full bg-[rgba(0,51,255,0.12)] px-2 py-0.5 text-[8px] uppercase tracking-[0.08em] text-[#0033FF] lg:text-[9px]">
                              {Math.round(selectedBillingOption.discount * 100)}% Off
                            </span>
                          ) : null}
                        </div>
                        <div
                          className="relative mt-2 flex items-center gap-1.5"
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
                            className="flex min-w-0 flex-1 items-center justify-between rounded-lg border border-[#c8c8c8] bg-white px-2 py-1.5 text-[11px] [font-family:var(--font-gt-america)] text-black lg:text-[12px]"
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
                          <button
                            type="button"
                            onClick={() => toggleProduct(product.id)}
                            className={`rounded-full border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] transition lg:text-[10px] ${
                              isSelected
                                ? "border-[#0033FF] bg-[#0033FF] text-white"
                                : "border-[#0033FF] bg-white text-[#0033FF]"
                            }`}
                          >
                            {isSelected ? "Added" : "Select"}
                          </button>
                          {isBillingOpen ? (
                            <div
                              role="listbox"
                              className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-30 overflow-hidden rounded-lg border border-[#0033FF]/25 bg-white shadow-[0_14px_28px_-20px_rgba(0,51,255,0.85)]"
                            >
                              {BILLING_OPTIONS.map((option) => {
                                const isActive = option.value === selectedCycle;
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    className={`flex w-full items-center justify-between px-2 py-1.5 text-left text-[11px] [font-family:var(--font-gt-america)] ${
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
                    );
                  })}
                </div>
              </div>
            </div>

        </section>

        <section className="mx-auto w-full max-w-[1220px] rounded-[24px] border border-[#d9d9d9] bg-white p-3 lg:p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
            {HERO_SOCIAL_PROOF.map((item) => (
              <article
                key={`hero-proof-${item.title}`}
                className="rounded-[20px] border border-[#e0e0e0] bg-[#f5f5f7] p-4 lg:p-5"
              >
                <p className="text-[15px] leading-none tracking-[0.2em] text-[#6a6a6d]">
                  ★★★★★
                </p>
                <h3 className="mt-3 text-[24px] leading-[0.95] text-[#181c23] lg:text-[36px] [font-family:var(--font-ps-times)]">
                  &quot;{item.title}&quot;
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[#181c23] lg:text-[16px] [font-family:var(--font-gt-america)]">
                  {item.quote}
                </p>
                <p className="mt-4 text-[13px] text-[#181c23] lg:text-[16px] [font-family:var(--font-gt-america)]">
                  {item.author}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1220px] rounded-[24px] border border-[#d9d9d9] bg-white p-3 lg:p-4">
          <div className="px-2 pb-2 pt-2 lg:px-6 lg:pb-2 lg:pt-3">
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
            <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
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
                  <div
                    key={product.id}
                    className="flex min-w-[82%] snap-center flex-col gap-1.5 lg:min-w-0 lg:gap-2.5"
                  >
                    <div className="border-l-[4px] border-[#0033FF] px-1 pl-2">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#575757] lg:text-[11px]">
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
                          : "border-[#d9d9d9] bg-white"
                      } ${isBillingOpen ? "z-20" : ""}`}
                    >
                      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-[14px] border border-[#d9d9d9] bg-[#f5f5f7]">
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
                        {product.education}
                      </p>
                      {SHOW_PRODUCT_BENEFITS ? (
                        <ul className="mt-3 space-y-1 text-sm text-black/75">
                          {product.benefits.map((benefit) => (
                            <li key={benefit}>+ {benefit}</li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="mt-auto pt-3">
                        <div className="mb-2.5 flex items-center gap-2">
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
                          className="flex w-full items-center justify-between rounded-xl border border-[#c8c8c8] bg-white px-3 py-2 text-sm [font-family:var(--font-gt-america)] text-black lg:text-[17px]"
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

        <section className="mx-auto w-full max-w-[1220px] rounded-[24px] border border-[#d9d9d9] bg-white p-3 lg:p-4">
          <h2 className="text-[20px] leading-tight [font-family:var(--font-gt-america-extended)] lg:text-[34px]">
            WHY THESE WERE RECOMMENDED
          </h2>
          <p className="mt-2 max-w-[90ch] text-sm text-[#575757] lg:text-[16px]">
            Your recommendations are mapped to the goals, symptoms, and style
            preferences you selected in the quiz.
          </p>
          <div
            ref={whyCarouselRef}
            className="mt-3 -mx-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0"
          >
            <div className="flex snap-x snap-mandatory gap-3 lg:gap-4">
              {WHY_RECOMMENDED_CAROUSEL.map((slide, index) => {
                const product = PRODUCTS.find((item) => item.id === slide.productId);
                if (!product) {
                  return null;
                }

                const distance = Math.min(
                  (index - activeWhySlide + WHY_RECOMMENDED_CAROUSEL.length) %
                    WHY_RECOMMENDED_CAROUSEL.length,
                  (activeWhySlide - index + WHY_RECOMMENDED_CAROUSEL.length) %
                    WHY_RECOMMENDED_CAROUSEL.length
                );

                return (
                  <article
                    key={`reason-carousel-${product.id}`}
                    ref={(el) => {
                      whySlideRefs.current[index] = el;
                    }}
                    className={`min-w-[84%] snap-center rounded-[16px] bg-white transition duration-500 lg:min-w-[56%] xl:min-w-[48%] ${
                      distance === 0
                        ? "opacity-100"
                        : distance === 1
                          ? "opacity-45"
                          : "opacity-25"
                    }`}
                  >
                    <div className="relative aspect-[16/8.5] w-full overflow-hidden rounded-[14px]">
                      <Image
                        src={slide.image}
                        alt={`${product.name} lifestyle`}
                        fill
                        sizes="(max-width: 1024px) 88vw, 800px"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-3">
                      <h3 className="text-[24px] leading-tight [font-family:var(--font-gt-america-extended)] lg:text-[34px]">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-[#383838] lg:text-[15px]">
                        {slide.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-4 flex gap-2">
              {WHY_RECOMMENDED_CAROUSEL.map((slide, index) => {
                const isActive = index === activeWhySlide;
                return (
                  <button
                    key={`reason-indicator-${slide.productId}`}
                    type="button"
                    onClick={() => setActiveWhySlide(index)}
                    className={`h-1.5 rounded-full transition ${
                      isActive ? "w-12 bg-black" : "w-7 bg-black/20"
                    }`}
                    aria-label={`Show slide ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1220px] rounded-[24px] border border-[#d9d9d9] bg-white p-4 lg:p-6">
          <h2 className="text-center text-[34px] leading-[0.98] text-[#181c23] [font-family:var(--font-ps-times)] lg:text-[56px]">
            We Stand Behind Every Protocol.
          </h2>
          <p className="mx-auto mt-3 max-w-[760px] text-center text-[14px] leading-snug text-[#575757] lg:text-[18px]">
            Every Enhanced protocol is overseen by our Independent Medical Commission.
            World-class clinicians and scientists ensuring safety, efficacy, and scientific rigor at every step.
          </p>
          <div className="mt-5 -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 lg:mt-7">
            {ADVISORS.map((advisor, index) => (
              <article
                key={`advisor-${advisor.name}`}
                className="h-full min-w-[88%] snap-center lg:min-w-0"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-[#f5f5f7]">
                  <Image
                    src={advisor.image}
                    alt={`${advisor.name} profile`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 32vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-3 text-[17px] [font-family:var(--font-gt-america-extended)] text-[#181c23] lg:text-[20px]">
                  {advisor.name}
                </h3>
                <p className="text-[14px] text-[#181c23] lg:text-[17px]">{advisor.title}</p>
                {index === 1 && advisor.quote ? (
                  <>
                    <blockquote className="mt-3 border-l-[4px] border-[#d9d9d9] pl-3 text-[14px] leading-snug text-[#181c23] lg:mt-4 lg:pl-4 lg:text-[18px]">
                      &quot;{advisor.quote}&quot;
                    </blockquote>
                    <p className="mt-2 text-[12px] text-[#575757] lg:text-[14px]">
                      - {advisor.quoteAttribution}
                    </p>
                  </>
                ) : (
                  <ul className="mt-3 space-y-2 text-[14px] text-[#181c23] lg:mt-4 lg:text-[16px]">
                    {advisor.highlights?.map((item) => (
                      <li key={`${advisor.name}-${item}`} className="flex items-start gap-2">
                        <span className="text-[#575757]">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
          <aside className="absolute bottom-0 left-0 right-0 rounded-t-[28px] border-t border-[#d9d9d9] bg-white p-4 shadow-2xl">
            <div className="mx-auto w-10 rounded-full border-2 border-[#d9d9d9]" />
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
