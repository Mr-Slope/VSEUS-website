import React from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { GALLERY_PHOTOS, PRODUCTS, SHOP_URL, formatPrice } from '@/lib/merch';

function ShopButton() {
  return (
    <a
      href={SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-accent text-midnight font-display font-semibold px-6 py-3.5 rounded-lg hover:bg-accent-600 transition-colors text-base shadow-lg shadow-accent/20"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
      Shop on Showpass
    </a>
  );
}

export default function MerchPage() {
  return (
    <div className="min-h-screen bg-ice">

      {/* Header */}
      <section className="bg-midnight py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/70 to-midnight-700/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-display text-accent text-xs font-semibold uppercase tracking-widest mb-3">VSEUS Merch</p>
          <h1 className="text-5xl font-black text-offwhite mb-4 leading-tight">
            Wear the<br />Society.
          </h1>
          <p className="text-offwhite/55 text-lg max-w-xl leading-relaxed mb-8">
            T-shirts and hoodies designed by and for economics students. Every purchase goes
            straight back into student programming.
          </p>
          <ShopButton />
        </div>
      </section>

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
                  <div className="flex items-baseline justify-between gap-4 px-7 py-6">
                    <h3 className="text-2xl font-bold text-midnight">{product.name}</h3>
                    <p className="font-display text-2xl font-black text-midnight-700">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
