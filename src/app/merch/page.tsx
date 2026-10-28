import React from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { BUNDLE, BUNDLE_SEPARATE_PRICE, GALLERY_PHOTOS, PRODUCTS, SHOP_URL, formatPrice } from '@/lib/merch';
import { SectionDivider } from '@/components/ui/SectionDivider';

function ShopButton() {
  return (
    <a
      href={SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-solid gap-2 px-6 py-3.5 text-base"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
      Shop on Showpass
    </a>
  );
}

/** The header's T-shirt and crewneck, drawn and animated to match the calendar on /events. */
function ShirtsIllustration() {
  return (
    <svg className="hidden md:block w-64 lg:w-72 flex-shrink-0" viewBox="0 0 240 180" fill="none" aria-hidden="true">
      {/* Sparkles */}
      {[
        { x: 22, y: 34, s: 7, delay: '0s' },
        { x: 222, y: 40, s: 9, delay: '0.8s' },
        { x: 228, y: 120, s: 6, delay: '1.6s' },
      ].map(({ x, y, s, delay }) => (
        <path
          key={`${x}-${y}`}
          className="merch-spark"
          style={{ animationDelay: delay }}
          d={`M${x},${y - s} Q${x},${y} ${x + s},${y} Q${x},${y} ${x},${y + s} Q${x},${y} ${x - s},${y} Q${x},${y} ${x},${y - s} Z`}
          fill="var(--accent)"
        />
      ))}

      <g className="merch-shirts">
        {/* T-shirt: accent, tucked behind and set askew */}
        <g transform="rotate(-8 85 100)">
          <path
            d="M65,50 Q85,64 105,50 L135,62 L150,88 L132,96 L130,150 Q85,154 40,150 L38,96 L20,88 L35,62 Z"
            fill="var(--accent)"
          />
          <path d="M65,50 Q85,64 105,50" stroke="var(--accent-600)" strokeWidth="4" strokeLinecap="round" />
          <path d="M38,96 L35,62 M132,96 L135,62" stroke="var(--accent-600)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="54" y="72" width="16" height="14" rx="3" fill="var(--midnight)" fillOpacity="0.2" />
        </g>

        {/* Crewneck: blue, in front, with VSEUS across the chest */}
        <path
          d="M135,66 Q150,78 165,66 L192,74 Q204,78 207,92 L214,146 L198,149 L190,104 L190,156 L110,156 L110,104 L102,149 L86,146 L93,92 Q96,78 108,74 Z"
          fill="var(--blue)"
        />
        <path d="M135,66 Q150,78 165,66" stroke="var(--midnight)" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
        <rect x="110" y="146" width="80" height="10" fill="var(--midnight)" fillOpacity="0.25" />
        <path d="M87,140 L101,143 M199,143 L213,140" stroke="var(--midnight)" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round" />
        <text
          x="150"
          y="120"
          textAnchor="middle"
          className="font-display"
          fontSize="20"
          fontWeight="900"
          letterSpacing="1"
          fill="var(--offwhite)"
        >
          VSEUS
        </text>
      </g>
    </svg>
  );
}

export default function MerchPage() {
  return (
    <div className="min-h-screen bg-ice">

      {/* Header */}
      <section className="bg-midnight py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/70 to-midnight-700/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-10">
          <div>
            <p className="font-sans text-accent text-xs font-semibold uppercase tracking-widest mb-3">VSEUS Merch</p>
            <h1 className="text-5xl font-black text-offwhite mb-4 leading-tight">
              Wear the<br />
              <span className="heading-accent">Society.</span>
            </h1>
            <p className="text-offwhite/55 text-lg max-w-xl leading-relaxed mb-8">
              T-shirts and crewnecks designed by and for economics students. Every purchase goes
              straight back into student programming.
            </p>
            <ShopButton />
          </div>
          <ShirtsIllustration />
        </div>
      </section>

      <SectionDivider from="midnight" to="ice" variant="wave" />
      {/* Products */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-midnight mb-10">The Lineup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.name} delay={i * 120}>
                <div className="bg-offwhite rounded-2xl overflow-hidden border border-ice-400 hover:border-accent hover:shadow-lg hover:shadow-midnight/10 transition-all">
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={product.photo.src}
                      alt={product.photo.alt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 px-7 py-6">
                    <h3 className="text-2xl font-bold text-midnight">{product.name}</h3>
                    <p className="flex items-center gap-2.5 font-display text-2xl font-black text-midnight-700">
                      <span className="w-9 h-9 rounded-full bg-accent text-midnight flex items-center justify-center" aria-hidden="true">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                      </span>
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bundle */}
          <Reveal delay={PRODUCTS.length * 120}>
            <div className="mt-8 bg-offwhite rounded-2xl overflow-hidden border border-ice-400 hover:border-accent hover:shadow-lg hover:shadow-midnight/10 transition-all grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[320px]">
                <Image
                  src={BUNDLE.photo.src}
                  alt={BUNDLE.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-5 px-7 py-8 lg:px-10">
                <span className="w-fit font-display text-xs font-bold uppercase tracking-[0.2em] text-midnight bg-accent px-3 py-1 rounded-full">
                  Save {formatPrice(BUNDLE_SEPARATE_PRICE - BUNDLE.price)}
                </span>
                <div>
                  <h3 className="text-3xl font-black text-midnight mb-2">{BUNDLE.name}</h3>
                  <p className="text-muted leading-relaxed">
                    The {BUNDLE.includes.join(' and the ')}, together for one price.
                  </p>
                </div>
                <p className="flex items-baseline gap-3 font-display">
                  <span className="text-4xl font-black text-midnight-700">{formatPrice(BUNDLE.price)}</span>
                  <span className="text-lg font-semibold text-muted line-through">
                    {formatPrice(BUNDLE_SEPARATE_PRICE)}
                  </span>
                </p>
                <div>
                  <ShopButton />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider from="ice" to="midnight" variant="ripple" />
      {/* Gallery */}
      <section className="bg-midnight py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-offwhite mb-10">In the Wild</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_PHOTOS.map((photo) => (
              <div key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="mt-12">
            <ShopButton />
          </div>
        </div>
      </section>
    </div>
  );
}
