import React from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { CTAButton } from '@/components/ui/CTAButton';
import { HOME_PHOTOS, SHOP_URL } from '@/lib/merch';

export function MerchStrip() {
  return (
    <section className="bg-midnight-700 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-center">

          <Reveal>
            <p className="font-sans text-xs font-semibold text-accent uppercase tracking-widest mb-3">
              VSEUS Merch
            </p>
            <h2 className="text-4xl font-black text-offwhite mb-4 leading-tight">
              Wear the<br />
              <span className="heading-accent">Society.</span>
            </h2>
            <p className="text-offwhite/60 leading-relaxed mb-7 max-w-md text-sm">
              T-shirts and crewnecks designed by and for economics
              students. Every purchase goes straight back into student programming.
            </p>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid gap-2 px-6 py-3.5 text-base"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              Shop Merch
            </a>
            <div className="mt-4">
              <CTAButton href="/merch" variant="outline-light" size="md">
                See Photos &amp; Prices
              </CTAButton>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {HOME_PHOTOS.map((photo, i) => (
                <div
                  key={photo.src}
                  className={`relative aspect-[3/2] overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2' : ''}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={i === 0 ? '(min-width: 1024px) 700px, 100vw' : '(min-width: 1024px) 350px, 50vw'}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
