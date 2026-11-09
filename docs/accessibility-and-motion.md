# Accessibility and motion

- Target WCAG 2.2 AA. Use semantic landmarks, a skip link, one h1 per page and ordered headings. Lead levels and principles remain available as h3 and h4.
- Keep all controls keyboard reachable with visible focus and readable names. Targets are at least 24×24 CSS px, with room for focus outlines. Sticky headers reserve clearance for anchors and focus.
- Body and muted text need 4.5:1 against their rendered surfaces. Check reflow at 320px, readability at 200% text zoom, and accessibility of the linked résumé.
- Work and Build keep their sticky section tags. The Lead tag and level headings scroll with their content.
- The motion vocabulary is sticky headings, rules drawing, and text settling. Use CSS scroll timelines only where supported and motion is allowed. Fallbacks show the finished content. Keep grid and grain static while scrolling and leave technical drawings fully drawn. Ease decorative reveals with the fluid token and keep the Work progress indicator proportional to scroll. No scroll interception, snap, or parallax.
- On each homepage load and reload, the CSS sequence starts with the grid and headline, then reveals the portrait, thesis, buttons and stats. Wait for both Diatype weights. Show the finished hero immediately if a font fails or the 1s wait expires. The sequence runs for about 1.5s after fonts are ready and uses only transforms and opacity. Keep focused links and their labels visible throughout. Reduced motion and no JS show the finished state. Check mobile and desktop LCP against the pre-change page.
