import React from 'react';

/*
  Soft curved seams between sections of different colours.

  The divider sits between two sections: its background is the section above
  (`from`) and its curve is filled with the section below (`to`). Pass
  `from="transparent"` and position it absolutely to lay the curve over a photo
  or over whatever section happens to come before it (the footer does this).

  Every shape is drawn in a 1440x100 box and stretched to the divider's size, so
  the curves flatten on mobile and open out on wide screens. Mixing variants and
  `flip` from seam to seam is the point: no two neighbouring edges should match.
*/

type Surface = 'transparent' | 'ice' | 'midnight' | 'midnight-700' | 'midnight-900';
type Variant = 'wave' | 'swell' | 'dip' | 'drift' | 'ripple';

// Full literals so Tailwind can see every class at build time.
const BG: Record<Surface, string> = {
  transparent: 'bg-transparent',
  ice: 'bg-ice',
  midnight: 'bg-midnight',
  'midnight-700': 'bg-midnight-700',
  'midnight-900': 'bg-midnight-900',
};

const FILL: Record<Exclude<Surface, 'transparent'>, string> = {
  ice: 'fill-ice',
  midnight: 'fill-midnight',
  'midnight-700': 'fill-midnight-700',
  'midnight-900': 'fill-midnight-900',
};

const HEIGHT = {
  sm: 'h-8 sm:h-10 lg:h-14',
  md: 'h-12 sm:h-16 lg:h-24',
};

const PATHS: Record<Exclude<Variant, 'ripple'>, string> = {
  // One long asymmetric S, low on the left and lifting to the right.
  wave: 'M0,62 C260,104 520,96 760,58 C1000,20 1220,14 1440,42 L1440,100 L0,100 Z',
  // A broad hill: the lower section rises in the middle.
  swell: 'M0,92 Q720,-12 1440,92 L1440,100 L0,100 Z',
  // A bowl: the upper section hangs down in the middle.
  dip: 'M0,8 Q720,172 1440,8 L1440,100 L0,100 Z',
  // Two shallow undulations, barely there.
  drift: 'M0,56 C240,26 480,26 720,56 C960,86 1200,86 1440,56 L1440,100 L0,100 Z',
};

// Three stacked waves; the back two are translucent so the seam reads as depth.
const RIPPLE = [
  { d: 'M0,28 C320,78 640,4 960,40 C1200,68 1340,30 1440,22 L1440,100 L0,100 Z', opacity: 0.25 },
  { d: 'M0,54 C280,22 600,88 920,54 C1160,30 1320,62 1440,50 L1440,100 L0,100 Z', opacity: 0.5 },
  { d: 'M0,76 C360,50 720,100 1080,70 C1260,56 1380,70 1440,78 L1440,100 L0,100 Z', opacity: 1 },
];

export function SectionDivider({
  from,
  to,
  variant = 'wave',
  size = 'md',
  flip = false,
  className = '',
}: {
  from: Surface;
  to: Exclude<Surface, 'transparent'>;
  variant?: Variant;
  size?: keyof typeof HEIGHT;
  flip?: boolean;
  className?: string;
}) {
  return (
    // -my-px overlaps each neighbour by a pixel so no hairline shows at the seams.
    <div aria-hidden="true" className={`-my-px ${BG[from]} ${HEIGHT[size]} ${className}`}>
      <svg
        className={`block w-full h-full ${FILL[to]} ${flip ? '-scale-x-100' : ''}`}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        {variant === 'ripple'
          ? RIPPLE.map((layer) => <path key={layer.d} d={layer.d} fillOpacity={layer.opacity} />)
          : <path d={PATHS[variant]} />}
      </svg>
    </div>
  );
}
