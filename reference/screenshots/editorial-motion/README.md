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
| 375px | 928 ms | 947 ms | 1,530 ms | 1,779 ms | 36 ms | 60 ms |
| 768px | 930 ms | 959 ms | 1,530 ms | 1,792 ms | 36 ms | 60 ms |
| 1440px | 934 ms | 948 ms | 1,533 ms | 1,781 ms | 32 ms | 64 ms |

[Before timing runs](hero-before.json) · [After timing runs](hero-after.json)
