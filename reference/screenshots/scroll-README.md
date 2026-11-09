# Work and Lead scroll verification

The sequences start 200px above each section. Playwright logged positions every
100px and took a screenshot every 300px. Each folder has a `positions.json`
log. Desktop Work folders also contain `release.jpg`, with an amber guide on
the common top edge of the heading and last image at the release frame.

| Viewport | Work | Lead |
| --- | --- | --- |
| 1440×900 | [Work](scroll-work-1440/) | [Lead](scroll-lead-1440/) |
| 1280×800 | [Work](scroll-work-1280/) | [Lead](scroll-lead-1280/) |
| 390×844 | [Work](scroll-work-390/) | [Lead](scroll-lead-390/) |
| 1440×900 reduced motion | [Work](scroll-work-1440-reduced/) | [Lead](scroll-lead-1440-reduced/) |
| 1440×900 Firefox with scroll timelines disabled | [Work](scroll-work-1440-firefox/) | [Lead](scroll-lead-1440-firefox/) |

[Person at the 1512px Figma width](lead-person-desktop.jpg)

Reproduce with `npm run build:preview` and `node scripts/scroll-qa.mjs`.
For Firefox, install the Playwright build and add `--firefox`. The script
turns off CSS scroll timelines to exercise the fallback on newer versions.
