# Editorial and motion review

The Alabaster grain uses white flecks. Pine’s tile is unchanged. Chrome sampled every pixel of one rendered 120px tile against the computed body text color, with grid lines and text outside the sample.

| Alabaster | Before minimum | After minimum | After mean |
| --- | ---: | ---: | ---: |
| [1× before](grain-before-1x.png) · [1× after](grain-after-1x.png) | 7.61:1 | 7.61:1 | 7.74:1 |
| [2× before](grain-before-2x.png) · [2× after](grain-after-2x.png) | 7.61:1 | 7.61:1 | 7.74:1 |

The raw samples report 14,400 pixels at 1× and 57,600 at 2× per surface. [Before measurements](grain-before.json) · [After measurements](grain-after.json)

Chrome measured three unthrottled loads per width at 2×. Times are medians from first paint, except LCP, which is from navigation start. The portrait was the LCP element in every run.

| Width | Headline before | Headline after | Intro before | Intro after | LCP before | LCP after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 375px | 928 ms | 946 ms | 1,530 ms | 1,779 ms | 36 ms | 68 ms |
| 768px | 930 ms | 960 ms | 1,530 ms | 1,793 ms | 36 ms | 52 ms |
| 1440px | 934 ms | 947 ms | 1,533 ms | 1,780 ms | 32 ms | 68 ms |

[Before timing runs](hero-before.json) · [After timing runs](hero-after.json)

The final Chrome captures use a device scale factor of 2. The Work images show the new metadata beneath the card title.

| View | 375px | 768px | 1440px |
| --- | --- | --- | --- |
| Hero mid-intro | [375](hero-mid-375.jpg) | [768](hero-mid-768.jpg) | [1440](hero-mid-1440.jpg) |
| Hero settled | [375](hero-settled-375.jpg) | [768](hero-settled-768.jpg) | [1440](hero-settled-1440.jpg) |
| Work card | [375](work-375.jpg) | [768](work-768.jpg) | [1440](work-1440.jpg) |
| Lead section | [375](lead-375.jpg) | [768](lead-768.jpg) | [1440](lead-1440.jpg) |
| Closing band | [375](closing-375.jpg) | [768](closing-768.jpg) | [1440](closing-1440.jpg) |
| Footer | [375](footer-375.jpg) | [768](footer-768.jpg) | [1440](footer-1440.jpg) |
| Alabaster close-up | [375](alabaster-375.jpg) | [768](alabaster-768.jpg) | [1440](alabaster-1440.jpg) |

Chrome confirmed a whole-heading reveal for Work at 375px and two separate line reveals at 768px and 1440px. The Lead closing letters finished at 580 ms and the note began at 755 ms. The Work heading played once even after scrolling away and back. Keyboard focus finished the hero stats and card text, and the footer retained its visible focus outline. Reduced motion and disabled JavaScript showed the finished text immediately.
