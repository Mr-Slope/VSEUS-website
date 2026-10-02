'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs, type DocumentProps } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

/*
  The worker has to be configured in the module that renders <Document>, or
  react-pdf's own default can overwrite it depending on import order. Bundling
  it from the installed package keeps it on the same version as the main
  library and serves it from this site rather than a CDN.
*/
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type PdfDocument = Parameters<NonNullable<DocumentProps['onLoadSuccess']>>[0];

interface Size {
  width: number;
  height: number;
}

/** CSS pixels per PDF point at 100%. PDF measures in 1/72 inch, CSS in 1/96. */
const ACTUAL_SIZE = 96 / 72;

/** Zoom presets, as fractions of actual size. */
const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

/**
 * The most "fit to width" will enlarge a page. Past this a letter page on a
 * wide screen grows taller than is comfortable without reading any better.
 * PDF.js uses the same ceiling for its automatic zoom.
 */
const MAX_FIT = 1.25;

/** iOS Safari draws a canvas larger than this blank, so the sharpness is capped to stay under it. */
const MAX_CANVAS_PIXELS = 16_777_216;

/** Pages within this distance of the viewport are drawn. The rest are blank pages of the right size. */
const RENDER_MARGIN = '150% 0px';

const TOOL_BUTTON = [
  'w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0',
  'text-midnight hover:bg-ice-200 transition-colors',
  'disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight',
].join(' ');

const DOWNLOAD_BUTTON = [
  'inline-flex items-center justify-center gap-2 flex-shrink-0',
  'h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg bg-accent text-midnight font-display font-semibold text-sm',
  'hover:bg-accent-600 transition-colors btn-press',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite',
].join(' ');

function ToolButton({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  icon: string;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className={TOOL_BUTTON}>
      <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
    </button>
  );
}

const ICONS = {
  previous: 'M15.75 19.5L8.25 12l7.5-7.5',
  next: 'M8.25 4.5l7.5 7.5-7.5 7.5',
  zoomOut: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6',
  zoomIn: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6',
  fit: 'M3 12h18M3 12l4-4m-4 4l4 4m14-4l-4-4m4 4l-4 4',
  download: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
};

/** A blank page standing in while the document loads. Letter proportions, like every issue so far. */
function PagePlaceholder() {
  return (
    <div className="mx-auto w-full max-w-[816px] aspect-[17/22] bg-offwhite shadow-md shadow-midnight/10 animate-pulse motion-reduce:animate-none" />
  );
}

/** How sharp to draw a page: the screen's own density, unless that would break the canvas limit. */
function pixelRatio(width: number, height: number): number {
  return Math.min(window.devicePixelRatio || 1, Math.sqrt(MAX_CANVAS_PIXELS / (width * height)));
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
}

interface PdfViewerProps {
  /** The PDF's URL, already encoded with assetUrl(). */
  url: string;
  /** Filename offered when the PDF is downloaded. */
  downloadName: string;
  /** Called once the document has opened, for the page's own metadata. */
  onPageCount?: (count: number) => void;
}

/**
 * An issue's PDF, drawn into the page with PDF.js.
 *
 * Chosen over the browser's own viewer in an iframe, which cannot be styled,
 * looks different in every browser, and on Android shows nothing at all. Here
 * the controls are the site's own and behave the same everywhere.
 *
 * Pages stack in one continuous column, like the PDF viewers people already
 * know, and the page scrolls rather than a box inside it, so reading on a
 * phone is ordinary scrolling. The toolbar sticks under the navbar.
 *
 * Only pages near the viewport are drawn. Every page keeps its full size as a
 * blank sheet, so the scroll height is right from the start, but a canvas
 * costs megabytes and a phone runs out of memory long before the end of a
 * long issue if all of them are kept. The text layer, which makes the text
 * selectable, searchable with the browser's find, and readable by a screen
 * reader, comes and goes with the canvas. Links in the PDF stay clickable and
 * open in a new tab, so following one never loses the reader's place.
 *
 * Download sits in the toolbar and in the failure state, the same link the
 * archive card used to carry, so the file is always one click away.
 */
export function PdfViewer({ url, downloadName, onPageCount }: PdfViewerProps) {
  /** Each page's size in PDF points, known once the document has loaded. */
  const [sizes, setSizes] = useState<Size[] | null>(null);
  const [failed, setFailed] = useState(false);
  /** Bumped by "Try again" to mount a fresh Document. */
  const [attempt, setAttempt] = useState(0);
  /** Width available to a page, in CSS pixels. Zero until measured. */
  const [paneWidth, setPaneWidth] = useState(0);
  const [zoom, setZoom] = useState<number | 'fit'>('fit');
  const [current, setCurrent] = useState(1);
  const [nearby, setNearby] = useState<ReadonlySet<number>>(() => new Set());
  /** What the reader is typing into the page box, or null when it shows the current page. */
  const [draft, setDraft] = useState<string | null>(null);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  /** Where the reader was before a zoom, so the same spot is still in view after it. */
  const anchor = useRef<{ page: number; offset: number; centre: number } | null>(null);

  const pageCount = sizes?.length ?? 0;
  const widest = sizes ? Math.max(...sizes.map((s) => s.width)) : 0;
  const fitScale = widest && paneWidth ? Math.min(paneWidth / widest, MAX_FIT * ACTUAL_SIZE) : 0;
  const scale = zoom === 'fit' ? fitScale : zoom * ACTUAL_SIZE;
  const level = scale / ACTUAL_SIZE;
  const zoomInTo = ZOOM_STEPS.find((step) => step > level + 0.001);
  const zoomOutTo = [...ZOOM_STEPS].reverse().find((step) => step < level - 0.001);
  const ready = Boolean(sizes && scale);

  /*
    The width a page may take is the pane's, less the column's padding, which
    changes at each breakpoint. Measured rather than assumed so fit to width
    is exact on every screen, and kept current through rotation and resizing.
  */
  useEffect(() => {
    const pane = paneRef.current;
    const column = columnRef.current;
    if (!pane || !column) return;

    const measure = () => {
      const style = getComputedStyle(column);
      setPaneWidth(pane.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pane);
    return () => observer.disconnect();
  }, []);

  /** The bottom edge of the toolbar, which is where the reading area starts. */
  const readingLine = useCallback(() => toolbarRef.current?.getBoundingClientRect().bottom ?? 0, []);

  /** The current page is whichever shows the most of itself below the toolbar. */
  const updateCurrent = useCallback(() => {
    const top = readingLine();
    const bottom = window.innerHeight;
    let best = 0;
    let bestVisible = 0;
    slots.current.forEach((slot, i) => {
      if (!slot) return;
      const rect = slot.getBoundingClientRect();
      const visible = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
      if (visible > bestVisible) {
        best = i + 1;
        bestVisible = visible;
      }
    });
    if (best) setCurrent(best);
  }, [readingLine]);

  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        updateCurrent();
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ready, updateCurrent]);

  /*
    Draw the pages near the viewport, and release the ones that scroll away.
    The page elements persist through zooming, and the observer follows their
    new sizes on its own, so it is set up once per document.
  */
  useEffect(() => {
    if (!ready) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setNearby((previous) => {
          const next = new Set(previous);
          for (const entry of entries) {
            const page = Number((entry.target as HTMLElement).dataset.page);
            if (entry.isIntersecting) next.add(page);
            else next.delete(page);
          }
          return next;
        });
      },
      { rootMargin: RENDER_MARGIN },
    );
    slots.current.forEach((slot) => slot && observer.observe(slot));
    return () => observer.disconnect();
  }, [ready]);

  /*
    Zooming changes the height of every page above the reader, so without
    help the same scroll offset lands somewhere else in the issue. The spot
    under the toolbar, and the horizontal centre once the page is wider than
    the screen, are put back before the browser paints.
  */
  useLayoutEffect(() => {
    const saved = anchor.current;
    anchor.current = null;
    const slot = saved && slots.current[saved.page - 1];
    const pane = paneRef.current;
    if (!saved || !slot || !pane) return;

    const rect = slot.getBoundingClientRect();
    window.scrollBy({ top: rect.top + saved.offset * rect.height - readingLine(), behavior: 'instant' });
    pane.scrollLeft = saved.centre * pane.scrollWidth - pane.clientWidth / 2;
  }, [scale, readingLine]);

  function zoomTo(next: number | 'fit') {
    const slot = slots.current[current - 1];
    const pane = paneRef.current;
    const nextScale = next === 'fit' ? fitScale : next * ACTUAL_SIZE;
    // An anchor for a zoom that changes nothing would be applied by the next unrelated one.
    if (slot && pane && nextScale !== scale) {
      const rect = slot.getBoundingClientRect();
      anchor.current = {
        page: current,
        offset: (readingLine() - rect.top) / rect.height,
        centre: (pane.scrollLeft + pane.clientWidth / 2) / pane.scrollWidth,
      };
    }
    setZoom(next);
  }

  const goTo = useCallback((page: number) => {
    const slot = slots.current[page - 1];
    if (!slot) return;
    slot.scrollIntoView({ block: 'start', behavior: scrollBehavior() });
    setCurrent(page);
  }, []);

  function commitDraft() {
    if (draft === null) return;
    const page = Number.parseInt(draft, 10);
    setDraft(null);
    if (page >= 1 && page <= pageCount) goTo(page);
  }

  async function onLoadSuccess(pdf: PdfDocument) {
    try {
      const pages = await Promise.all(Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)));
      setSizes(
        pages.map((page) => {
          const { width, height } = page.getViewport({ scale: 1 });
          return { width, height };
        }),
      );
      onPageCount?.(pdf.numPages);
    } catch {
      setFailed(true);
    }
  }

  function retry() {
    setFailed(false);
    setSizes(null);
    setNearby(new Set());
    setAttempt((n) => n + 1);
  }

  return (
    <div role="region" aria-label="PDF viewer" className="-mx-4 sm:mx-0">
      <div
        ref={toolbarRef}
        className="sticky top-20 z-10 flex items-center justify-between gap-1 sm:gap-3 h-14 px-2 sm:px-3 bg-offwhite border-y sm:border border-ice-400 sm:rounded-t-2xl"
      >
        <div className="flex items-center gap-0.5 sm:gap-1">
          <ToolButton label="Previous page" icon={ICONS.previous} onClick={() => goTo(current - 1)} disabled={!ready || current <= 1} />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              commitDraft();
            }}
            className="flex items-center gap-1.5 text-sm text-midnight"
          >
            <label htmlFor="pdf-page" className="sr-only">
              Page number
            </label>
            <input
              id="pdf-page"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              enterKeyHint="go"
              disabled={!ready}
              value={draft ?? (ready ? String(current) : '')}
              onFocus={(event) => {
                setDraft(String(current));
                event.target.select();
              }}
              onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
              onBlur={commitDraft}
              className="w-9 h-8 rounded-md border border-ice-400 bg-white text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-midnight disabled:bg-ice-200"
            />
            <span className="text-muted tabular-nums whitespace-nowrap">/ {pageCount || '–'}</span>
          </form>
          <ToolButton label="Next page" icon={ICONS.next} onClick={() => goTo(current + 1)} disabled={!ready || current >= pageCount} />
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <ToolButton label="Zoom out" icon={ICONS.zoomOut} onClick={() => zoomOutTo && zoomTo(zoomOutTo)} disabled={!ready || !zoomOutTo} />
          <span className="hidden sm:block w-12 text-center text-sm font-display font-semibold text-midnight tabular-nums">
            {ready ? `${Math.round(level * 100)}%` : ''}
          </span>
          <ToolButton label="Zoom in" icon={ICONS.zoomIn} onClick={() => zoomInTo && zoomTo(zoomInTo)} disabled={!ready || !zoomInTo} />
          <ToolButton label="Fit to width" icon={ICONS.fit} onClick={() => zoomTo('fit')} disabled={!ready || zoom === 'fit'} />
        </div>

        <a href={url} download={downloadName} title="Download PDF" className={DOWNLOAD_BUTTON}>
          <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.download} />
          </svg>
          <span className="sr-only sm:not-sr-only">Download</span>
          <span className="sr-only"> PDF</span>
        </a>
      </div>

      <div ref={paneRef} className="overflow-x-auto bg-ice-200 border-b border-ice-400 sm:border-x sm:rounded-b-2xl">
        <div ref={columnRef} className="w-max min-w-full px-2 py-4 sm:p-6 lg:p-8">
          {failed ? (
            <div className="max-w-md mx-auto text-center py-10 px-4">
              <svg aria-hidden="true" className="w-12 h-12 mx-auto mb-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3 className="text-xl font-bold text-midnight mb-2">This PDF would not open here</h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Your browser could not display it in the page. You can still download it, or open it in a new tab.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={url} download={downloadName} className={DOWNLOAD_BUTTON}>
                  <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.download} />
                  </svg>
                  Download PDF
                </a>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center h-10 px-4 rounded-lg bg-midnight-700 text-offwhite font-display font-semibold text-sm hover:bg-midnight transition-colors btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ice-200"
                >
                  Open in a new tab
                </a>
              </div>
              <button
                type="button"
                onClick={retry}
                className="mt-5 font-display text-sm font-semibold text-midnight underline decoration-accent decoration-2 underline-offset-4 hover:text-midnight-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight rounded"
              >
                Try again
              </button>
            </div>
          ) : (
            <Document
              key={attempt}
              file={url}
              suspense={false}
              onLoadSuccess={onLoadSuccess}
              onLoadError={() => setFailed(true)}
              onItemClick={({ pageNumber }) => goTo(pageNumber)}
              externalLinkTarget="_blank"
              externalLinkRel="noopener noreferrer"
              loading={<PagePlaceholder />}
              error={null}
              className="flex flex-col gap-4 sm:gap-6"
            >
              {sizes && scale ? (
                sizes.map((size, i) => {
                  const page = i + 1;
                  const width = size.width * scale;
                  const height = size.height * scale;
                  return (
                    <div
                      key={page}
                      ref={(slot) => {
                        slots.current[i] = slot;
                      }}
                      data-page={page}
                      className="relative mx-auto bg-white shadow-md shadow-midnight/15 scroll-mt-[9.5rem]"
                      style={{ width, height }}
                    >
                      {nearby.has(page) && (
                        <Page
                          pageNumber={page}
                          scale={scale}
                          devicePixelRatio={pixelRatio(width, height)}
                          loading={null}
                          error={
                            <p className="px-6 py-16 text-center text-sm text-muted">
                              Page {page} could not be displayed.
                            </p>
                          }
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <PagePlaceholder />
              )}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}
