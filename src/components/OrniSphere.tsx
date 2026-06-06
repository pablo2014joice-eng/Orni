import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bolt } from 'lucide-react';

interface OrniSphereProps {
  state: 'initial' | 'transitioning' | 'evolved';
  onEvolved: () => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
  isListening?: boolean;
  sphereColor?: string;
  sphereColor1?: string;
  sphereColor2?: string;
  hatType?: string;
  hatColor?: string;
  hatColor1?: string;
  hatColor2?: string;
  glassesType?: string;
  glassesColor?: string;
  glassesColor1?: string;
  glassesColor2?: string;

  // New Categories
  capType?: string;
  capColor1?: string;
  capColor2?: string;
  itemType?: string;
  itemColor1?: string;
  itemColor2?: string;
  bodyType?: string;
  bodyColor1?: string;
  bodyColor2?: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export default function OrniSphere({
  state,
  onEvolved,
  onPointerDown,
  onPointerUp,
  isListening,
  sphereColor = 'blue',
  sphereColor1,
  sphereColor2,
  hatType = 'none',
  hatColor = '#ef4444',
  hatColor1,
  hatColor2,
  glassesType = 'none',
  glassesColor = '#0f172a',
  glassesColor1,
  glassesColor2,
  capType = 'none',
  capColor1 = '#2563eb',
  capColor2,
  itemType = 'none',
  itemColor1 = '#fbbf24',
  itemColor2,
  bodyType = 'none',
  bodyColor1 = '#ef4444',
  bodyColor2,
}: OrniSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const maxClicks = 6;

  // Resolve custom color inputs
  const sColor1 = sphereColor1 || sphereColor || 'blue';
  const sColor2 = sphereColor2 || '';
  const hColor1 = hatColor1 || hatColor || '#ef4444';
  const hColor2 = hatColor2 || hColor1;
  const gColor1 = glassesColor1 || glassesColor || '#0f172a';
  const gColor2 = glassesColor2 || gColor1;

  // Support comma-separated strings to equip multiple accessories simultaneously
  const hatList = (hatType || 'none').split(',').map((s) => s.trim()).filter((s) => s && s !== 'none');
  const glassesList = (glassesType || 'none').split(',').map((s) => s.trim()).filter((s) => s && s !== 'none');
  const capList = (capType || 'none').split(',').map((s) => s.trim()).filter((s) => s && s !== 'none');
  const itemList = (itemType || 'none').split(',').map((s) => s.trim()).filter((s) => s && s !== 'none');
  const bodyList = (bodyType || 'none').split(',').map((s) => s.trim()).filter((s) => s && s !== 'none');
  const cpColor1 = capColor1 || '#2563eb';
  const cpColor2 = capColor2 || cpColor1;
  const itColor1 = itemColor1 || '#fbbf24';
  const itColor2 = itemColor2 || itColor1;
  const bdColor1 = bodyColor1 || '#ef4444';
  const bdColor2 = bodyColor2 || bdColor1;

  const COLOR_MAP: Record<string, string> = {
    blue: '#2563eb',
    emerald: '#10b981',
    rose: '#f43f5e',
    purple: '#a855f7',
    amber: '#f59e0b',
    gold: '#fbbf24',
  };

  const resolveColor = (c: string): string => {
    return COLOR_MAP[c] || c;
  };

  const darkenColor = (hex: string, percent: number): string => {
    try {
      let cleanHex = hex.replace('#', '');
      if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('');
      }
      if (cleanHex.length !== 6) return '#020617';
      let num = parseInt(cleanHex, 16);
      let amt = Math.round(2.55 * percent);
      let R = (num >> 16) - amt;
      let G = (num >> 8 & 0x00FF) - amt;
      let B = (num & 0x0000FF) - amt;
      R = Math.max(0, R);
      G = Math.max(0, G);
      B = Math.max(0, B);
      return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    } catch {
      return '#020617';
    }
  };

  // Custom sphere styles based on sphere colors and gradients
  const getSphereGradient = (isEvolved: boolean, isListeningMode: boolean) => {
    if (isEvolved && isListeningMode) {
      return 'radial-gradient(circle at 30% 30%, #10b981, #059669, #064e3b, #022c22)';
    }

    const c1 = resolveColor(sColor1);
    if (sColor2) {
      const c2 = resolveColor(sColor2);
      return `radial-gradient(circle at 35% 35%, ${c1}, ${c2}, #020617)`;
    }

    const shadowC = darkenColor(c1, 40);
    return `radial-gradient(circle at 35% 35%, ${c1}, ${shadowC}, #020617)`;
  };

  const getSphereShadow = (isEvolved: boolean, isListeningMode: boolean) => {
    if (isEvolved && isListeningMode) {
      return '0 0 60px rgba(16, 185, 129, 0.95), inset 0 0 35px rgba(255, 255, 255, 0.4)';
    }

    const size = isEvolved ? 50 : 40;
    const insetPct = isEvolved ? 30 : 25;
    const c1 = resolveColor(sColor1);
    
    return `0 0 ${size}px ${c1}cc, inset 0 0 ${insetPct}px rgba(255, 255, 255, 0.25)`;
  };

  const renderHat = (type?: string) => {
    const activeHat = type || hatType;
    if (!activeHat || activeHat === 'none') return null;

    switch (activeHat) {
      case 'bone':
        return (
          <g>
            {/* Cap Dome */}
            <path
              d="M 64,30 C 65,5 135,5 136,30 Z"
              fill={hColor1}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.2"
            />
            {/* Front logo/circle badge */}
            <circle cx="100" cy="18" r="6" fill={hColor2} />
            <circle cx="100" cy="18" r="3" fill="#ffffff" />
            {/* Visor button at top */}
            <circle cx="100" cy="5" r="3.5" fill={hColor2} />
            {/* Cap brim/visor pointing to the side (cool style!) */}
            <path
              d="M 132,24 Q 170,22 175,32 Q 145,35 132,26 Z"
              fill={hColor1}
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </g>
        );
      case 'mago':
        return (
          <g>
            <defs>
              <linearGradient id="wizardHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={hColor1} />
                <stop offset="100%" stopColor={hColor2} />
              </linearGradient>
            </defs>
            {/* Cone */}
            <path
              d="M 60,32 Q 100,-45 80,-40 Q 110,-45 140,32 Z"
              fill="url(#wizardHatGrad)"
              stroke="#000"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            {/* Star decorations in secondary color */}
            <path d="M 95,-10 L 97,-5 L 102,-5 L 98,-2 L 100,3 L 95,0 L 90,3 L 92,-2 L 88,-5 L 93,-5 Z" fill={hColor2} />
            <path d="M 110,12 L 111,15 L 114,15 L 112,17 L 113,20 L 110,18 L 107,20 L 108,17 L 106,15 L 109,15 Z" fill={hColor2} />
            {/* Brim */}
            <path
              d="M 45,35 Q 100,20 155,35 Q 100,45 45,35 Z"
              fill={hColor2}
              stroke="#000"
              strokeWidth="2"
              strokeOpacity="0.25"
            />
          </g>
        );
      case 'cartola':
        return (
          <g>
            {/* Crown */}
            <path
              d="M 70,35 L 70,-10 C 70,-15 130,-15 130,-10 L 130,35 Z"
              fill={hColor1}
              stroke="#000000"
              strokeWidth="2"
              strokeOpacity="0.2"
            />
            {/* Ribbon band */}
            <path d="M 70,35 L 70,25 C 70,23 130,23 130,25 L 130,35 Z" fill={hColor2} opacity={0.9} />
            <path d="M 70,35 L 70,28 C 70,27 130,27 130,28 L 130,35 Z" fill="#000000" opacity={0.2} />
            {/* Brim */}
            <ellipse
              cx="100"
              cy="35"
              rx="55"
              ry="10"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
          </g>
        );
      case 'cauboi':
        return (
          <g>
            {/* Hat Crown with crease */}
            <path
              d="M 64,28 Q 63,-5 80,-3 Q 100,8 120,-3 Q 137,-5 136,28 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1.5"
              strokeOpacity="0.2"
            />
            {/* Band */}
            <path d="M 66,28 Q 100,24 134,28 L 135,24 Q 100,20 65,24 Z" fill={hColor2} />
            <rect x="96" y="21" width="8" height="6" rx="1.5" fill="#facc15" />
            {/* Hat Brim */}
            <path
              d="M 40,25 Q 100,43 160,25 Q 130,20 100,28 Q 70,20 40,25 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="2"
              strokeOpacity="0.25"
            />
          </g>
        );
      case 'noel':
        return (
          <g>
            {/* Red shape of Santa's floppy hat */}
            <path
              d="M 65,30 Q 110,-35 135,-15 Q 145,-5 136,0 Q 120,5 115,-5 Q 100,-15 135,30 Z"
              fill={hColor1}
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            {/* White fluffy pompom */}
            <circle cx="132" cy="0" r="12" fill={hColor2} stroke="#e2e8f0" strokeWidth="1" />
            {/* White brim */}
            <rect
              x="52"
              y="24"
              width="96"
              height="15"
              rx="7.5"
              fill={hColor2}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          </g>
        );
      case 'festa':
        return (
          <g>
            {/* Cone */}
            <path
              d="M 65,32 L 100,-35 L 135,32 Z"
              fill={hColor1}
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.2"
            />
            {/* Swirling color lines */}
            <path d="M 75,18 L 100,-35 L 115,-4 Z" fill={hColor2} opacity={0.6} />
            <path d="M 88,32 L 100,-35 L 106,32 Z" fill={hColor2} opacity={0.4} />
            {/* Pom-pom at top */}
            <circle cx="100" cy="-35" r="9" fill={hColor2} />
            {/* Bottom fringe trim */}
            <ellipse cx="100" cy="32" rx="41" ry="5.5" fill={hColor2} opacity={0.8} />
          </g>
        );
      case 'coroa':
        return (
          <g>
            {/* Soft velvet cushion base */}
            <path d="M 62,35 Q 100,10 138,35 Z" fill={hColor2} opacity={0.85} />
            {/* Gold spiked crown crowns */}
            <path
              d="M 52,36 L 58,12 L 78,28 L 100,5 L 122,28 L 142,12 L 148,36 Z"
              fill={hColor1}
              stroke="#b45309"
              strokeWidth="1"
            />
            {/* Gem ornaments */}
            <circle cx="58" cy="12" r="3" fill={hColor2} />
            <circle cx="100" cy="5" r="4.5" fill={hColor2} />
            <circle cx="142" cy="12" r="3" fill={hColor2} />
            {/* Crown headband band */}
            <rect x="52" y="32" width="96" height="5" rx="2" fill={hColor1} />
            <circle cx="76" cy="34.5" r="1.5" fill={hColor2} />
            <circle cx="100" cy="34.5" r="1.5" fill="#fff" />
            <circle cx="124" cy="34.5" r="1.5" fill={hColor2} />
          </g>
        );
      case 'gato':
        return (
          <g>
            {/* Left Cat Ear */}
            <path
              d="M 40,55 L 20,10 L 65,30 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.2"
            />
            <path d="M 37,45 L 25,18 L 54,28 Z" fill={hColor2} />
            {/* Right Cat Ear */}
            <path
              d="M 160,55 L 180,10 L 135,30 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.2"
            />
            <path d="M 163,45 L 175,18 L 146,28 Z" fill={hColor2} />
          </g>
        );
      case 'coelho':
        return (
          <g>
            {/* Left tall bunny ear */}
            <path
              d="M 68,36 C 50,-20 90,-25 80,30 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            <path d="M 70,25 C 60,-10 80,-12 76,22 Z" fill={hColor2} />

            {/* Right tall bunny ear */}
            <path
              d="M 132,36 C 150,-20 110,-25 120,30 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            <path d="M 130,25 C 140,-10 120,-12 124,22 Z" fill={hColor2} />
          </g>
        );
      case 'halo':
        return (
          <g>
            {/* Floating stems */}
            <line x1="88" y1="20" x2="88" y2="35" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="112" y1="20" x2="112" y2="35" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
            {/* Glow backing */}
            <ellipse cx="100" cy="18" rx="45" ry="12" fill="none" stroke={hColor1} strokeWidth="7" opacity={0.3} style={{ filter: 'blur(3px)' }} />
            {/* Main Halo ring */}
            <ellipse cx="100" cy="18" rx="42" ry="10" fill="none" stroke={hColor1} strokeWidth="3.5" />
            <ellipse cx="100" cy="18" rx="38" ry="8" fill="none" stroke="#fff" strokeWidth="1" />
            {/* Tiny stars */}
            <path d="M60,10 L62,13 L65,13 L63,15 L64,18 L60,16 L56,18 L57,15 L55,13 L58,13 Z" fill={hColor2} opacity={0.8} />
            <path d="M140,8 L141,10 L144,10 L142,12 L143,15 L140,13 L137,15 L138,12 L136,10 L139,10 Z" fill={hColor2} opacity={0.8} />
          </g>
        );
      case 'chifres':
        return (
          <g>
            {/* Left curved devil horn */}
            <path
              d="M 60,35 Q 22,-5 12,22 Q 35,5 65,30 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            <path d="M 50,30 Q 28,5 21,20 Q 32,12 52,26 Z" fill={hColor2} />
            
            {/* Right curved devil horn */}
            <path
              d="M 140,35 Q 178,-5 188,22 Q 165,5 135,30 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            <path d="M 150,30 Q 172,5 179,20 Q 168,12 148,26 Z" fill={hColor2} />
          </g>
        );
      case 'fone':
        return (
          <g>
            {/* Connecting head bar */}
            <path d="M 32,80 A 70,70 0 0,1 168,80" fill="none" stroke={hColor2} strokeWidth="5.5" />
            <path d="M 34,78 A 68,68 0 0,1 166,78" fill="none" stroke={hColor1} strokeWidth="2" />
            {/* Left Ear Cushion */}
            <rect x="20" y="70" width="16" height="36" rx="8" fill={hColor1} stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
            <rect x="28" y="75" width="6" height="26" rx="3" fill={hColor2} />
            {/* Right Ear Cushion */}
            <rect x="164" y="70" width="16" height="36" rx="8" fill={hColor1} stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
            <rect x="166" y="75" width="6" height="26" rx="3" fill={hColor2} />
            {/* Microphone piece */}
            <path d="M 30,100 L 48,118" fill="none" stroke={hColor2} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="48" cy="118" r="4.5" fill={hColor1} />
          </g>
        );
      case 'pirata':
        return (
          <g>
            {/* Captain's Tricorne Hat */}
            <path
              d="M 40,30 C 70,5 130,5 160,30 C 180,36 140,14 100,28 C 60,14 20,36 40,30 Z"
              fill={hColor1}
              stroke="#000"
              strokeWidth="1"
            />
            {/* Gold piping trim */}
            <path
              d="M 40,30 C 70,5 130,5 160,30"
              fill="none"
              stroke={hColor2}
              strokeWidth="2"
            />
            {/* Skull motif outline */}
            <circle cx="100" cy="18" r="4" fill="#ffffff" />
            <rect x="98.5" y="21" width="3" height="3.5" rx="1" fill="#ffffff" />
            <line x1="95" y1="16" x2="105" y2="24" stroke="#ffffff" strokeWidth="1.2" />
            <line x1="105" y1="16" x2="95" y2="24" stroke="#ffffff" strokeWidth="1.2" />
          </g>
        );
      case 'flores':
        return (
          <g>
            {/* Vine wrapping around */}
            <path d="M 48,34 Q 100,16 152,34" fill="none" stroke={hColor2} strokeWidth="2.5" />
            {/* Leaves in color 2 */}
            <path d="M 64,28 Q 63,22 71,26 Z" fill={hColor2} />
            <path d="M 128,26 Q 134,22 133,28 Z" fill={hColor2} />
            
            {/* Five beautiful blooming flower buds */}
            <circle cx="62" cy="30" r="7" fill={hColor1} />
            <circle cx="62" cy="30" r="3" fill="#fff" />

            <circle cx="81" cy="24" r="8.5" fill={hColor1} />
            <circle cx="81" cy="24" r="3.5" fill={hColor2} />

            <circle cx="100" cy="20" r="9.5" fill={hColor1} />
            <circle cx="100" cy="20" r="4" fill="#fff" />

            <circle cx="119" cy="24" r="8.5" fill={hColor1} />
            <circle cx="119" cy="24" r="3.5" fill={hColor2} />

            <circle cx="138" cy="30" r="7" fill={hColor1} />
            <circle cx="138" cy="30" r="3" fill="#fff" />
          </g>
        );
      case 'chef':
        return (
          <g>
            {/* Fluffy tall hat body */}
            <path
              d="M 65,30 C 50,5 70,-15 100,-10 C 130,-15 150,5 135,30 Z"
              fill={hColor1}
              stroke="#ccc"
              strokeWidth="1"
            />
            {/* Additional puff shapes for texture */}
            <path d="M 80,18 C 80,0 120,0 120,18" fill={hColor1} opacity={0.6} />
            {/* Solid sweatband base */}
            <rect x="64" y="24" width="72" height="11" fill={hColor2} rx="2" stroke="#bbb" strokeWidth="1" />
          </g>
        );
      case 'bobo':
        return (
          <g>
            {/* Jester crown points */}
            {/* Left curved floppy cone */}
            <path d="M 64,32 C 30,10 10,25 25,48 C 35,46 52,38 64,32 Z" fill={hColor1} />
            <circle cx="21" cy="48" r="4.5" fill="#facc15" />

            {/* Right curved floppy cone */}
            <path d="M 136,32 C 170,10 190,25 175,48 C 165,46 148,38 136,32 Z" fill={hColor1} />
            <circle cx="179" cy="48" r="4.5" fill="#facc15" />

            {/* Center upright pointed fold */}
            <path d="M 75,32 L 100,-12 L 125,32 Z" fill={hColor2} />
            <circle cx="100" cy="-12" r="5" fill="#facc15" />

            {/* Colorful band */}
            <path d="M 62,30 Q 100,22 138,30 L 138,35 Q 100,28 62,35 Z" fill={hColor2} />
          </g>
        );
      case 'capacete':
        return (
          <g>
            {/* Circular dark tinted glass dome */}
            <circle cx="100" cy="95" r="90" fill="none" stroke={hColor1} strokeWidth="5.5" />
            <circle cx="100" cy="95" r="88" fill={hColor1} fillOpacity="0.12" />
            {/* Visor shine highlights */}
            <path d="M 40,55 A 75,75 0 0,1 160,55" fill="none" stroke="#fff" strokeWidth="2.5" opacity={0.3} />
            {/* Oxygen pressure valve nodes */}
            <circle cx="20" cy="95" r="8" fill={hColor2} />
            <circle cx="180" cy="95" r="8" fill={hColor2} />
            {/* Cute antenna */}
            <line x1="100" y1="5" x2="100" y2="-15" stroke={hColor2} strokeWidth="3" />
            <circle cx="100" cy="-15" r="5" fill={hColor1} />
          </g>
        );
      default:
        return null;
    }
  };

  const renderGlasses = (type?: string) => {
    const activeGlasses = type || glassesType;
    if (!activeGlasses || activeGlasses === 'none') return null;

    switch (activeGlasses) {
      case 'shades':
        return (
          <g>
            <defs>
              <linearGradient id="shadesLensGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gColor1} />
                <stop offset="100%" stopColor={gColor2} opacity={0.8} />
              </linearGradient>
            </defs>
            {/* Left Glass lens */}
            <path d="M 52,88 L 92,88 L 86,112 L 60,112 Z" fill="url(#shadesLensGrad)" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.3" />
            {/* Reflection stream */}
            <path d="M 56,92 L 72,92 L 62,108 L 56,108 Z" fill="#ffffff" opacity={0.25} />
            
            {/* Right Glass lens */}
            <path d="M 108,88 L 148,88 L 142,112 L 116,112 Z" fill="url(#shadesLensGrad)" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.3" />
            {/* Reflection stream */}
            <path d="M 112,92 L 128,92 L 118,108 L 112,108 Z" fill="#ffffff" opacity={0.25} />
            
            {/* Connecting nose bridge */}
            <path d="M 90,92 Q 100,87 110,92" fill="none" stroke={gColor2} strokeWidth="3.5" />
            {/* Side wings ears anchors */}
            <path d="M 52,90 L 33,94" fill="none" stroke={gColor1} strokeWidth="3.5" />
            <path d="M 148,90 L 167,94" fill="none" stroke={gColor1} strokeWidth="3.5" />
          </g>
        );
      case 'geek':
        return (
          <g>
            {/* Left Round Frame */}
            <circle cx="72" cy="98" r="21" fill="none" stroke={gColor1} strokeWidth="5" />
            <circle cx="72" cy="98" r="18.5" fill="#38bdf8" fillOpacity={0.15} />
            <path d="M 60,90 Q 75,85 70,105" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity={0.4} />
            
            {/* Right Round Frame */}
            <circle cx="128" cy="98" r="21" fill="none" stroke={gColor1} strokeWidth="5" />
            <circle cx="128" cy="98" r="18.5" fill="#38bdf8" fillOpacity={0.15} />
            <path d="M 116,90 Q 131,85 126,105" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity={0.4} />
            
            {/* Bridge connection */}
            <path d="M 93,98 Q 100,94 107,98" fill="none" stroke={gColor2} strokeWidth="4.5" />
            {/* Temples side hook */}
            <path d="M 51,98 L 33,101" fill="none" stroke={gColor2} strokeWidth="3" />
            <path d="M 149,98 L 167,101" fill="none" stroke={gColor2} strokeWidth="3" />
          </g>
        );
      case 'heart':
        return (
          <g>
            {/* Left Sweetheart Lens Frame */}
            <path d="M 72,83 C 83,83 83,98 72,109 C 61,98 61,83 72,83 Z" fill={gColor1} stroke={gColor2} strokeWidth="2.5" />
            <path d="M 72,87 C 79,87 79,96 72,103 C 65,96 65,87 72,87 Z" fill="#ffffff" opacity={0.3} />
            
            {/* Right Sweetheart Lens Frame */}
            <path d="M 128,83 C 139,83 139,98 128,109 C 117,98 117,83 128,83 Z" fill={gColor1} stroke={gColor2} strokeWidth="2.5" />
            <path d="M 128,87 C 135,87 135,96 128,103 C 121,95 121,87 128,87 Z" fill="#ffffff" opacity={0.3} />
            
            {/* Bridge */}
            <path d="M 83,94 Q 100,88 117,94" fill="none" stroke={gColor2} strokeWidth="4.5" />
            {/* Sides temples */}
            <path d="M 61,94 L 38,98" fill="none" stroke={gColor1} strokeWidth="3.2" />
            <path d="M 139,94 L 162,98" fill="none" stroke={gColor1} strokeWidth="3.2" />
          </g>
        );
      case 'monocle':
        return (
          <g>
            {/* Monocle Lens on the right eye */}
            <circle cx="125" cy="98" r="23" fill="none" stroke={gColor1} strokeWidth="4.5" />
            <circle cx="125" cy="98" r="21" fill={gColor2} fillOpacity={0.15} />
            <path d="M 112,90 Q 128,85 123,105" fill="none" stroke="#ffffff" strokeWidth="2.2" opacity={0.5} />
            
            {/* Metallic long hanging chain looping downwards */}
            <path d="M 148,98 Q 165,130 145,170 Q 125,190 110,180" fill="none" stroke={gColor2} strokeWidth="2" strokeDasharray="4 2.5" />
            <ellipse cx="148" cy="98" rx="2.5" ry="2.5" fill={gColor2} />
          </g>
        );
      case 'mascara':
        return (
          <g>
            {/* Winged Masquerade Eye Mask Base shape */}
            <path
              d="M 32,90 C 45,70 90,75 100,95 C 110,75 155,70 168,90 C 182,108 145,124 100,104 C 55,124 18,108 32,90 Z"
              fill={gColor1}
              stroke={gColor2}
              strokeWidth="2"
            />
            {/* Eye socket hollow holes */}
            <ellipse cx="70" cy="96" rx="14" ry="8" fill="#000" fillOpacity={0.4} />
            <ellipse cx="130" cy="96" rx="14" ry="8" fill="#000" fillOpacity={0.4} />
            {/* Flourish lace decals */}
            <path d="M 40,84 C 55,80 65,85 70,95" fill="none" stroke={gColor2} strokeWidth="1.5" opacity={0.7} />
            <path d="M 160,84 C 145,80 135,85 130,95" fill="none" stroke={gColor2} strokeWidth="1.5" opacity={0.7} />
          </g>
        );
      case 'tapaolho':
        return (
          <g>
            {/* Solid leather eye patch over Left eye */}
            <path d="M 50,96 C 50,80 90,80 84,106 C 75,115 50,110 50,96 Z" fill={gColor1} stroke="#000" strokeWidth="1" />
            {/* Tie straps holding it */}
            <path d="M 33,85 L 85,110" fill="none" stroke={gColor2} strokeWidth="3" />
            <path d="M 80,85 L 167,112" fill="none" stroke={gColor1} strokeWidth="2.5" />
            {/* Small skull sticker on direct center */}
            <circle cx="67" cy="96" r="3.2" fill={gColor2} />
            <line x1="64" y1="100.5" x2="70" y2="100.5" stroke={gColor2} strokeWidth="1" />
          </g>
        );
      case 'bigode':
        return (
          <g>
            {/* Left curl handlebar */}
            <path d="M 100,118 Q 80,114 62,126 Q 50,132 44,122 Q 55,112 100,118 Z" fill={gColor1} stroke="#000" strokeWidth="0.5" />
            <path d="M 95,119 Q 80,116 66,124" fill="none" stroke={gColor2} strokeWidth="1.2" />
            
            {/* Right curl handlebar */}
            <path d="M 100,118 Q 120,114 138,126 Q 150,132 156,122 Q 145,112 100,118 Z" fill={gColor1} stroke="#000" strokeWidth="0.5" />
            <path d="M 105,119 Q 120,116 134,124" fill="none" stroke={gColor2} strokeWidth="1.2" />

            {/* Nose divider center anchor */}
            <circle cx="100" cy="117" r="2.5" fill={gColor2} />
          </g>
        );
      case 'blush':
        return (
          <g>
            {/* Left beautiful flushed cheek circle overlay wrapper */}
            <circle cx="55" cy="115" r="16" fill={gColor1} fillOpacity={0.65} style={{ filter: 'blur(2.5px)' }} />
            {/* Right beautiful cheek circular wrapper */}
            <circle cx="145" cy="115" r="16" fill={gColor1} fillOpacity={0.65} style={{ filter: 'blur(2.5px)' }} />
            
            {/* Sparkle star highlights on cheek */}
            <path d="M53,108 L55,110 L58,110 L56,112 L57,115 L54,113 L51,115 L52,112 L50,110 L52,110 Z" fill={gColor2} />
            <path d="M143,108 L145,110 L148,110 L146,112 L147,115 L144,113 L141,115 L142,112 L140,110 L142,110 Z" fill={gColor2} />
          </g>
        );
      case 'sci-fi':
        return (
          <g>
            {/* Sleek horizontal visor strip shield */}
            <rect x="36" y="86" width="128" height="20" rx="4" fill={gColor1} stroke={gColor2} strokeWidth="2.5" opacity={0.9} />
            {/* Neon core scan glow */}
            <line x1="42" y1="96" x2="158" y2="96" stroke={gColor2} strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px ' + gColor2 + ')' }} />
            <line x1="44" y1="96" x2="156" y2="96" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Tech grid notches inside */}
            <line x1="48" y1="90" x2="48" y2="102" stroke={gColor2} strokeWidth="1" opacity={0.5} />
            <line x1="152" y1="90" x2="152" y2="102" stroke={gColor2} strokeWidth="1" opacity={0.5} />
          </g>
        );
      case 'laço':
        return (
          <g>
            {/* Adorable hair ribbon bow tie placed on the upper side right forehead */}
            {/* Left loops */}
            <path d="M 140,54 C 120,44 125,74 140,64 Z" fill={gColor1} stroke="#000" strokeWidth="1" strokeOpacity="0.15" />
            <path d="M 138,55 C 128,49 131,69 138,62 Z" fill={gColor2} />

            {/* Right loops */}
            <path d="M 144,54 C 164,44 159,74 144,64 Z" fill={gColor1} stroke="#000" strokeWidth="1" strokeOpacity="0.15" />
            <path d="M 146,55 C 156,49 153,69 146,62 Z" fill={gColor2} />

            {/* Central knot bow bead */}
            <rect x="139" y="55" width="6" height="8" rx="2" fill={gColor2} stroke="#000" strokeWidth="0.5" />
            {/* Tails styling flowing down */}
            <path d="M 139,62 L 132,74 L 141,70 Z" fill={gColor1} />
            <path d="M 145,62 L 152,74 L 143,70 Z" fill={gColor1} />
          </g>
        );
      case 'estrela':
        return (
          <g>
            {/* Left Star structure frame */}
            <path d="M 72,78 L 76,87 L 85,87 L 78,92 L 81,101 L 72,96 L 63,101 L 66,92 L 59,87 L 68,87 Z" fill={gColor1} stroke={gColor2} strokeWidth="2.5" />
            <path d="M 72,83 L 74,89 L 80,89 L 75,92 L 77,97 L 72,94 L 67,97 L 69,92 L 64,89 L 70,89 Z" fill="#ffffff" opacity={0.4} />

            {/* Right Star structure frame */}
            <path d="M 128,78 L 132,87 L 141,87 L 134,92 L 137,101 L 128,96 L 119,101 L 122,92 L 115,87 L 124,87 Z" fill={gColor1} stroke={gColor2} strokeWidth="2.5" />
            <path d="M 128,83 L 130,89 L 136,89 L 131,92 L 133,97 L 128,94 L 123,97 L 125,92 L 120,89 L 126,89 Z" fill="#ffffff" opacity={0.4} />

            {/* Frame connectors */}
            <path d="M 85,90 Q 100,85 115,90" fill="none" stroke={gColor2} strokeWidth="4.5" />
            {/* Earpieces */}
            <path d="M 59,90 L 33,94" fill="none" stroke={gColor1} strokeWidth="3" />
            <path d="M 141,90 L 167,94" fill="none" stroke={gColor1} strokeWidth="3" />
          </g>
        );
      default:
        return null;
    }
  };

  const renderCap = (type?: string) => {
    const activeCap = type || capType;
    if (!activeCap || activeCap === 'none') return null;

    switch (activeCap) {
      case 'snapback':
        return (
          <g>
            <defs>
              <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={cpColor1} />
                <stop offset="100%" stopColor={cpColor2} />
              </linearGradient>
            </defs>
            {/* Crown dome */}
            <path
              d="M 64,36 C 64,13 136,13 136,36 Z"
              fill="url(#capGrad)"
              stroke="#000"
              strokeWidth="1.2"
              strokeOpacity="0.2"
            />
            {/* Front logo/badge */}
            <circle cx="100" cy="24" r="5" fill="#ffffff" />
            <path d="M 100,21 L 102,24 L 105,24 L 103,26 L 104,29 L 100,27 L 96,29 L 97,26 L 95,24 L 98,24 Z" fill={cpColor2} />
            {/* Snap visor pointing side-forward */}
            <path
              d="M 124,34 Q 138,27 158,26 Q 148,39 124,37 Z"
              fill={cpColor2}
              stroke="#000"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
            {/* Small button at top center */}
            <ellipse cx="100" cy="14" rx="3.5" ry="2" fill={cpColor2} />
          </g>
        );
      case 'propeller':
        return (
          <g>
            {/* Rounded cap dome */}
            <path
              d="M 66,36 C 66,15 134,15 134,36 Z"
              fill={cpColor1}
              stroke="#000"
              strokeWidth="1.2"
              strokeOpacity="0.15"
            />
            {/* Different colorful panels like a real propeller beanie! */}
            <path d="M 100,16 Q 80,24 67,36 H 100 Z" fill={cpColor2} opacity={0.65} />
            <path d="M 100,16 Q 120,24 133,36 H 100 Z" fill="#fbbf24" opacity={0.5} />
            {/* Pin shaft on top */}
            <rect x="98.5" y="6" width="3" height="11" fill="#cbd5e1" />
            {/* Spinning propeller blades */}
            <g className="origin-[100px_6px]" style={{ animation: 'spin 1.5s linear infinite' }}>
              <ellipse cx="100" cy="6" rx="28" ry="4" fill={cpColor2} />
              <ellipse cx="100" cy="6" rx="10" ry="2.5" fill="#fff" />
            </g>
            <circle cx="100" cy="6" r="3" fill="#ef4444" />
          </g>
        );
      case 'bandana':
        return (
          <g>
            {/* Bandana headband wrapped */}
            <path
              d="M 65,37 Q 100,18 135,37 Q 100,45 65,37 Z"
              fill={cpColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            {/* Pirate knots on left side */}
            <circle cx="63" cy="37" r="4.5" fill={cpColor2} />
            <circle cx="60" cy="41" r="3.5" fill={cpColor2} />
            {/* Flowing tails */}
            <path
              d="M 61,39 Q 44,48 50,58 Q 54,46 62,41 Z"
              fill={cpColor1}
              stroke="#000"
              strokeWidth="0.8"
              strokeOpacity="0.1"
            />
            <path
              d="M 58,42 Q 40,54 44,64 Q 48,52 57,45 Z"
              fill={cpColor2}
            />
          </g>
        );
      case 'sweatband':
        return (
          <g>
            {/* Sporty stretch sweatband bar */}
            <rect x="62" y="38" width="76" height="11" rx="3.5" fill={cpColor1} stroke="#000" strokeWidth="1" strokeOpacity="0.15" />
            {/* Signature sports stripes */}
            <line x1="65" y1="43.5" x2="135" y2="43.5" stroke={cpColor2} strokeWidth="2.5" strokeDasharray="6 4" />
            {/* Embroidered square badge logo */}
            <rect x="94" y="39.5" width="12" height="8" rx="1" fill="#fff" />
            <path d="M 96,44.5 L 99,41 L 101,44 L 104,41" fill="none" stroke={cpColor1} strokeWidth="1.2" />
          </g>
        );
      default:
        return null;
    }
  };

  const renderItem = (type?: string) => {
    const activeItem = type || itemType;
    if (!activeItem || activeItem === 'none') return null;

    switch (activeItem) {
      case 'wand':
        return (
          <g className="animate-[bounce_3s_ease-in-out_infinite]">
            {/* Sparkling Magic Wand floating on the left side */}
            <line x1="28" y1="168" x2="52" y2="132" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="25" y="160" width="6" height="12" rx="1" fill="#d97706" transform="rotate(-35 25 160)" />
            {/* Star sparkle core */}
            <path
              d="M 52,120 L 55,127 L 62,127 L 57,131 L 59,138 L 52,134 L 45,138 L 47,131 L 42,127 L 49,127 Z"
              fill={itColor1}
              stroke="#fff"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(0 0 6px ' + itColor1 + ')' }}
            />
            {/* Floating ambient sparkly stars */}
            <circle cx="68" cy="115" r="2.2" fill={itColor2} opacity="0.8" />
            <circle cx="36" cy="118" r="1.5" fill="#fff" opacity="0.9" />
            <circle cx="58" cy="144" r="1.8" fill={itColor2} opacity="0.75" />
          </g>
        );
      case 'balloon':
        return (
          <g className="animate-[bounce_4s_ease-in-out_infinite_alternate]">
            {/* Tied custom string looping to Orni's right side */}
            <path d="M 160,140 Q 185,115 174,84" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
            {/* Balloon Body */}
            <ellipse cx="174" cy="52" rx="17" ry="23" fill={itColor1} />
            <path d="M 174,74 C 172,78 176,78 174,74" stroke={itColor1} strokeWidth="2.5" />
            {/* Specular light highlights */}
            <ellipse cx="167" cy="43" rx="4" ry="7.5" fill="#ffffff" opacity={0.45} transform="rotate(-15 167 43)" />
            {/* Little heart imprint details on the balloon! */}
            <path d="M 174,53 C 178,48 181,54 174,58 C 167,54 170,48 174,53 Z" fill={itColor2} opacity={0.8} />
          </g>
        );
      case 'gamepad':
        return (
          <g className="animate-[bounce_2.5s_ease-in-out_infinite_alternate]">
            {/* Hovering pocket gamepad */}
            <rect x="22" y="132" width="31" height="19" rx="5.5" fill={itColor1} stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
            {/* Control十字 pad */}
            <path d="M 29,136 L 29,145 M 25,140 L 33,140" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            {/* Tiny buttons */}
            <circle cx="45" cy="138" r="2" fill={itColor2} />
            <circle cx="41" cy="143" r="2" fill="#f43f5e" />
          </g>
        );
      case 'drink':
        return (
          <g className="animate-[bounce_3.2s_ease-in-out_infinite_alternate]">
            {/* Plastic bubble tea cup sitting floating next to Orni */}
            <path d="M 156,134 L 161,168 A 3,3 0 0,0 168,171 L 173,168 L 178,134 Z" fill="rgba(255,255,255,0.78)" stroke="#d1d5db" strokeWidth="1" />
            {/* Tea Liquid Fill */}
            <path d="M 157.5,142 L 161.2,168 A 1.8,1.8 0 0,0 167.8,170.2 L 172.8,168 L 176.5,142 Z" fill={itColor1} opacity={0.9} />
            {/* Flat Lid */}
            <ellipse cx="167" cy="134" rx="11" ry="3" fill={itColor2} />
            {/* Straw */}
            <line x1="167" y1="134" x2="162" y2="118" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            {/* Bobas bubbles inside */}
            <circle cx="164" cy="161" r="2" fill="#1e293b" />
            <circle cx="170" cy="163" r="1.8" fill="#1e293b" />
            <circle cx="167" cy="154" r="2" fill="#1e293b" />
          </g>
        );
      case 'wings':
        return (
          <g>
            {/* Angel Wings at background both sides! */}
            {/* Left back wing */}
            <path
              d="M 38,110 C 6,94 14,146 38,124 Z"
              fill={itColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.15"
              opacity={0.88}
              style={{ filter: 'drop-shadow(-2px 2px 4px rgba(0,0,0,0.15))' }}
            />
            <path d="M 33,115 C 16,106 20,136 34,121" stroke={itColor2} strokeWidth="1" fill="none" opacity={0.8} />

            {/* Right back wing */}
            <path
              d="M 162,110 C 194,94 186,146 162,124 Z"
              fill={itColor1}
              stroke="#000"
              strokeWidth="1"
              strokeOpacity="0.15"
              opacity={0.88}
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.15))' }}
            />
            <path d="M 167,115 C 184,106 180,136 166,121" stroke={itColor2} strokeWidth="1" fill="none" opacity={0.8} />
          </g>
        );
      default:
        return null;
    }
  };

  const renderBody = (type?: string) => {
    const activeBody = type || bodyType;
    if (!activeBody || activeBody === 'none') return null;

    switch (activeBody) {
      case 'bowtie':
        return (
          <g>
            {/* Preppy bowtie at base of sphere (around X=100, Y=178) */}
            {/* Left bow wing */}
            <path d="M 100,178 Q 80,165 83,188 Z" fill={bdColor1} stroke="#000" strokeWidth="1" strokeOpacity="0.15" />
            <path d="M 98,178 Q 85,171 86,183 Z" fill={bdColor2} opacity={0.7} />
            {/* Right bow wing */}
            <path d="M 100,178 Q 120,165 117,188 Z" fill={bdColor1} stroke="#000" strokeWidth="1" strokeOpacity="0.15" />
            <path d="M 102,178 Q 115,171 114,183 Z" fill={bdColor2} opacity={0.7} />
            {/* Center knot knob */}
            <circle cx="100" cy="178" r="4.5" fill={bdColor2} stroke="#000" strokeWidth="0.5" />
          </g>
        );
      case 'necklace':
        return (
          <g>
            {/* Gold thick medallion dangling around bottom */}
            <path d="M 68,162 Q 100,196 132,162" fill="none" stroke={bdColor1} strokeWidth="3" />
            {/* Dangling medal pendant */}
            <line x1="100" y1="179" x2="100" y2="183" stroke={bdColor1} strokeWidth="2.2" />
            <circle cx="100" cy="188" r="8" fill={bdColor2} stroke="#b45309" strokeWidth="1" />
            {/* Star details inside pendant */}
            <path d="M 100,184 L 101.5,186.5 L 104,188 L 101.5,189.5 L 100,192 L 98.5,189.5 L 96,188 L 98.5,186.5 Z" fill="#fff" />
          </g>
        );
      case 'scarf':
        return (
          <g>
            {/* Cozy scarf wrapped snugly at the base */}
            <path
              d="M 68,170 H 132 A 10,12 0 0,1 120,183 H 80 A 10,12 0 0,1 68,170 Z"
              fill={bdColor1}
              stroke="#000"
              strokeWidth="0.7"
              strokeOpacity="0.1"
            />
            {/* Hanging scarf flap with fringes stripes */}
            <path d="M 114,178 V 199" stroke={bdColor2} strokeWidth="11" strokeLinecap="butt" />
            <line x1="114" y1="184" x2="114" y2="195" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3.5" />
            {/* Fringes */}
            <line x1="109" y1="199" x2="109" y2="203" stroke={bdColor1} strokeWidth="1.2" />
            <line x1="114" y1="199" x2="114" y2="203" stroke="#fff" strokeWidth="1" />
            <line x1="119" y1="199" x2="119" y2="203" stroke={bdColor1} strokeWidth="1.2" />
          </g>
        );
      case 'stickers':
        return (
          <g>
            {/* Adorable stickers on Orni's body */}
            {/* Star Sticker */}
            <path
              d="M 76,144 L 78,148 L 83,148 L 79,151 L 81,156 L 76,153 L 71,156 L 73,151 L 69,148 L 74,148 Z"
              fill={bdColor2}
              style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))' }}
            />
            {/* Heart Sticker */}
            <path
              d="M 124,146 C 127.5,141.5 131,146.5 124,151.5 C 117,146.5 120.5,141.5 124,146 Z"
              fill={bdColor1}
              style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))' }}
            />
          </g>
        );
      default:
        return null;
    }
  };

  // Handle particle physics simulation loop
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity effect
            size: Math.max(0, p.size - 0.18),
          }))
          .filter((p) => p.size > 0.1)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles]);

  // Create an electric spark sound effect using Web Audio API on click
  const playCrackSound = (frequency: number, duration: number, type: 'sine' | 'sawtooth' | 'triangle' | 'square' = 'triangle') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      // Frequency sweep down for cracking sound feel
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be blocked or blocked before interactions
    }
  };

  // Handle clicking on the blue sphere to crack/charge it
  const handleSphereClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state !== 'initial') return;
    
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 200);

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    // Play tactile electric synthesizer sound
    const frequencies = [150, 240, 380, 520, 680, 900];
    const clickFreq = frequencies[Math.min(clickCount, frequencies.length - 1)];
    playCrackSound(clickFreq, 0.25, 'triangle');

    // Spawn sparks locally on click
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clickParticles: Particle[] = Array.from({ length: 12 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        return {
          id: `click-${Date.now()}-${i}-${Math.random()}`,
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 6 + 3,
          color: '#60a5fa',
        };
      });
      setParticles((prev) => [...prev, ...clickParticles]);
    }

    if (nextCount >= maxClicks) {
      // Play louder explosion/break sound
      playCrackSound(120, 0.7, 'sawtooth');
      setTimeout(() => {
        playCrackSound(60, 1.2, 'square');
      }, 100);
      triggerExplosion();
    }
  };

  const triggerExplosion = () => {
    // Generate massive burst particles
    const explosionParticles: Particle[] = Array.from({ length: 65 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      const colors = ['#3b82f6', '#60a5fa', '#38bdf8', '#54d3ee', '#34d399', '#ffffff'];
      return {
        id: `explosion-${Date.now()}-${i}-${Math.random()}`,
        x: 100,
        y: 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setParticles((prev) => [...prev, ...explosionParticles]);
    onEvolved();
  };

  // Generate path coordinates for segment-by-segment rendering of lightning bolt (raio)
  // Segment points mapping out a beautiful high-contrast lightning path
  const getLightningPath = () => {
    if (clickCount === 0) return '';
    if (clickCount === 1) return 'M100,20 L130,60';
    if (clickCount === 2) return 'M100,20 L130,60 L75,100';
    if (clickCount === 3) return 'M100,20 L130,60 L75,100 L140,140';
    return 'M100,20 L130,60 L75,100 L140,140 L105,185'; // 4 or more clicks renders the full length
  };

  return (
    <div className="flex flex-col items-center">
      <div
        id="orni-sphere-container"
        ref={containerRef}
        onClick={state === 'initial' ? handleSphereClick : undefined}
        onPointerDown={state === 'evolved' ? onPointerDown : undefined}
        onPointerUp={state === 'evolved' ? onPointerUp : undefined}
        onPointerCancel={state === 'evolved' ? onPointerUp : undefined}
        onPointerLeave={state === 'evolved' ? onPointerUp : undefined}
        onContextMenu={(e) => {
          if (state === 'evolved') {
            e.preventDefault();
          }
        }}
        className={`relative w-[220px] h-[220px] flex items-center justify-center select-none transition-transform duration-100 ${
          isShaking ? 'scale-95 translate-y-1' : ''
        } ${state === 'evolved' ? 'cursor-pointer active:scale-95 touch-none' : 'cursor-pointer active:scale-90'}`}
      >
        {/* Dynamic Spark Debris / Shatter pieces */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                borderRadius: '50%',
                boxShadow: `0 0 12px ${p.color}`,
              }}
            />
          ))}
        </div>

        {/* Outer Orbital / Shell guide lines in original state */}
        {state === 'initial' && (
          <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/20 scale-105 animate-[spin_50s_linear_infinite]" />
        )}

        <AnimatePresence mode="wait">
          {state === 'initial' && (
            <motion.div
              key="initial-clickable-sphere"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.1, opacity: 0, transition: { duration: 0.3 } }}
              className="relative w-[200px] h-[200px]"
            >
              {/* Textured Blue Sphere representing container */}
              <div
                id="bola-azul"
                className="w-full h-full rounded-full transition-all duration-300 relative overflow-hidden"
                style={{
                  background: getSphereGradient(false, false),
                  boxShadow: getSphereShadow(false, false),
                }}
              >
                {/* Visual cracks pattern styling */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              {/* Progressive lightning rendering on each click */}
              <svg className="absolute inset-0 pointer-events-none z-10 w-[200px] h-[200px]" viewBox="0 0 200 200">
                {/* Shadow path glowing neon behind */}
                <path
                  d={getLightningPath()}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={9}
                  strokeLinecap="round"
                  style={{
                    filter: 'blur(4px)',
                    opacity: clickCount > 0 ? 0.8 : 0,
                  }}
                />
                {/* Foreground bright lightning flash path */}
                <path
                  d={getLightningPath()}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={5}
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 0 6px #fff) drop-shadow(0 0 12px #0ea5e9)',
                    opacity: clickCount > 0 ? 1 : 0,
                  }}
                />
              </svg>

              {/* Accessories SVG Overlay - positioned relative above but not clipped by bola-azul */}
              <svg className="absolute inset-0 pointer-events-none z-20 w-[200px] h-[200px]" viewBox="0 0 200 200">
                {itemList.includes('wings') && <g key="wings">{renderItem('wings')}</g>}
                {bodyList.map((b) => <g key={`body-${b}`}>{renderBody(b)}</g>)}
                {hatList.map((h) => <g key={`hat-${h}`}>{renderHat(h)}</g>)}
                {capList.map((c) => <g key={`cap-${c}`}>{renderCap(c)}</g>)}
                {glassesList.map((g) => <g key={`glasses-${g}`}>{renderGlasses(g)}</g>)}
                {itemList.filter((i) => i !== 'wings').map((i) => <g key={`item-${i}`}>{renderItem(i)}</g>)}
              </svg>

              {/* Information labels overlay when idle or partially cracked */}
              <div className="absolute inset-x-0 bottom-6 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-30">
                <span className="text-[11px] font-mono tracking-widest text-sky-200 uppercase bg-blue-950/70 border border-blue-800/30 px-3 py-1 rounded-full shadow-lg animate-pulse">
                  {clickCount === 0 ? 'Clica para carregar' : `${Math.min(clickCount, 5)} / 5 Cargas`}
                </span>
              </div>
            </motion.div>
          )}

          {state === 'evolved' && (
            <div className="relative flex items-center justify-center">
              {/* Concentric Decorative Rings from Immersive UI */}
              <div className="absolute inset-[-25px] border border-dashed border-emerald-500/15 rounded-full animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-[-45px] border border-white/5 rounded-full opacity-60 animate-[pulse_3.5s_infinite_alternate]" />
              <div className="absolute inset-[-65px] border border-white/5 rounded-full opacity-35" />

              <motion.div
                key="evolved-sphere-active"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 3.5,
                    ease: 'easeInOut',
                  },
                  default: { duration: 0.6, type: 'spring' },
                }}
                className="relative w-[210px] h-[210px]"
              >
                {/* Pulse waves in background */}
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none scale-10" />
                <div
                  className="absolute inset-[-10px] rounded-full opacity-30 animate-pulse pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
                  }}
                />

                {/* Green-Blue Pulsing Sphere */}
                <div
                  className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: getSphereGradient(true, isListening || false),
                    boxShadow: getSphereShadow(true, isListening || false),
                  }}
                >
                  {/* Internal dynamic details/swirl to look alive */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                    className="absolute inset-[15px] rounded-full border border-teal-500/10 border-t-emerald-300/30 opacity-60"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    className="absolute inset-[30px] rounded-full border border-sky-400/10 border-b-sky-300/30 opacity-40"
                  />

                  <AnimatePresence>
                    {isListening ? (
                      <motion.div
                        key="sphere-listening"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-emerald-100 font-mono text-[10px] tracking-widest font-bold uppercase select-none p-2 text-center"
                      >
                        <Sparkles className="w-5 h-5 text-emerald-300 animate-bounce mb-1" />
                        <span>GRAVANDO</span>
                        <span className="text-[7.5px] text-emerald-200/80 font-sans tracking-wide lowercase mt-0.5">Solte para falar</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sphere-idle-animate"
                        className="absolute inset-0 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-350 text-slate-100 font-mono text-[10px] tracking-widest font-semibold uppercase text-center p-2"
                      >
                        <Sparkles className="w-6 h-6 text-emerald-100/90 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] mb-1" />
                        <span className="text-[9px] text-slate-200 font-sans font-medium tracking-wide">Segure</span>
                        <span className="text-[8px] text-slate-400 font-sans tracking-tight lowercase">para falar</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Accessories SVG Overlay on top of evolved sphere - scales correctly with viewBox */}
                <svg className="absolute inset-0 pointer-events-none z-30 w-full h-full animate-[none]" viewBox="0 0 200 200">
                  {itemList.includes('wings') && <g key="wings">{renderItem('wings')}</g>}
                  {bodyList.map((b) => <g key={`body-${b}`}>{renderBody(b)}</g>)}
                  {hatList.map((h) => <g key={`hat-${h}`}>{renderHat(h)}</g>)}
                  {capList.map((c) => <g key={`cap-${c}`}>{renderCap(c)}</g>)}
                  {glassesList.map((g) => <g key={`glasses-${g}`}>{renderGlasses(g)}</g>)}
                  {itemList.filter((i) => i !== 'wings').map((i) => <g key={`item-${i}`}>{renderItem(i)}</g>)}
                </svg>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {state === 'initial' && (
        <div className="mt-8 flex flex-col items-center max-w-sm text-center">
          <p className="text-slate-400 text-xs leading-relaxed font-sans max-w-xs">
            Cada clique acumula eletricidade. Clique consecutivamente na esfera azul para carregá-la e libertar a Orni!
          </p>
        </div>
      )}
    </div>
  );
}
