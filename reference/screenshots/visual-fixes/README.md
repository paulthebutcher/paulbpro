# Visual fixes evidence

Chromium via Playwright. Homepage widths are 1440, 834 and 402, all at a 900px viewport height.

| Capture | Before | After |
| --- | --- | --- |
| Homepage 1440 | [Image](home-before-1440.png) | [Image](home-after-1440.png) |
| Homepage 834 | [Image](home-before-834.png) | [Image](home-after-834.png) |
| Homepage 402 | [Image](home-before-402.png) | [Image](home-after-402.png) |
| Case detail 1440 | [Image](detail-before-1440.png) | [Image](detail-after-1440.png) |
| Work mid-scroll 1440 | [Image](work-before-1440-no-preference.webp) | [Image](work-after-1440-no-preference.webp) |
| Work at 1280, reduced motion | [Image](work-before-1280-reduce.webp) | [Image](work-after-1280-reduce.webp) |
| Work at 834 | [Image](work-before-834-no-preference.webp) | [Image](work-after-834-no-preference.webp) |

Lead uses 50px scroll steps, starting 200px before the section and continuing at least 200px past it. Frames in each sequence are named for the pixel offset from the start and saved every 200px. The final frame shows the separate layout-change probe with Team selected.

| Viewport | Before | After |
| --- | --- | --- |
| 1440 × 900 | [Steps](lead/before/1440x900/steps.json) · [Team frame](lead/before/1440x900/1400.webp) | [Steps](lead/after/1440x900/steps.json) · [Team frame](lead/after/1440x900/1400.webp) |
| 1280 × 800 | [Steps](lead/before/1280x800/steps.json) · [Team frame](lead/before/1280x800/1400.webp) | [Steps](lead/after/1280x800/steps.json) · [Team frame](lead/after/1280x800/1400.webp) |

Each step records the active index, all hidden flags, stage top, pinned class, pin position, and panel fit. The layout-change probe records mutations and animation starts. See [agent notes](../../agent-notes.md) for the diagnosis.

[Contrast before](contrast-before.json) · [Contrast after](contrast-after.json). WCAG relative luminance was calculated from actual foreground colors and 25,600 rendered pixels per surface. Minimum contrast remained 7.61:1 on both surfaces. [Pine tile](swatch-after-pine.png) · [Alabaster tile](swatch-after-alabaster.png).

[Desktop with JavaScript disabled, after](home-after-1440-no-js.png).
