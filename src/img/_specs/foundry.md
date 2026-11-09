# Foundry

Canvas 322×322, Alabaster. Shared parts use 0.625 scale with 1.5 px non-scaling strokes.

- A loose pile of four notes sits at (48,48),(64,64),(88,40),(96,88). Messy input is visibly separate from the ordered stages.
- Seven shared nodes in a row at y 200 and x 40,80,120,160,200,240,280 represent the seven pipeline stages. Join adjacent nodes with short neutral lanes.
- Small concentric radius 12 and 20 guides surround the stages. Dotted baselines and registration marks align the row.
- A dashed 48×40 box at (144,232), containing a small note at (156,244), connects below the fourth stage and represents frozen tests.
- A separate next-step node at (200,112), with radius 16 and 32 guides, sits away from the row. It has no product outline or build symbol, so the next step need not be software.
- Decision path: from the input note center (75.5,71.5), down to(75.5,112), across to(64,112), then down to(64,160), across to(80,160), into the second node at(80,200), then via(104,200),(104,112) to an arrow at(192,112), just before the next-step node. One 2 px static accent path.

Alt: Loose notes feed seven pipeline stages beside frozen tests, with the highlighted route passing through the distiller to a separate next step.
