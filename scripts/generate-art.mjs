/**
 * Generates the original, hand-built SVG illustrations used for the demo menu and hero.
 * Run with: npm run art   (output goes to /public/menu and /public)
 * No stock photos or third-party artwork is used - everything is drawn from primitives.
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/menu/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;

const BGS = [
  ['#FCE6BD', '#F8CF94'], ['#F9D3B4', '#F2B48C'], ['#FBEBC8', '#F4D58B'],
  ['#F6D9C9', '#EDB59E'], ['#F1E4B9', '#DDCB86'], ['#F8D8A8', '#EFB36A'],
];

function frame(inner, { bg = 0, zoom = 1, rotate = 0, seed = 1 } = {}) {
  const r = rng(seed * 97 + 5);
  const [c1, c2] = BGS[bg % BGS.length];
  const W = 800, H = 600;
  const vw = W / zoom, vh = H / zoom;
  const vx = (W - vw) / 2, vy = (H - vh) / 2;
  let deco = '';
  for (let i = 0; i < 6; i++) {
    deco += `<circle cx="${f(r() * W)}" cy="${f(r() * H)}" r="${f(40 + r() * 110)}" fill="#fff" opacity="${f(0.07 + r() * 0.08)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(vx)} ${f(vy)} ${f(vw)} ${f(vh)}" width="800" height="600" role="img">
<defs><radialGradient id="bg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>
<rect x="-200" y="-200" width="1200" height="1000" fill="url(#bg)"/>${deco}
<g transform="rotate(${rotate} 400 300)">${inner}</g></svg>`;
}

// ---------- toppings ----------
const T = {
  pepperoni: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><circle r="25" fill="#B3281B" stroke="#861a10" stroke-width="2.5"/><circle r="19" fill="#C93A25" opacity=".8"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${f(Math.cos(i * 1.7) * 11)}" cy="${f(Math.sin(i * 1.7) * 11)}" r="3" fill="#861a10"/>`).join('')}</g>`,
  salami: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><circle r="22" fill="#9A3A2D" stroke="#6e241a" stroke-width="2.5"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${f(Math.cos(i * 1.1) * 11)}" cy="${f(Math.sin(i * 1.1) * 11)}" r="2.6" fill="#F3D9C8"/>`).join('')}</g>`,
  basil: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-22 0 C-12 -17 12 -17 22 0 C12 17 -12 17 -22 0Z" fill="#2F7D3A" stroke="#1f5a29" stroke-width="2"/><path d="M-20 0 L20 0" stroke="#7cc489" stroke-width="2"/></g>`,
  spinach: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(1.2)"><path d="M-20 2 C-16 -16 14 -16 20 0 C14 14 -14 14 -20 2Z" fill="#2C6B33"/><path d="M-18 2 L18 0" stroke="#6fb97a" stroke-width="1.6"/></g>`,
  olive: (x, y) => `<g transform="translate(${x} ${y})"><circle r="13" fill="#E9DDB5" stroke="#2c2a26" stroke-width="7"/></g>`,
  mushroom: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-22 4 C-22 -20 22 -20 22 4 Z" fill="#E9D6B6" stroke="#B89B70" stroke-width="2.4"/><rect x="-8" y="3" width="16" height="17" rx="5" fill="#F3E6CD" stroke="#B89B70" stroke-width="2.4"/></g>`,
  pepper: (x, y, r, rot, c = '#49A058') =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-22 6 C-14 -20 14 -20 22 6" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M-20 4 C-13 -15 13 -15 20 4" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2.5" stroke-linecap="round"/></g>`,
  yellowpepper: (x, y, r, rot) => T.pepper(x, y, r, rot, '#F2B632'),
  onion: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse rx="19" ry="12" fill="none" stroke="#B863A3" stroke-width="3.5" opacity=".9"/><ellipse rx="11" ry="6" fill="none" stroke="#D9A3CB" stroke-width="2.4" opacity=".9"/></g>`,
  corn: (x, y) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#F5CF2B" stroke="#d6a900" stroke-width="1.5"/>`,
  sausage: (x, y) =>
    `<g transform="translate(${x} ${y})"><circle r="16" fill="#8B4A2B" stroke="#5f2f19" stroke-width="2.4"/><circle cx="-5" cy="-4" r="3" fill="#C27B52"/><circle cx="6" cy="3" r="3.2" fill="#C27B52"/><circle cx="-2" cy="8" r="2.4" fill="#C27B52"/></g>`,
  bacon: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-22" y="-6" width="44" height="12" rx="5" fill="#C95F52"/><path d="M-20 -1 Q-10 -6 0 -1 T20 -1" stroke="#F3C1B7" stroke-width="3" fill="none"/></g>`,
  chicken: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-17 -6 L-3 -14 L15 -8 L17 6 L2 14 L-14 9Z" fill="#E7BE84" stroke="#A6783A" stroke-width="2.4" stroke-linejoin="round"/><path d="M-9 -4 L8 6 M-4 -9 L12 1" stroke="#9a5b25" stroke-width="2.4" opacity=".7"/></g>`,
  paneer: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-13" y="-13" width="26" height="26" rx="5" fill="#FFF1D1" stroke="#EE9A2E" stroke-width="3.4"/><path d="M-6 -4 L6 4" stroke="#D96B1A" stroke-width="2.4"/></g>`,
  tomato: (x, y) =>
    `<g transform="translate(${x} ${y})"><circle r="19" fill="#E24A33" stroke="#aa2e1c" stroke-width="2.4"/><circle r="12" fill="#F27B5E"/>${[0, 1, 2, 3].map((i) => `<ellipse cx="${f(Math.cos(i * 1.57) * 6)}" cy="${f(Math.sin(i * 1.57) * 6)}" rx="2" ry="3.4" fill="#FBD59A"/>`).join('')}</g>`,
  cherrytomato: (x, y) => `<g transform="translate(${x} ${y})"><circle r="11" fill="#E0412D" stroke="#a52a1a" stroke-width="2"/><circle cx="-3" cy="-3" r="3" fill="#fff" opacity=".4"/></g>`,
  prosciutto: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-28 4 C-18 -16 -8 16 2 -4 S22 12 28 -6" fill="none" stroke="#E0877F" stroke-width="12" stroke-linecap="round"/><path d="M-26 2 C-18 -12 -8 12 2 -5 S20 8 26 -7" fill="none" stroke="#F8D1CB" stroke-width="3.6" stroke-linecap="round"/></g>`,
  fig: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-17 4 A17 17 0 0 1 17 4 Z" fill="#E9A3B5"/><path d="M-17 4 A17 17 0 0 1 17 4" fill="none" stroke="#5E2750" stroke-width="5"/><circle cx="-4" cy="0" r="1.8" fill="#fff"/><circle cx="5" cy="-2" r="1.8" fill="#fff"/></g>`,
  burrata: (x, y) =>
    `<g transform="translate(${x} ${y})"><ellipse cx="3" cy="8" rx="60" ry="50" fill="#000" opacity=".12"/><circle r="56" fill="#FFFCF1" stroke="#E6DABF" stroke-width="3"/><path d="M-26 -22 C-10 -40 22 -38 32 -18" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".9"/><circle cx="2" cy="4" r="16" fill="#F7EFD9"/></g>`,
  arugula: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})">${[-12, 0, 12].map((d) => `<path d="M${d - 4} 14 C${d - 14} -4 ${d + 6} -12 ${d + 2} -22" stroke="#3E8E41" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}</g>`,
  chilli: (x, y, r, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-16 6 C-6 -10 8 -10 16 -2" fill="none" stroke="#D41E1E" stroke-width="5.5" stroke-linecap="round"/><circle cx="-16" cy="6" r="2.6" fill="#2F7D3A"/></g>`,
  jalapeno: (x, y) => `<g transform="translate(${x} ${y})"><circle r="12" fill="#D9ECAA" stroke="#5FA23B" stroke-width="5"/>${[0, 1, 2].map((i) => `<circle cx="${f(Math.cos(i * 2.1) * 4)}" cy="${f(Math.sin(i * 2.1) * 4)}" r="1.6" fill="#8BBF54"/>`).join('')}</g>`,
  mozzarella: (x, y) => `<g transform="translate(${x} ${y})"><circle r="26" fill="#FFFDF1" stroke="#F0E5C4" stroke-width="2.5" opacity=".97"/><circle cx="-6" cy="-7" r="7" fill="#fff" opacity=".7"/></g>`,
  blue: (x, y) => `<g transform="translate(${x} ${y})"><circle r="16" fill="#F3F0E4" stroke="#D5D7DC" stroke-width="2"/><circle cx="-4" cy="-3" r="3" fill="#8DA1BE"/><circle cx="5" cy="4" r="2.6" fill="#8DA1BE"/></g>`,
  cilantro: (x, y) => `<g transform="translate(${x} ${y})"><circle cx="0" cy="0" r="3.4" fill="#3E9140"/><circle cx="6" cy="3" r="2.6" fill="#57AD58"/><circle cx="-5" cy="4" r="2.4" fill="#2f7a31"/></g>`,
  bbq: (x, y, r, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-36 0 C-24 -14 -14 14 -2 0 S22 -12 36 2" stroke="#5E230F" stroke-width="5.5" fill="none" stroke-linecap="round" opacity=".85"/></g>`,
  honey: (x, y, r, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-40 0 C-28 -12 -18 12 -6 0 S18 -10 40 2" stroke="#E8A317" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/></g>`,
  truffle: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-9 4 L0 -8 L10 3 L4 9 Z" fill="#2A211C" stroke="#524238" stroke-width="1.5"/></g>`,
  walnut: (x, y, r, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-12 2 C-12 -12 12 -12 12 2 C12 12 -12 12 -12 2Z" fill="#B88A58" stroke="#7d5832" stroke-width="2"/><path d="M0 -10 L0 10" stroke="#7d5832" stroke-width="1.6"/></g>`,
  ricotta: (x, y) => `<g transform="translate(${x} ${y})"><circle r="11" fill="#FFFBF0" stroke="#EBE0C4" stroke-width="2"/></g>`,
};

function scatter(r, count, R, minDist = 40, placed = []) {
  const pts = [];
  let guard = 0;
  while (pts.length < count && guard++ < 600) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R;
    const x = Math.cos(a) * d, y = Math.sin(a) * d;
    if ([...placed, ...pts].every((p) => (p.x - x) ** 2 + (p.y - y) ** 2 > minDist ** 2)) pts.push({ x, y, rot: r() * 360 });
  }
  return pts;
}

function pizza({ cx = 400, cy = 300, R = 245, sauce = '#C8321F', cheese = '#F6D77A', toppings = [], seed = 3, drizzle = null, shadow = true, whiteSauce = false }) {
  const r = rng(seed);
  let s = '';
  if (shadow) s += `<ellipse cx="${cx + 8}" cy="${cy + 16}" rx="${R + 12}" ry="${R + 4}" fill="#5a2d10" opacity=".22"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#E1A456" stroke="#B87430" stroke-width="5"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R - 9}" fill="none" stroke="#F1C27F" stroke-width="5" opacity=".7"/>`;
  for (let i = 0; i < 26; i++) {
    const a = r() * 6.283, d = R - 10 - r() * 14;
    s += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(2 + r() * 4)}" fill="#B87430" opacity=".5"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${R * 0.86}" fill="${whiteSauce ? '#F4E6C4' : sauce}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R * 0.82}" fill="${cheese}" opacity="${whiteSauce ? 0.95 : 0.9}"/>`;
  for (let i = 0; i < 20; i++) {
    const a = r() * 6.283, d = Math.sqrt(r()) * R * 0.78;
    s += `<ellipse cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" rx="${f(10 + r() * 22)}" ry="${f(7 + r() * 14)}" fill="${r() > 0.5 ? '#FFF0B3' : '#E8B94A'}" opacity=".5" transform="rotate(${f(r() * 180)} ${f(cx + Math.cos(a) * d)} ${f(cy + Math.sin(a) * d)})"/>`;
  }
  const placed = [];
  s += `<g transform="translate(${cx} ${cy})">`;
  for (const [type, count, extra] of toppings) {
    const pts = scatter(r, count, R * 0.76, extra?.gap ?? 40, placed);
    placed.push(...pts);
    for (const p of pts) s += T[type](f(p.x), f(p.y), 0, f(p.rot));
  }
  s += '</g>';
  if (drizzle) s += `<g transform="translate(${cx} ${cy})">${scatter(r, 5, R * 0.55, 60).map((p) => T[drizzle](f(p.x), f(p.y), 0, f(p.rot))).join('')}</g>`;
  // slice cuts
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 4 + 0.2;
    s += `<line x1="${f(cx - Math.cos(a) * R * 0.98)}" y1="${f(cy - Math.sin(a) * R * 0.98)}" x2="${f(cx + Math.cos(a) * R * 0.98)}" y2="${f(cy + Math.sin(a) * R * 0.98)}" stroke="#7a4310" stroke-opacity=".28" stroke-width="3"/>`;
  }
  return s;
}

// ---------- non-pizza items ----------
const board = (w = 520, h = 330) => `<ellipse cx="408" cy="${300 + h / 2 - 10}" rx="${w / 2 + 30}" ry="22" fill="#5a2d10" opacity=".2"/><rect x="${400 - w / 2}" y="${300 - h / 2}" width="${w}" height="${h}" rx="40" fill="#C58B52" stroke="#8d5b2d" stroke-width="5"/>`;

const garlicbread = (seed) => {
  const r = rng(seed);
  let s = board();
  for (const [dy, rot] of [[-62, -4], [58, 3]]) {
    s += `<g transform="translate(400 ${300 + dy}) rotate(${rot})"><rect x="-205" y="-52" width="410" height="104" rx="52" fill="#E3A95B" stroke="#B87430" stroke-width="5"/><rect x="-190" y="-40" width="380" height="80" rx="40" fill="#F7DE8A"/>`;
    for (let i = 0; i < 16; i++) s += `<ellipse cx="${f(-170 + r() * 340)}" cy="${f(-30 + r() * 60)}" rx="${f(8 + r() * 14)}" ry="${f(6 + r() * 8)}" fill="${r() > 0.5 ? '#EDBD4E' : '#FFF3BC'}" opacity=".8"/>`;
    for (let i = 0; i < 26; i++) s += `<circle cx="${f(-180 + r() * 360)}" cy="${f(-34 + r() * 68)}" r="${f(2 + r() * 2.6)}" fill="#2F7D3A"/>`;
    for (let i = -3; i <= 3; i++) s += `<line x1="${i * 52}" y1="-48" x2="${i * 52}" y2="48" stroke="#9a5f22" stroke-opacity=".35" stroke-width="3"/>`;
    s += '</g>';
  }
  return s;
};

const wings = (seed) => {
  const r = rng(seed);
  let s = `<ellipse cx="408" cy="330" rx="262" ry="228" fill="#5a2d10" opacity=".18"/><circle cx="400" cy="300" r="250" fill="#FFF9EE" stroke="#E4D6BA" stroke-width="6"/><circle cx="400" cy="300" r="208" fill="none" stroke="#EADFC6" stroke-width="3"/>`;
  const spots = [[320, 230, -30], [440, 215, 20], [250, 330, 60], [380, 345, -10], [490, 330, 40]];
  for (const [x, y, rot] of spots) {
    s += `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="22" y="-9" width="40" height="18" rx="9" fill="#F4E7D0" stroke="#d4bf97" stroke-width="2.4"/><circle cx="64" cy="-8" r="8" fill="#F4E7D0" stroke="#d4bf97" stroke-width="2.4"/><circle cx="64" cy="8" r="8" fill="#F4E7D0" stroke="#d4bf97" stroke-width="2.4"/><path d="M-52 4 C-52 -42 26 -40 28 -2 C28 38 -48 46 -52 4Z" fill="#C4601E" stroke="#8c3f10" stroke-width="3.4"/><path d="M-36 -8 C-28 -26 4 -26 12 -12" stroke="#EE9548" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>${[0, 1, 2, 3, 4].map(() => `<circle cx="${f(-38 + r() * 56)}" cy="${f(-14 + r() * 34)}" r="${f(1.6 + r() * 2)}" fill="#7a3510" opacity=".6"/>`).join('')}</g>`;
  }
  s += `<g transform="translate(400 300)"><circle cx="-6" cy="-6" r="0" fill="none"/></g><circle cx="590" cy="150" r="42" fill="#FFFBEA" stroke="#d9c9a0" stroke-width="5"/><circle cx="590" cy="150" r="30" fill="#FFF3C9"/>`;
  s += [0, 1, 2].map((i) => `<rect x="${f(255 + i * 30)}" y="445" width="16" height="92" rx="8" fill="#7DBF6B" stroke="#4d8f3d" stroke-width="2" transform="rotate(${-20 + i * 12} ${255 + i * 30} 445)"/>`).join('');
  return s;
};

const lemonade = (seed) => {
  const r = rng(seed);
  let s = `<ellipse cx="400" cy="522" rx="150" ry="24" fill="#5a2d10" opacity=".22"/>`;
  s += `<path d="M285 130 L515 130 L482 515 L318 515Z" fill="#FFF5A8" opacity=".92" stroke="#fff" stroke-width="7"/>`;
  s += `<path d="M298 220 L502 220 L482 515 L318 515Z" fill="#FBE76A" opacity=".75"/>`;
  for (const [x, y, rot] of [[350, 270, 12], [430, 320, -14], [380, 390, 22], [450, 440, 8], [340, 460, -10]]) s += `<rect x="${x - 28}" y="${y - 28}" width="56" height="56" rx="12" fill="#fff" opacity=".5" stroke="#fff" stroke-width="2" transform="rotate(${rot} ${x} ${y})"/>`;
  s += `<path d="M300 150 L318 480" stroke="#fff" stroke-width="9" opacity=".6" stroke-linecap="round"/>`;
  s += `<g transform="rotate(14 470 120)"><rect x="458" y="20" width="22" height="260" rx="8" fill="#fff" stroke="#e5d9cf" stroke-width="2.4"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="458" y="${34 + i * 38}" width="22" height="16" fill="#E24A33"/>`).join('')}</g>`;
  s += `<g transform="translate(330 128)"><circle r="64" fill="#F7D93A" stroke="#d6b300" stroke-width="5"/><circle r="52" fill="#FFF3A0"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M0 0 L${f(Math.cos((i * Math.PI) / 4) * 50)} ${f(Math.sin((i * Math.PI) / 4) * 50)}" stroke="#F7D93A" stroke-width="4"/>`).join('')}</g>`;
  for (const [x, y, rot] of [[430, 120, 20], [470, 140, -30], [410, 138, 70], [455, 112, 0]]) s += T.basil(x, y, 0, rot);
  for (let i = 0; i < 14; i++) s += `<circle cx="${f(330 + r() * 150)}" cy="${f(160 + r() * 330)}" r="${f(2 + r() * 3)}" fill="#fff" opacity=".7"/>`;
  return s;
};

const lavacake = (seed) => {
  const r = rng(seed);
  let s = `<ellipse cx="408" cy="335" rx="262" ry="226" fill="#5a2d10" opacity=".18"/><circle cx="400" cy="300" r="250" fill="#FFF9EE" stroke="#E4D6BA" stroke-width="6"/>`;
  s += `<circle cx="400" cy="300" r="140" fill="#4A2416" stroke="#2e140b" stroke-width="5"/><circle cx="400" cy="300" r="118" fill="#5B2C1A"/>`;
  s += `<path d="M330 296 C340 250 440 246 470 292 C486 330 440 354 408 344 C372 350 322 334 330 296Z" fill="#240d06"/><path d="M360 290 C376 268 424 268 440 292" stroke="#7a3a22" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>`;
  s += `<path d="M436 350 C450 392 500 410 540 396" stroke="#2b1008" stroke-width="22" fill="none" stroke-linecap="round" opacity=".92"/><path d="M440 352 C454 386 494 400 530 390" stroke="#7a3a22" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
  for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 130; s += `<circle cx="${f(400 + Math.cos(a) * d)}" cy="${f(300 + Math.sin(a) * d)}" r="${f(1.2 + r() * 2.2)}" fill="#fff" opacity="${f(0.5 + r() * 0.4)}"/>`; }
  for (const [x, y] of [[320, 220], [352, 212], [336, 244]]) s += `<circle cx="${x}" cy="${y}" r="17" fill="#C2273A" stroke="#7d1423" stroke-width="2.4"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#fff" opacity=".45"/>`;
  s += T.basil(300, 262, 0, -30) + T.basil(318, 282, 0, 20);
  return s;
};

const tiramisu = () => {
  let s = `<ellipse cx="400" cy="508" rx="250" ry="30" fill="#5a2d10" opacity=".22"/><ellipse cx="400" cy="490" rx="240" ry="32" fill="#FFF9EE" stroke="#E4D6BA" stroke-width="5"/>`;
  s += `<path d="M270 190 L530 190 L510 480 L290 480Z" fill="#fff" opacity=".35" stroke="#d8cfc4" stroke-width="5"/>`;
  const layers = [['#F6E7C6', 190, 250], ['#8A5A3A', 250, 285], ['#F6E7C6', 285, 345], ['#8A5A3A', 345, 380], ['#F6E7C6', 380, 470]];
  layers.forEach(([c, y1, y2], i) => { const x1 = 276 + ((y1 - 190) / 290) * 14, x2 = 524 - ((y1 - 190) / 290) * 14; s += `<rect x="${f(x1)}" y="${y1}" width="${f(x2 - x1)}" height="${y2 - y1}" fill="${c}" opacity="${i % 2 ? 0.95 : 0.98}"/>`; });
  s += `<path d="M272 190 C300 160 500 160 528 190 L526 205 L274 205Z" fill="#5B3722"/>`;
  for (let i = 0; i < 40; i++) s += `<circle cx="${f(290 + (i * 37) % 220)}" cy="${f(176 + (i * 13) % 22)}" r="2" fill="#3a2214"/>`;
  s += `<path d="M285 200 L300 470" stroke="#fff" stroke-width="9" opacity=".6" stroke-linecap="round"/>`;
  s += `<g transform="translate(560 130)">${[0, 1, 2].map((i) => `<ellipse cx="${i * 36}" cy="${i * 8}" rx="14" ry="9" fill="#4a2a18" transform="rotate(${20 + i * 25} ${i * 36} ${i * 8})"/><path d="M${i * 36 - 10} ${i * 8} L${i * 36 + 10} ${i * 8}" stroke="#2a150a" stroke-width="2"/>`).join('')}</g>`;
  s += T.basil(300, 140, 0, 200) + T.basil(330, 128, 0, 160);
  return s;
};

const calzone = (seed) => {
  const r = rng(seed);
  let s = `<ellipse cx="408" cy="470" rx="262" ry="40" fill="#5a2d10" opacity=".2"/><path d="M130 440 C130 130 670 130 670 440 Z" fill="#E3A95B" stroke="#B87430" stroke-width="6"/><path d="M160 430 C165 175 635 175 640 430 Z" fill="#EDB868"/>`;
  s += `<path d="M180 400 C190 215 610 215 620 400" fill="none" stroke="#C97F34" stroke-width="22" opacity=".45" stroke-linecap="round"/>`;
  for (let i = 0; i < 40; i++) { const t = i / 39; const a = Math.PI + t * Math.PI; s += `<line x1="${f(400 + Math.cos(a) * 262)}" y1="${f(440 + Math.sin(a) * 300)}" x2="${f(400 + Math.cos(a) * 238)}" y2="${f(440 + Math.sin(a) * 270)}" stroke="#B87430" stroke-width="5" stroke-linecap="round"/>`; }
  s += `<path d="M130 440 L670 440" stroke="#B87430" stroke-width="8"/>`;
  s += `<path d="M300 300 C340 250 440 250 480 300" fill="none" stroke="#C97F34" stroke-width="5" opacity=".5"/>`;
  for (let i = 0; i < 90; i++) { const a = Math.PI + r() * Math.PI, d = Math.sqrt(r()) * 250; s += `<circle cx="${f(400 + Math.cos(a) * d)}" cy="${f(440 + Math.sin(a) * d * 1.05)}" r="${f(1.4 + r() * 2.4)}" fill="#fff" opacity="${f(0.35 + r() * 0.4)}"/>`; }
  s += `<path d="M360 190 C340 150 380 130 360 90 M420 190 C400 150 440 130 420 90 M480 190 C460 150 500 130 480 90" stroke="#fff" stroke-width="8" opacity=".5" fill="none" stroke-linecap="round"/>`;
  s += `<g transform="translate(610 505)"><ellipse rx="70" ry="22" fill="#FFF9EE" stroke="#E4D6BA" stroke-width="4"/><ellipse rx="52" ry="14" fill="#C8321F"/><ellipse cx="-12" cy="-3" rx="16" ry="4" fill="#E66A55"/></g>`;
  s += T.basil(250, 470, 0, 200) + T.basil(280, 490, 0, 160);
  return s;
};

// ---------- recipes ----------
const P = (o) => (seed) => pizza({ ...o, seed });
const recipes = {
  margherita: [P({ toppings: [['mozzarella', 9, { gap: 62 }], ['basil', 9, { gap: 44 }], ['cherrytomato', 6]] }), 0],
  pepperoni: [P({ toppings: [['pepperoni', 16, { gap: 54 }], ['basil', 3]] }), 1],
  fourcheese: [P({ cheese: '#FFE9A0', toppings: [['mozzarella', 7, { gap: 62 }], ['blue', 6, { gap: 48 }], ['ricotta', 10, { gap: 30 }], ['basil', 4]] }), 2],
  garden: [P({ toppings: [['pepper', 7, { gap: 44 }], ['yellowpepper', 4, { gap: 44 }], ['olive', 8, { gap: 36 }], ['onion', 6], ['corn', 22, { gap: 22 }], ['tomato', 3, { gap: 60 }]] }), 3],
  mushroom: [P({ whiteSauce: true, cheese: '#FBEBC0', toppings: [['mushroom', 11, { gap: 50 }], ['onion', 6], ['truffle', 6, { gap: 40 }], ['basil', 4]] }), 4],
  paneer: [P({ sauce: '#D6491F', toppings: [['paneer', 12, { gap: 42 }], ['pepper', 5], ['onion', 7], ['cilantro', 14, { gap: 26 }], ['chilli', 3]] }), 5],
  meatlovers: [P({ toppings: [['pepperoni', 8, { gap: 50 }], ['sausage', 8, { gap: 42 }], ['bacon', 8, { gap: 40 }], ['olive', 4], ['pepper', 3]] }), 0],
  bbqchicken: [P({ sauce: '#7A2E14', cheese: '#F3CE72', toppings: [['chicken', 12, { gap: 40 }], ['onion', 8], ['cilantro', 14, { gap: 24 }]], drizzle: 'bbq' }), 1],
  sausage: [P({ toppings: [['sausage', 14, { gap: 40 }], ['jalapeno', 8, { gap: 34 }], ['pepper', 4], ['basil', 3]] }), 2],
  burrata: [P({ toppings: [['burrata', 1, { gap: 10 }], ['cherrytomato', 10, { gap: 36 }], ['arugula', 7, { gap: 44 }], ['truffle', 5]] }), 3],
  prosciutto: [P({ whiteSauce: true, cheese: '#FBEBC0', toppings: [['prosciutto', 8, { gap: 54 }], ['fig', 7, { gap: 40 }], ['walnut', 6], ['arugula', 5, { gap: 40 }]], drizzle: 'honey' }), 4],
  hothoney: [P({ toppings: [['salami', 14, { gap: 46 }], ['chilli', 6], ['basil', 5], ['jalapeno', 3]], drizzle: 'honey' }), 5],
  garlicbread: [garlicbread, 0],
  wings: [wings, 1],
  lemonade: [lemonade, 2],
  lavacake: [lavacake, 3],
  tiramisu: [tiramisu, 4],
  calzone: [calzone, 5],
};

for (const [slug, [fn, bg]] of Object.entries(recipes)) {
  writeFileSync(new URL(`${slug}.svg`, OUT), frame(fn(7 + slug.length), { bg, seed: 1 + slug.length }));
  // second angle: different background, tighter crop, rotated
  writeFileSync(new URL(`${slug}-2.svg`, OUT), frame(fn(31 + slug.length * 3), { bg: bg + 3, zoom: 1.32, rotate: 24, seed: 9 + slug.length }));
}

// hero pizza (transparent background)
const heroSeed = 11;
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="700" height="700" role="img">${pizza({
  cx: 350, cy: 350, R: 320, seed: heroSeed,
  toppings: [['pepperoni', 12, { gap: 74 }], ['basil', 10, { gap: 56 }], ['olive', 8, { gap: 48 }], ['mushroom', 5, { gap: 66 }], ['cherrytomato', 6, { gap: 50 }]],
})}</svg>`;
writeFileSync(new URL('../hero-pizza.svg', OUT), hero);
console.log(`Generated ${Object.keys(recipes).length * 2} menu illustrations + hero-pizza.svg`);
