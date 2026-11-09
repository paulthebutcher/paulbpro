# Drawing parts

Status: revised technical drawing kit, awaiting Paul's approval of the second Lead contact sheet.

All fourteen drawings use these five parts. The SVG snippets below are the source
used by `scripts/drawings.mjs`, expanded inline without symbols, ids or references.
Structure inherits `stroke="currentColor"`, width 1.5, round caps and joins.
Blank notes use `var(--placeholder)`; all other fills are `none`.

Positions follow an 8px rhythm. Small drawings place the same parts in a
`translate(x y) scale(0.625)` group. This is approximately 0.6 scale, with
`vector-effect="non-scaling-stroke"` keeping the rendered line at 1.5px.
Coordinates in the source geometry are whole or half pixels. No new miniature
versions of these parts are drawn.

## note

A 36 by 24 blank note, radius 2. Also represents a product or specialty tag.

```svg
<rect width="36" height="24" rx="2" fill="var(--placeholder)" vector-effect="non-scaling-stroke"/>
```

## node

A circle of radius 6 centered at the local origin. A person or pipeline stage.

```svg
<circle cx="0" cy="0" r="6" vector-effect="non-scaling-stroke"/>
```

## lane

A 64px horizontal segment. Longer lanes join or extend the same straight line.

```svg
<path d="M0 0H64" vector-effect="non-scaling-stroke"/>
```

## document

A 48 by 64 sheet with three ruled lines, inset 8px.

```svg
<rect width="48" height="64" rx="2" vector-effect="non-scaling-stroke"/>
<path d="M8 16H40M8 32H40M8 48H32" vector-effect="non-scaling-stroke"/>
```

## page

An 80 by 64 abstract page outline with a 16px header bar, without interface detail.
Larger page containers extend this outline to fit their map or contents.

```svg
<rect width="80" height="64" rx="2" vector-effect="non-scaling-stroke"/>
<path d="M0 16H80" vector-effect="non-scaling-stroke"/>
```

## Construction marks

Reference: Crosswalk's hero at https://www.crosswalk.cl/en, inspected November 8.
Use its layered technical linework as inspiration: concentric guide rings,
datum lines, short ticks, and registration squares. These are construction
marks around the five semantic parts, not new objects or a copy of its machine.

All marks retain the 1.5px stroke. Hierarchy comes from opacity: 0.14 to0.28
for distant guides, 0.36 to0.55 for nearby rings, 0.72 for connections and0.9
for semantic parts. Rings use whole-pixel radii. At small sizes a main node
still uses the shared radius-6 circle at0.625 scale, surrounded by guide rings.

Everything is static. Paul's follow-up overrides the original hover/focus
path draw-in requirement. Decision paths will be fully visible at rest.

## Connections and accents

Connections use straight lanes or orthogonal elbows, with open arrowheads made
from two 4px or 8px diagonals. No SVG markers or ids. Draw connections before
nodes and stop short of the circle. Coverage gaps use dashed empty outlines,
with a simple tally beside them. These are annotations to the parts, not icons.

Work and build drawings each have exactly one `path.decision`, with
`stroke="var(--accent)"`, width 2 and fill none. A compound path may join several
branches of the same decision. Lead has no decision path and no accent color.
