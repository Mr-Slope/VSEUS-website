import type { NextConfig } from "next";

/*
  The site deploys to GitHub Pages, which serves plain static files, so the
  build is a static export.

  These three settings used to be injected at build time by the
  `static_site_generator: next` input on `actions/configure-pages`. That action
  only recognises `next.config.js`/`.mjs`, so instead of editing this file it
  wrote a fresh `next.config.js` alongside it. Next.js resolves `.js` before
  `.ts`, so the generated file shadowed this one and everything here was
  silently ignored. Worse, the action derives `basePath` from the repository
  name, which is right for a project site at <user>.github.io/VSEUS-website/
  but wrong for the apex domain vseus.ca, where the site root is `/`. Every
  `/VSEUS-website/_next/*` asset 404d and the site rendered unstyled.

  Owning the config here keeps that from happening again. The workflow no
  longer passes `static_site_generator`, so no `next.config.js` is generated.
*/
const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages has no image optimization server.
  images: { unoptimized: true },

  /*
    react-pdf imports the default PDF.js build, which only runs in the newest
    browsers. It calls methods such as Map.prototype.getOrInsertComputed and
    Math.sumPrecise with no fallback, so in anything older than Chrome 147,
    Firefox 144 or Safari/iOS 26.2, and in Samsung Internet, opening an issue
    on /economicreview/read crashed the page or drew its text in the wrong font. The legacy build ships the
    polyfills and is what PDF.js recommends for anything but the latest
    browsers. The worker is pointed at the matching legacy file in PdfViewer.
  */
  turbopack: {
    resolveAlias: {
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf.mjs',
    },
  },

  /*
    The Services page was renamed to Resources, but `redirects()` needs a
    server and is unsupported under `output: "export"`, so it cannot run here.
    Kept for reference in case the site ever moves to a host that can serve it.

    async redirects() {
      return [
        { source: '/services', destination: '/resources', permanent: true },
        { source: '/services/:path*', destination: '/resources', permanent: true },
      ];
    },
  */
};

export default nextConfig;
