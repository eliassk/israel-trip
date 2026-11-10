import type { ReactNode } from 'react'
import type { PlaceId } from '../data/places'

// Hand-drawn scenes, one per place. They use a fixed illustration palette that reads on both themes.

const Sky = ({ id, stops }: { id: string; stops: string[] }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}
      </linearGradient>
    </defs>
    <rect width="360" height="150" fill={`url(#${id})`} />
  </>
)

const Waves = ({ y, color = '#ffffff', opacity = 0.35 }: { y: number; color?: string; opacity?: number }) => (
  <g className="b-wave" stroke={color} strokeOpacity={opacity} strokeWidth="1.5" fill="none" strokeLinecap="round">
    {[0, 1, 2].map(row => (
      <path key={row} d={Array.from({ length: 12 }, (_, i) => `M${i * 40 - 40 + row * 18},${y + row * 12} q10,-4 20,0`).join(' ')} />
    ))}
  </g>
)

const Palm = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  // Animated groups MUST NOT carry a transform attribute: the CSS animation would replace it.
  <g transform={`translate(${x},${y}) scale(${s})`}><g className="b-sway">
    <path d="M0,0 Q-3,-25 2,-48" stroke="#5a3d22" strokeWidth="4" fill="none" />
    {[-60, -25, 15, 50, 160].map(a => (
      <path key={a} d="M2,-48 q14,-8 26,4" stroke="#2f7a3b" strokeWidth="5" fill="none" strokeLinecap="round" transform={`rotate(${a} 2 -48)`} />
    ))}
  </g></g>
)

const Birds = ({ x, y }: { x: number; y: number }) => (
  <g className="b-drift" stroke="#2b2b38" strokeWidth="1.5" fill="none" opacity=".6">
    <path d={`M${x},${y} q4,-4 8,0 q4,-4 8,0`} />
    <path d={`M${x + 22},${y - 8} q3,-3 6,0 q3,-3 6,0`} />
  </g>
)

const SCENES: Record<PlaceId, ReactNode> = {
  jaffa: (
    <>
      <Sky id="g-jaffa" stops={['#5b4b8a', '#f47c5a', '#ffc477']} />
      <circle cx="170" cy="104" r="26" fill="#ffe2a0" className="b-sun" />
      <g fill="#3b3155" opacity=".75">
        <rect x="12" y="62" width="14" height="45" /><rect x="30" y="48" width="12" height="59" /><rect x="46" y="70" width="18" height="37" />
        <rect x="68" y="56" width="10" height="51" /><rect x="82" y="76" width="22" height="31" />
      </g>
      <path d="M215,106 Q255,62 360,70 L360,106Z" fill="#4a3550" />
      <rect x="296" y="46" width="11" height="26" fill="#4a3550" /><path d="M296,46 L301.5,36 L307,46Z" fill="#4a3550" />
      <rect x="250" y="62" width="16" height="22" fill="#4a3550" /><path d="M250,62 L258,46 L266,62Z" fill="#4a3550" />
      <rect y="105" width="360" height="45" fill="#2e5f8a" />
      <Waves y={118} />
      <g className="b-drift-slow"><path d="M120,112 h26 l-4,6 h-18z" fill="#2b2238" /><path d="M132,112 v-16 l10,14z" fill="#f6e6c8" /></g>
    </>
  ),
  megiddo: (
    <>
      <Sky id="g-megiddo" stops={['#9fd2ec', '#fff3d6']} />
      <circle cx="310" cy="32" r="14" fill="#fff6c9" />
      <path d="M0,110 Q90,80 180,100 T360,92 L360,150 L0,150Z" fill="#c9b98f" />
      <path d="M40,150 L82,74 L278,74 L320,150Z" fill="#a87f4a" />
      <path d="M58,118 L302,118 L311,134 L49,134Z" fill="#b88f58" />
      <path d="M71,94 L289,94 L296,106 L64,106Z" fill="#c8a46e" />
      <path d="M150,74 v-14 a12,12 0 0 1 24,0 v14z" fill="#6b4c2b" />
      <path d="M0,150 L0,140 Q180,128 360,140 L360,150Z" fill="#7d9a52" />
      <g transform="translate(330,138)"><rect x="-2" y="-22" width="4" height="22" fill="#5a3d22" /><ellipse cx="0" cy="-26" rx="18" ry="7" fill="#5f8a3a" /></g>
      <Birds x={60} y={34} />
    </>
  ),
  sachne: (
    <>
      <Sky id="g-sachne" stops={['#8fd8f5', '#e8f8ff']} />
      <path d="M0,90 Q80,40 170,70 Q240,48 360,78 L360,150 L0,150Z" fill="#8fae7a" />
      <rect y="96" width="360" height="54" fill="#6fae5a" />
      <ellipse cx="110" cy="112" rx="80" ry="12" fill="#3fc1c9" />
      <ellipse cx="220" cy="132" rx="110" ry="14" fill="#2fb0bd" />
      <g className="b-shimmer" fill="#e6fbff">
        <rect x="170" y="112" width="18" height="18" rx="3" opacity=".8" />
        <ellipse cx="110" cy="110" rx="30" ry="2" opacity=".6" /><ellipse cx="230" cy="130" rx="40" ry="2" opacity=".6" />
      </g>
      <Palm x={30} y={110} /><Palm x={330} y={120} s={1.2} />
    </>
  ),
  galilee: (
    <>
      <Sky id="g-galilee" stops={['#8cc8ea', '#f5efd8']} />
      <g className="b-rays" stroke="#fff3c4" strokeWidth="3" opacity=".6">
        {[0, 30, 60, 90, 120, 150].map(a => <line key={a} x1="70" y1="30" x2={70 + Math.cos((a * Math.PI) / 180) * 40} y2={30 + Math.sin((a * Math.PI) / 180) * 40} />)}
      </g>
      <circle cx="70" cy="30" r="14" fill="#fff3c4" />
      <path d="M0,86 Q60,60 130,80 Q200,58 260,76 Q320,62 360,72 L360,150 L0,150Z" fill="#9fb59a" />
      <path d="M0,92 Q180,84 360,92 L360,150 L0,150Z" fill="#3f8fbf" />
      <Waves y={108} />
      <g className="b-drift"><path d="M170,112 h40 l-6,9 h-28z" fill="#6b4226" /><path d="M188,111 v-28 l18,26z" fill="#f4ead2" /></g>
      <path d="M0,150 Q60,132 120,150Z" fill="#7a9a5a" />
    </>
  ),
  golan: (
    <>
      <Sky id="g-golan" stops={['#7db6e0', '#dcecf6']} />
      <path d="M170,78 L250,18 L340,78Z" fill="#a7b2bf" />
      <path d="M232,32 L250,18 L270,34 L258,30 L250,38 L242,30Z" fill="#ffffff" />
      {/* Israeli side: patchwork of orchards and fields */}
      <path d="M0,78 L196,78 L176,150 L0,150Z" fill="#7fae4e" />
      {[[0, 80, 60, 18, '#6c9e3e'], [64, 80, 70, 14, '#9cc25a'], [138, 80, 52, 20, '#5f8f36'], [0, 102, 80, 22, '#a9c86a'], [84, 98, 60, 26, '#6c9e3e'], [148, 102, 40, 24, '#8fb855'], [0, 128, 90, 22, '#5f8f36'], [94, 128, 86, 22, '#9cc25a']].map(([x, y, w, h, c], i) => (
        <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} />
      ))}
      {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={8 + (i % 6) * 10} cy={86 + Math.floor(i / 6) * 5} r="2.2" fill="#3f6e25" />)}
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={90 + i * 10} y1="100" x2={90 + i * 10} y2="122" stroke="#4d7a2c" strokeWidth="1.5" />)}
      {/* Syrian side: dry, empty plain */}
      <path d="M196,78 L360,78 L360,150 L176,150Z" fill="#cdb98a" />
      <path d="M220,110 Q270,104 330,112" stroke="#b9a473" strokeWidth="2" fill="none" />
      <path d="M200,132 Q260,126 350,134" stroke="#b9a473" strokeWidth="2" fill="none" />
      <path d="M196,78 L176,150" stroke="#f4efe2" strokeWidth="1.5" strokeDasharray="4 3" />
      <g transform="translate(40,62)">
        <rect x="-1.5" y="0" width="3" height="20" fill="#f2f2f2" />
        <g className="b-spin">{[0, 120, 240].map(a => <rect key={a} x="-1.5" y="-14" width="3" height="14" rx="1.5" fill="#ffffff" transform={`rotate(${a})`} />)}</g>
      </g>
      <g transform="translate(100,64)">
        <rect x="-1.5" y="0" width="3" height="18" fill="#f2f2f2" />
        <g className="b-spin" style={{ animationDuration: '4s' }}>{[0, 120, 240].map(a => <rect key={a} x="-1.5" y="-12" width="3" height="12" rx="1.5" fill="#ffffff" transform={`rotate(${a})`} />)}</g>
      </g>
      <text x="20" y="146" fontSize="9" fontWeight="700" fill="#ffffff" opacity=".85">IZRAEL</text>
      <text x="300" y="146" fontSize="9" fontWeight="700" fill="#6b5a35" opacity=".85">SYRIA</text>
    </>
  ),
  caliber: (
    <>
      <Sky id="g-caliber" stops={['#9cc9e6', '#f4e9cf']} />
      <path d="M0,80 Q90,50 180,70 T360,60 L360,150 L0,150Z" fill="#c7b37f" />
      {[0, 1, 2].map(i => <path key={i} d={`M0,${84 + i * 8} Q90,${56 + i * 8} 180,${76 + i * 8} T360,${66 + i * 8}`} stroke="#ad9864" strokeWidth="1.2" fill="none" opacity=".7" />)}
      <rect y="112" width="360" height="38" fill="#d9c89a" />
      {/* Range: sandbag wall, targets, tower with flag */}
      {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={20 + i * 16} cy="124" rx="9" ry="5" fill="#b59a62" stroke="#8e7646" strokeWidth=".8" />)}
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={28 + i * 16} cy="116" rx="9" ry="5" fill="#c4a96f" stroke="#8e7646" strokeWidth=".8" />)}
      {[200, 245, 290].map((x, i) => (
        <g key={x} transform={`translate(${x},${96 + i * 2})`}>
          <rect x="-1" y="0" width="2" height="18" fill="#5a4a33" />
          <circle cy="-4" r="11" fill="#fdf6ea" /><circle cy="-4" r="7.5" fill="#c8553d" /><circle cy="-4" r="4" fill="#fdf6ea" /><circle cy="-4" r="1.6" fill="#c8553d" />
        </g>
      ))}
      <g transform="translate(330,50)">
        <rect x="-2" y="0" width="4" height="62" fill="#5a4a33" />
        <rect x="-10" y="-10" width="20" height="12" fill="#6b5a3f" />
        <rect x="1" y="-34" width="1.5" height="24" fill="#3e3220" />
        <g className="b-flag">
          <rect x="2.5" y="-34" width="20" height="14" fill="#ffffff" stroke="#d9d9d9" strokeWidth=".5" />
          <rect x="2.5" y="-32" width="20" height="2" fill="#1b5fbf" /><rect x="2.5" y="-24" width="20" height="2" fill="#1b5fbf" />
          <path d="M12.5,-30.5 l2.6,4.5 h-5.2z M12.5,-23.5 l2.6,-4.5 h-5.2z" fill="none" stroke="#1b5fbf" strokeWidth=".8" />
        </g>
      </g>
      <Birds x={110} y={30} />
    </>
  ),
  jerusalem: (
    <>
      <Sky id="g-jerusalem" stops={['#f7c873', '#ffe7b0']} />
      <path d="M0,86 Q120,60 240,78 T360,70 L360,150 L0,150Z" fill="#e3c27e" opacity=".7" />
      <rect x="150" y="66" width="60" height="28" fill="#2f6fa8" />
      <path d="M156,66 a24,24 0 0 1 48,0z" fill="#f2c14e" className="b-glow" />
      <rect x="179" y="34" width="2" height="8" fill="#f2c14e" />
      <rect x="40" y="46" width="22" height="50" fill="#c9a76a" /><path d="M40,46 a11,11 0 0 1 22,0z" fill="#c9a76a" />
      <rect y="94" width="360" height="56" fill="#d9c08a" />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={i * 12 + 2} y="88" width="7" height="7" fill="#d9c08a" />)}
      <path d="M160,150 v-30 a20,20 0 0 1 40,0 v30z" fill="#7a5c34" />
      {[0, 1, 2, 3, 4].map(i => <line key={i} x1="0" x2="360" y1={108 + i * 9} y2={108 + i * 9} stroke="#c4a873" strokeWidth="1" />)}
      <Birds x={260} y={36} />
    </>
  ),
  olives: (
    <>
      <Sky id="g-olives" stops={['#f6b77c', '#ffe3b3']} />
      <path d="M0,78 Q180,64 360,76 L360,104 L0,104Z" fill="#d8b979" />
      <rect x="40" y="70" width="280" height="12" fill="#c9a86a" />
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={42 + i * 11.6} y="66" width="6" height="5" fill="#c9a86a" />)}
      <rect x="160" y="56" width="40" height="15" fill="#2f6fa8" />
      <path d="M163,56 a17,17 0 0 1 34,0z" fill="#f2c14e" className="b-glow" />
      <path d="M0,104 Q90,92 180,108 T360,100 L360,150 L0,150Z" fill="#b9a46f" />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={150 + (i % 11) * 18} y={112 + Math.floor(i / 11) * 12 + (i % 3)} width="9" height="5" fill="#efe6d0" />)}
      {[[40, 150, 1.2], [110, 152, 0.9], [330, 152, 1.1]].map(([x, y, k]) => (
        <g key={x} transform={`translate(${x},${y}) scale(${k})`}><g className="b-sway">
          <path d="M-6,0 C-8,-14 4,-18 -2,-30 M4,0 C6,-12 -2,-20 6,-30" stroke="#6b5136" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="-14" cy="-38" rx="18" ry="11" fill="#8fa37a" /><ellipse cx="10" cy="-42" rx="20" ry="12" fill="#a3b58e" /><ellipse cx="0" cy="-30" rx="16" ry="8" fill="#7d9468" />
        </g></g>
      ))}
    </>
  ),
  bethesda: (
    <>
      <Sky id="g-bethesda" stops={['#a7d3ec', '#f5ecd8']} />
      <rect y="40" width="360" height="56" fill="#d6c095" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${8 + i * 40},96 v-30 a16,16 0 0 1 32,0 v30z`} fill="#8f7a52" />)}
      <rect y="94" width="360" height="56" fill="#cdb98a" />
      <rect x="18" y="104" width="150" height="40" rx="3" fill="#3d8f9e" />
      <rect x="192" y="104" width="150" height="40" rx="3" fill="#3d8f9e" />
      {[0, 1, 2, 3].map(i => <rect key={i} x={18 + i * 8} y={104 + i * 8} width="6" height={40 - i * 8} fill="#b8a479" />)}
      {[[90, 124], [270, 124]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="24" ry="5" fill="none" stroke="#e6fbff" strokeWidth="1.5" className="b-shimmer" />)}
      {[176, 178, 182].map((x, i) => <rect key={i} x={x - 2} y={92 + i * 6} width="5" height={24 - i * 6} fill="#e3d2a6" />)}
    </>
  ),
  temple: (
    <>
      <Sky id="g-temple" stops={['#7fbbe6', '#e8f2f8']} />
      <path d="M150,30 a30,30 0 0 1 60,0z" fill="#f2c14e" className="b-glow" />
      {Array.from({ length: 5 }, (_, row) => Array.from({ length: 6 }, (_, c) => {
        const w = 70
        const x = c * w - (row % 2) * 35
        return <rect key={`${row}-${c}`} x={x + 2} y={34 + row * 22} width={w - 4} height="20" rx="2" fill={row < 2 ? '#d9c99f' : '#e3d4ab'} stroke="#c6b48a" strokeWidth="2" />
      }))}
      {[[40, 62], [210, 84], [300, 44], [120, 106]].map(([x, y]) => <path key={x} d={`M${x},${y} q-6,-8 -2,-14 M${x},${y} q2,-10 8,-12 M${x},${y} q6,-6 12,-4`} stroke="#6f8d4a" strokeWidth="2.5" fill="none" />)}
      <g className="b-drift"><path d="M250,24 q5,-5 10,0 q5,-5 10,0" stroke="#fff" strokeWidth="2" fill="none" /></g>
      <rect y="142" width="360" height="8" fill="#efe6d0" />
      {[60, 74, 92, 260, 276, 300].map((x, i) => <g key={x} fill="#2b2b38" opacity=".8"><circle cx={x} cy={130} r="4" /><rect x={x - 4} y={133} width="8" height={14 - (i % 2) * 2} rx="3" /></g>)}
    </>
  ),
  market: (
    <>
      <rect width="360" height="150" fill="#3b2a4a" />
      <rect width="360" height="26" fill="#1f1528" />
      <path d={Array.from({ length: 9 }, (_, i) => `M${i * 45},26 q22,14 45,0`).join(' ')} stroke="#5a4a3a" strokeWidth="1" fill="none" />
      {Array.from({ length: 18 }, (_, i) => (
        <circle key={i} cx={10 + i * 20} cy={30 + Math.sin(i) * 3} r="3" fill={['#ffd23f', '#ef8a4f', '#7bd389', '#ff6b9a'][i % 4]} className="b-twinkle" style={{ animationDelay: `${(i % 6) * 0.25}s` }} />
      ))}
      <rect y="104" width="360" height="46" fill="#6b4a2e" />
      <rect y="100" width="360" height="6" fill="#8a6440" />
      {[['#c8402e', 30], ['#e8a417', 78], ['#d96b1f', 126], ['#6f8d2e', 174], ['#a0522d', 222]].map(([c, x]) => (
        <path key={x as number} d={`M${x as number},102 l20,-30 l20,30z`} fill={c as string} />
      ))}
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={278 + (i % 5) * 14} cy={i < 5 ? 94 : 82} r="7" fill={i % 2 ? '#c41e3a' : '#e8a417'} />)}
      {[50, 180, 310].map(x => <g key={x}><line x1={x} y1="26" x2={x} y2="46" stroke="#1f1528" /><path d={`M${x - 8},46 h16 l-3,8 h-10z`} fill="#ffcf6b" className="b-glow" /></g>)}
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={20 + i * 48} y="118" width="36" height="22" rx="2" fill="#8a6440" stroke="#5a3e24" />)}
    </>
  ),
  desert: (
    <>
      <Sky id="g-desert" stops={['#0b1430', '#2a2350']} />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 97) % 360} cy={(i * 53) % 90} r={i % 5 ? 1 : 1.6} fill="#fff" className="b-twinkle" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      <path d="M300,26 a14,14 0 1 0 10,24 a11,11 0 1 1 -10,-24z" fill="#f4ecc2" />
      <path d="M0,104 Q90,74 180,100 T360,92 L360,150 L0,150Z" fill="#3a2d40" />
      <path d="M0,126 Q120,108 240,124 T360,120 L360,150 L0,150Z" fill="#4d3a4a" />
      <path d="M70,124 L110,92 L150,124Z" fill="#1d1622" /><path d="M104,124 L110,104 L116,124Z" fill="#e88a3c" opacity=".6" />
      <g transform="translate(200,128)">
        <path d="M-10,0 h20" stroke="#5a3d22" strokeWidth="3" />
        <path className="b-flicker" d="M0,-2 C-8,-8 -4,-16 0,-24 C4,-16 8,-8 0,-2z" fill="#ffb347" />
        <path className="b-flicker" d="M0,-2 C-4,-6 -2,-10 0,-14 C2,-10 4,-6 0,-2z" fill="#ffe08a" style={{ animationDelay: '.2s' }} />
      </g>
    </>
  ),
  masada: (
    <>
      <Sky id="g-masada" stops={['#3d4f86', '#f7a072', '#ffd59a']} />
      <circle cx="290" cy="92" r="22" fill="#fff0c2" className="b-rise" />
      <path d="M200,96 Q280,80 360,92 L360,150 L200,150Z" fill="#c99a8a" opacity=".6" />
      <path d="M40,150 L96,72 L240,66 L292,150Z" fill="#8a5a3c" />
      <path d="M96,72 L240,66 L236,74 L100,79Z" fill="#a46e4a" />
      <path d="M120,148 L150,130 L118,116 L160,102 L130,90 L165,80" stroke="#e3c08f" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
      <path d="M240,70 L340,140" stroke="#2b2238" strokeWidth="1" />
      <rect x="282" y="106" width="8" height="6" fill="#d94f3b" className="b-cable" />
      <rect y="140" width="360" height="10" fill="#8fd3d0" />
    </>
  ),
  deadsea: (
    <>
      <Sky id="g-deadsea" stops={['#cfe6ee', '#fbefe0']} />
      <path d="M0,82 Q90,56 180,72 T360,64 L360,100 L0,100Z" fill="#c99a8a" />
      <rect y="96" width="360" height="54" fill="#8fd3d0" />
      <Waves y={112} opacity={0.5} />
      {[[30, 140, 24], [80, 146, 14], [300, 142, 30], [340, 146, 16]].map(([x, y, r]) => <ellipse key={x} cx={x} cy={y} rx={r} ry={r / 2.4} fill="#ffffff" />)}
      <g transform="translate(180,112)"><g className="b-bob">
        <ellipse cx="0" cy="0" rx="22" ry="5" fill="#f0b48c" />
        <circle cx="-24" cy="-2" r="6" fill="#f0b48c" />
        <rect x="-10" y="-16" width="20" height="13" fill="#fafafa" stroke="#999" strokeWidth=".8" transform="rotate(-12)" />
      </g></g>
    </>
  ),
  shefayim: (
    <>
      <Sky id="g-shefayim" stops={['#284a7a', '#e98b6c', '#ffd29a']} />
      <rect y="92" width="360" height="58" fill="#2e5f8a" />
      <Waves y={104} />
      <path d="M0,150 L0,118 Q180,106 360,118 L360,150Z" fill="#e9d6a8" />
      {[200, 240, 280].map(x => <g key={x}><rect x={x} y="104" width="28" height="18" fill="#f3eadb" /><path d={`M${x - 3},104 L${x + 14},94 L${x + 31},104Z`} fill="#c8553d" /></g>)}
      <path d="M40,124 L100,84 L160,124Z" fill="#fdf6ea" /><path d="M100,84 v-8" stroke="#fdf6ea" strokeWidth="2" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={52 + i * 12} cy={108 - Math.abs(4 - i) * -2} r="2.2" fill={['#ffd23f', '#ef8a4f', '#7bd389'][i % 3]} className="b-twinkle" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
      {['♪', '♫', '♪'].map((n, i) => <text key={i} x={80 + i * 22} y="78" fill="#fff" fontSize="14" className="b-note" style={{ animationDelay: `${i * 0.8}s` }}>{n}</text>)}
      <Palm x={330} y={126} s={0.9} />
    </>
  ),
}

export function PlaceBanner({ id, name }: { id: PlaceId; name: string }) {
  return (
    <div className="banner" role="img" aria-label={`Ilustracja: ${name}`}>
      <svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{SCENES[id]}</svg>
    </div>
  )
}
