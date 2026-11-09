// Geometry implements the prose in src/img/_specs. Revise the specs first.
export function workScenes({part, route, layer, ring, register, decision, guides, page, lane}) {
  const deadlock = [
    guides(590, 393, [80, 184, 304, 416, 512]),
    layer(0.24, [88, 160, 232, 304].map(y => lane(40, y, 510))),
    layer(0.18, [[186, 140], [410, 212]].flatMap(([x, y]) => [ring(x, y, 24), ring(x, y, 48)])),
    layer(0.72, [
      '<rect x="392" y="280" width="144" height="64" rx="2" stroke-dasharray="4 6"/>',
      ...[[392, 192], [480, 208]].map(([x, y]) => part('note', x + 8, y)),
    ]),
    layer(0.9, [
      ...[[64,72],[112,88],[160,72],[72,128],[120,144],[168,128],
        [240,88],[288,72],[336,88],[248,144],[296,160],[344,144],
        [392,200],[480,216],[400,296],[440,312],[488,296]].map(([x,y]) => part('note',x,y)),
      route('M156 100L200 68M116 172L160 140M332 116L376 84'),
    ]),
    decision('M32 84H82V112H186V140H224V84H306V120H384V192H410V212H456V228H552M544 220L552 228L544 236'),
  ];
  const featureNotes = [[344,96],[456,96],[344,256],[456,256]];
  const analytics = [
    guides(590, 393, [112, 248, 362, 474]),
    layer(0.18, [ring(248,196,48), ...featureNotes.map(([x,y]) => ring(x+18,y+12,32))]),
    layer(0.36, [ring(248,196,24), route('M362 108H474V268H362Z')]),
    layer(0.72, [route('M152 112H200V196H240M152 264H200V196M256 196H312V108H362M312 108H474')]),
    layer(0.9, [part('page',72,80),part('page',72,232),part('node',248,196),
      ...featureNotes.map(([x,y])=>part('note',x,y)),
      route('M340 92L384 124M340 124L384 92M452 92L496 124M452 124L496 92')]),
    decision('M248 204V268H474M344 256H380V280H344ZM456 256H492V280H456Z'),
  ];
  const sixMillion = [
    guides(590, 393, [64,224,304,464,536]),
    layer(0.18, [ring(464,264,32),route('M304 128H552M304 224H544', 'stroke-dasharray="1 4"')]),
    layer(0.36, [ring(464,264,16)]),
    layer(0.72, [
      `<g stroke-dasharray="4 6">${page(64,104,160,176,32)}<rect x="80" y="160" width="56" height="40" rx="2"/><rect x="152" y="160" width="56" height="40" rx="2"/><rect x="80" y="216" width="128" height="40" rx="2"/></g>`,
      route('M304 96V304H544M296 128H304M296 176H304M296 224H304M296 272H304M352 304V312M400 304V312M448 304V312M496 304V312'),
      route('M304 128H536M312 224L352 232L392 248L432 256L464 264'),
    ]),
    decision('M448 264H464M464 248V280'),
  ];
  const people = [96,216,336,456];
  const uxPractice = [
    guides(590, 393, people),
    layer(0.18, people.map(x=>ring(x,232,48))),
    layer(0.36, people.map(x=>ring(x,232,24))),
    layer(0.72, people.map(x=>route(`M${x} 168V224M${x-8} 304H${x+8}`))),
    layer(0.9, people.flatMap(x=>[part('page',x-40,104),part('node',x,232)])),
    decision('M102 232H210M222 232H330M342 232H450'),
  ];
  const shriners = [
    guides(590, 393, [48,144,240,336,480]),
    layer(0.18, [ring(480,192,72),ring(480,192,56)]),
    layer(0.42, [route('M328 88H376V192M328 152H376M280 216H376V192M280 280H376V192')]),
    layer(0.72, [6,6,5,5].flatMap((count,row)=>Array.from({length:count},(_,col)=>part('page',48+col*48,72+row*64,0.5)))),
    decision('M376 192H440M440 160H520V224H440ZM440 176H520'),
  ];
  return {deadlock, analytics, 'six-million':sixMillion, 'ux-practice':uxPractice, shriners};
}

export function buildScenes({part, route, layer, ring, decision, guides, page}) {
  const small = (name,x,y) => part(name,x,y,0.625);
  const wcag = [
    guides(676,450,[96,184,292,400,584]),
    layer(0.18,[ring(292,312,48)]),
    layer(0.36,[ring(292,312,24)]),
    layer(0.28,[104,160,224,288,352].map(y=>route(`M64 ${y}H568`))),
    layer(0.72,[page(144,56,320,336,32)]),
    layer(0.9,[
      ...[168,232,296].map(x=>part('note',x,112)),
      part('document',168,168,1.5),part('note',304,176),part('note',304,224),
      ...[168,256,344].map(x=>part('note',x,288,2)),
      ...[104,160,352].map(y=>route(`M576 ${y}L582 ${y+6}L592 ${y-6}`)),
      ...[224,288].map(y=>part('node',584,y)),
    ]),
    decision('M112 88H184V124H248H312V188H204V240H292V312M284 304L292 312L300 304'),
  ];
  const stages=[40,80,120,160,200,240,280];
  const foundry=[
    guides(322,322,[40,80,160,240,280]),
    layer(0.18,[...stages.map(x=>ring(x,200,20)),ring(200,112,32)]),
    layer(0.36,[...stages.map(x=>ring(x,200,12)),ring(200,112,16)]),
    layer(0.72,[
      ...stages.slice(0,-1).map(x=>route(`M${x+8} 200H${x+32}`)),
      route('M160 208V232'),
      '<rect x="144" y="232" width="48" height="40" rx="2" stroke-dasharray="4 6"/>',
    ]),
    layer(0.9,[
      ...[[48,48],[64,64],[88,40],[96,88],[156,244]].map(([x,y])=>small('note',x,y)),
      ...stages.map(x=>small('node',x,200)),small('node',200,112),
    ]),
    decision('M75.5 71.5V112H64V160H80V200H104V112H192M188 108L192 112L188 116'),
  ];
  const identity=[
    guides(322,322,[48,136,232]),
    layer(0.18,[ring(136,160,40),ring(136,160,24)]),
    layer(0.36,[ring(136,160,12)]),
    layer(0.9,[
      ...[48,64,80].map(x=>small('node',x,72)),small('note',48,144),
      ...[[40,208],[48,216],[56,224]].map(([x,y])=>small('document',x,y)),
      part('document',184,96,2),small('node',136,160),
    ]),
    decision('M88 72H112V160H264M70.5 151.5H96V160H136M86 240H112V160'),
  ];
  const ideas=[[56,72],[112,56],[168,88],[72,144],[128,136],[184,160],[56,224],[120,248],[176,232]];
  const stopped=[0,1,2,3,5,6];
  const ideaFactory=[
    guides(590,393,[80,184,256,346,410,512]),
    layer(0.18,[ring(410,140,48),ring(410,140,24)]),
    layer(0.36,[route('M256 48V344M240 80H256M240 196H256M240 312H256')]),
    layer(0.42,[
      route('M92 84H240M148 68H224V80H240M204 100H240M108 156H224V176H240M220 172H240M92 236H240'),
      route('M240 76V88M240 96V108M240 168V180M240 228V244M256 244H428'),
    ]),
    layer(0.9,[
      ...ideas.map(([x,y])=>part('note',x,y)),
      ...[[328,128],[392,128],[328,232],[392,232]].map(([x,y])=>part('note',x,y)),
      ...stopped.map(i=>{const [x,y]=ideas[i];return route(`M${x-4} ${y+28}L${x+40} ${y-4}`);}),
    ]),
    decision('M146 148H232V140H448V196H598M572 188L580 196L572 204'),
  ];
  const evidence=[[112,40],[208,24],[304,24],[400,40],[480,104],[496,192],[448,280],[344,320],[232,320],[104,280],[48,176]];
  const growthAudit=[
    layer(0.14,[ring(296,192,64),ring(296,192,104),ring(296,192,160)]),
    guides(590,393,[76,140,260,296,428,524]),
    layer(0.55,[route('M272 160L140 88M288 160L236 72M312 160L332 72M328 160L428 88M336 176L480 128M336 192L496 216M336 208L448 304M312 224L372 320M280 224L260 320M256 208L160 304M256 192L104 200')]),
    layer(0.9,[part('page',256,160),...evidence.flatMap(([x,y])=>[
      `<rect x="${x}" y="${y}" width="56" height="48" rx="2"/>`,part('page',x+8,y+8,0.5),
    ])]),
    decision('M336 176L480 128M480 104H536V152H480Z'),
  ];
  const stressfreeclaims=[
    guides(590,393,[88,192,296,440,512]),
    layer(0.18,[ring(296,192,72),ring(296,192,48)]),
    layer(0.36,[ring(296,192,24)]),
    layer(0.55,[route('M184 128V144H248V192H288')]),
    layer(0.9,[
      ...[[64,104],[96,192],[168,224]].map(([x,y])=>part('document',x,y)),
      part('page',144,64),part('node',200,96),route('M152 120L168 104L184 120H216'),
      part('node',296,192),part('document',392,112,2.5),
    ]),
    decision('M112 136H248V192H488M144 224H248V192M216 256H264V192'),
  ];
  return {
    'wcag-engine':{width:676,height:450,content:wcag},
    foundry:{width:322,height:322,content:foundry},
    'identity-service':{width:322,height:322,content:identity},
    'idea-factory':{width:590,height:393,content:ideaFactory},
    'growth-audit':{width:590,height:393,content:growthAudit},
    stressfreeclaims:{width:590,height:393,content:stressfreeclaims},
  };
}
