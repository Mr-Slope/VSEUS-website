/**
 * Unlike a layout, a template remounts on every navigation, so each page's
 * content eases in as it arrives (see `.page-enter` in globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
