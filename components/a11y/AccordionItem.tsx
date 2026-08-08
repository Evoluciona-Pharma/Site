'use client';

import { useId } from 'react';

/** Shared accordion semantics.
 *
 * Two accordions need an identical contract — the FAQ question list
 * (`faq/FaqPage.tsx`) and the product detail sections (`product/ProductPage.tsx`).
 * Both were `<div onClick>`, so neither could be opened without a mouse. This
 * owns the button/`aria-expanded`/`aria-controls` wiring and the panel id; each
 * call site keeps its own look by passing `className` through, so the two screens
 * stay visually independent while their semantics cannot drift apart.
 *
 * The header renders inside a heading element so screen-reader users can jump
 * between sections; `className="contents"` keeps it out of the layout.
 */
export default function AccordionItem({
  open,
  onToggle,
  header,
  headingLevel: Heading = 'h3',
  className,
  headerClassName,
  panelClassName,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  header: React.ReactNode;
  headingLevel?: 'h2' | 'h3' | 'h4';
  className?: string;
  headerClassName?: string;
  panelClassName?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div className={className}>
      <Heading className="contents">
        <button
          type="button"
          id={buttonId}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className={headerClassName}
        >
          {header}
        </button>
      </Heading>
      {/* A region needs an accessible name, or axe flags it — point it at the
          button that names it. */}
      {open && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className={panelClassName}>
          {children}
        </div>
      )}
    </div>
  );
}
