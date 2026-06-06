import React, { useState } from 'react';
import { Palette, Crown, Eye, Paintbrush, RefreshCw, Sparkles } from 'lucide-react';

interface SphereCustomizerProps {
  sphereColor1: string;
  setSphereColor1: (color: string) => void;
  sphereColor2: string;
  setSphereColor2: (color: string) => void;
  hatType: string;
  setHatType: (type: string) => void;
  hatColor1: string;
  setHatColor1: (color: string) => void;
  hatColor2: string;
  setHatColor2: (color: string) => void;
  glassesType: string;
  setGlassesType: (type: string) => void;
  glassesColor1: string;
  setGlassesColor1: (color: string) => void;
  glassesColor2: string;
  setGlassesColor2: (color: string) => void;

  // New Categories
  capType: string;
  setCapType: (type: string) => void;
  capColor1: string;
  setCapColor1: (color: string) => void;
  capColor2: string;
  setCapColor2: (color: string) => void;

  itemType: string;
  setItemType: (type: string) => void;
  itemColor1: string;
  setItemColor1: (color: string) => void;
  itemColor2: string;
  setItemColor2: (color: string) => void;

  bodyType: string;
  setBodyType: (type: string) => void;
  bodyColor1: string;
  setBodyColor1: (color: string) => void;
  bodyColor2: string;
  setBodyColor2: (color: string) => void;
}

const COLOR_PRESETS = [
  { id: '#2563eb', name: 'Azul', bg: 'bg-blue-600' },
  { id: '#a855f7', name: 'Roxo', bg: 'bg-purple-500' },
  { id: '#10b981', name: 'Verde', bg: 'bg-emerald-500' },
  { id: '#f43f5e', name: 'Rosa', bg: 'bg-rose-500' },
  { id: '#f59e0b', name: 'Laranja', bg: 'bg-amber-500' },
  { id: '#fbbf24', name: 'Dourado', bg: 'bg-yellow-500' },
  { id: '#ef4444', name: 'Vermelho', bg: 'bg-red-500' },
  { id: '#0ea5e9', name: 'Ciano', bg: 'bg-sky-400' },
];

const HAT_PRESETS = [
  { id: 'none', label: 'Sem Chapéu ❌', icon: '❌' },
  { id: 'mago', label: 'Chapéu Mago 🧙‍♂️', icon: '🧙‍♂️' },
  { id: 'cartola', label: 'Cartola Deluxe 🎩', icon: '🎩' },
  { id: 'cauboi', label: 'Caubói Vintage 🤠', icon: '🤠' },
  { id: 'coroa', label: 'Coroa Imperial 👑', icon: '👑' },
];

const CAP_PRESETS = [
  { id: 'none', label: 'Sem Boné ❌', icon: '❌' },
  { id: 'snapback', label: 'Snapback 🧢', icon: '🧢' },
  { id: 'propeller', label: 'Propulsor 🛸', icon: '🛸' },
  { id: 'bandana', label: 'Bandana 🏴‍☠️', icon: '🏴‍☠️' },
  { id: 'sweatband', label: 'Faixa Suor 🏃', icon: '🏃' },
];

const BONES_PRESETS = [
  { id: 'none', label: 'Sem Gorro ❌', icon: '❌' },
  { id: 'bone', label: 'Boné Lado 🧢', icon: '🧢' },
  { id: 'noel', label: 'Gorro Noel 🎅', icon: '🎅' },
  { id: 'festa', label: 'Cone Festa 🎉', icon: '🎉' },
  { id: 'pirata', label: 'Almirante 🏴‍☠️', icon: '🏴‍☠️' },
  { id: 'chef', label: 'Chef 👨‍🍳', icon: '👨‍🍳' },
  { id: 'bobo', label: 'Bobo Corte 🃏', icon: '🃏' },
];

const GLASSES_PRESETS = [
  { id: 'none', label: 'Sem Óculos ❌', icon: '❌' },
  { id: 'shades', label: 'Cyber Shades 🕶️', icon: '🕶️' },
  { id: 'geek', label: 'Geek Clássico 👓', icon: '👓' },
  { id: 'heart', label: 'Lentes Coração ❤️', icon: '❤️' },
  { id: 'monocle', label: 'Monóculo 🧐', icon: '🧐' },
  { id: 'estrela', label: 'Estrela ⭐', icon: '⭐' },
  { id: 'sci-fi', label: 'Visor Sci-Fi 🕶️', icon: '🕶️' },
];

const ITEM_PRESETS = [
  { id: 'none', label: 'Sem Item ❌', icon: '❌' },
  { id: 'wand', label: 'Varinha Mágica 🪄', icon: '🪄' },
  { id: 'balloon', label: 'Balão Flutuante 🎈', icon: '🎈' },
  { id: 'gamepad', label: 'Gamepad Retro 🎮', icon: '🎮' },
  { id: 'drink', label: 'Bubble Tea 🧋', icon: '🧋' },
  { id: 'wings', label: 'Asas de Anjo 👼', icon: '👼' },
];

const BODY_PRESETS = [
  { id: 'none', label: 'Sem Enfeite ❌', icon: '❌' },
  { id: 'bowtie', label: 'Gravata Borboleta 🎀', icon: '🎀' },
  { id: 'necklace', label: 'Medalhão Ouro 🏅', icon: '🏅' },
  { id: 'scarf', label: 'Cachecol Cozy 🧣', icon: '🧣' },
  { id: 'stickers', label: 'Adesivos Fofos ⭐', icon: '⭐' },
];

const LEGACY_ITENS_PRESETS = [
  { id: 'none_item', label: 'Limpar Pet ❌', icon: '❌', slot: 'both' },
  { id: 'gato', label: 'Pet Gato 🐱', icon: '🐱', slot: 'hat' },
  { id: 'coelho', label: 'Pet Coelho 🐰', icon: '🐰', slot: 'hat' },
  { id: 'halo', label: 'Auréola Anjo 😇', icon: '😇', slot: 'hat' },
  { id: 'chifres', label: 'Chifres Diabo 😈', icon: '😈', slot: 'hat' },
  { id: 'fone', label: 'Headphones 🎧', icon: '🎧', slot: 'hat' },
  { id: 'flores', label: 'Coroa de Flores 🌸', icon: '🌸', slot: 'hat' },
  { id: 'capacete', label: 'Capacete Astro 👩‍🚀', icon: '👩‍🚀', slot: 'hat' },
  { id: 'mascara', label: 'Máscara Baile 🎭', icon: '🎭', slot: 'glasses' },
  { id: 'tapaolho', label: 'Tapa-Olho 🏴‍☠️', icon: '🏴‍☠️', slot: 'glasses' },
  { id: 'bigode', label: 'Bigode Velho 👨', icon: '👨', slot: 'glasses' },
  { id: 'blush', label: 'Blush Fofinho 😊', icon: '😊', slot: 'glasses' },
  { id: 'laço', label: 'Laço Rosa 🎀', icon: '🎀', slot: 'glasses' },
];

type ActiveTab = 'corpo' | 'chapeus' | 'bones' | 'oculos' | 'itens';

export default function SphereCustomizer({
  sphereColor1,
  setSphereColor1,
  sphereColor2,
  setSphereColor2,
  hatType,
  setHatType,
  hatColor1,
  setHatColor1,
  hatColor2,
  setHatColor2,
  glassesType,
  setGlassesType,
  glassesColor1,
  setGlassesColor1,
  glassesColor2,
  setGlassesColor2,
  capType,
  setCapType,
  capColor1,
  setCapColor1,
  capColor2,
  setCapColor2,
  itemType,
  setItemType,
  itemColor1,
  setItemColor1,
  itemColor2,
  setItemColor2,
  bodyType,
  setBodyType,
  bodyColor1,
  setBodyColor1,
  bodyColor2,
  setBodyColor2,
}: SphereCustomizerProps) {
  const [syncColors, setSyncColors] = useState<boolean>(true);
  const [activeTab, setActiveTab2] = useState<ActiveTab>('corpo');

  // Unified color synchronizer
  const updateSphereColor1 = (c: string) => {
    setSphereColor1(c);
    if (syncColors) {
      setHatColor1(c);
      setGlassesColor1(c);
      setCapColor1(c);
      setBodyColor1(c);
    }
  };

  const updateSphereColor2 = (c: string) => {
    setSphereColor2(c);
    if (syncColors) {
      setHatColor2(c);
      setGlassesColor2(c);
      setCapColor2(c);
      setBodyColor2(c);
    }
  };

  const updateHatColor1 = (c: string) => setHatColor1(c);
  const updateHatColor2 = (c: string) => setHatColor2(c);
  const updateCapColor1 = (c: string) => setCapColor1(c);
  const updateCapColor2 = (c: string) => setCapColor2(c);
  const updateGlassesColor1 = (c: string) => setGlassesColor1(c);
  const updateGlassesColor2 = (c: string) => setGlassesColor2(c);
  const updateItemColor1 = (c: string) => setItemColor1(c);
  const updateItemColor2 = (c: string) => setItemColor2(c);
  const updateBodyColor1 = (c: string) => setBodyColor1(c);
  const updateBodyColor2 = (c: string) => setBodyColor2(c);

  const toggleItemInString = (current: string, id: string) => {
    if (id === 'none' || id === 'none_item') return 'none';
    const items = (current || 'none').split(',').map((s) => s.trim()).filter((s) => s && s !== 'none');
    if (items.includes(id)) {
      const filtered = items.filter((i) => i !== id);
      return filtered.length > 0 ? filtered.join(',') : 'none';
    } else {
      const added = [...items, id];
      return added.join(',');
    }
  };

  const isHatActive = (id: string) => {
    if (id === 'none') {
      return !hatType || hatType === 'none';
    }
    return (hatType || '').split(',').map((s) => s.trim()).includes(id);
  };

  const isCapActive = (id: string) => {
    if (id === 'none') {
      return !capType || capType === 'none';
    }
    return (capType || '').split(',').map((s) => s.trim()).includes(id);
  };

  const isGlassesActive = (id: string) => {
    if (id === 'none') {
      return !glassesType || glassesType === 'none';
    }
    return (glassesType || '').split(',').map((s) => s.trim()).includes(id);
  };

  const isItemActive = (id: string) => {
    if (id === 'none') {
      return !itemType || itemType === 'none';
    }
    return (itemType || '').split(',').map((s) => s.trim()).includes(id);
  };

  const isBodyActive = (id: string) => {
    if (id === 'none') {
      return !bodyType || bodyType === 'none';
    }
    return (bodyType || '').split(',').map((s) => s.trim()).includes(id);
  };

  // Checks and actions for legacy items (which overlap hats or glasses slots)
  const isLegacyItemSelected = (item: typeof LEGACY_ITENS_PRESETS[0]) => {
    if (item.id === 'none_item') {
      const activeHats = (hatType || '').split(',').map((s) => s.trim());
      const activeGlasses = (glassesType || '').split(',').map((s) => s.trim());
      const hasLegacyHat = LEGACY_ITENS_PRESETS.some((i) => i.slot === 'hat' && activeHats.includes(i.id));
      const hasLegacyGlasses = LEGACY_ITENS_PRESETS.some((i) => i.slot === 'glasses' && activeGlasses.includes(i.id));
      return !hasLegacyHat && !hasLegacyGlasses;
    }
    if (item.slot === 'hat') return isHatActive(item.id);
    if (item.slot === 'glasses') return isGlassesActive(item.id);
    return false;
  };

  const handleSelectLegacyItem = (item: typeof LEGACY_ITENS_PRESETS[0]) => {
    if (item.id === 'none_item') {
      // Clear legacy items from hatType
      const activeHats = (hatType || '').split(',').map((s) => s.trim());
      const nonLegacyHats = activeHats.filter(h => !LEGACY_ITENS_PRESETS.some(l => l.slot === 'hat' && l.id === h));
      setHatType(nonLegacyHats.length > 0 ? nonLegacyHats.join(',') : 'none');

      // Clear legacy items from glassesType
      const activeGlasses = (glassesType || '').split(',').map((s) => s.trim());
      const nonLegacyGlasses = activeGlasses.filter(g => !LEGACY_ITENS_PRESETS.some(l => l.slot === 'glasses' && l.id === g));
      setGlassesType(nonLegacyGlasses.length > 0 ? nonLegacyGlasses.join(',') : 'none');
    } else if (item.slot === 'hat') {
      setHatType(toggleItemInString(hatType, item.id));
    } else if (item.slot === 'glasses') {
      setGlassesType(toggleItemInString(glassesType, item.id));
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-950/90 border border-slate-800 backdrop-blur-2xl p-5 rounded-[28px] text-left space-y-5 shadow-2xl relative overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      {/* Dynamic light glows in backdrop */}
      <div 
        className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-colors duration-500" 
        style={{ backgroundColor: `${sphereColor1}15` }}
      />
      <div 
        className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-colors duration-500" 
        style={{ backgroundColor: `${sphereColor2 || sphereColor1}15` }}
      />

      {/* Title Header with Synchronize feature */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-4 h-4 text-sky-400" />
          <h3 className="text-[11px] font-bold tracking-wider text-slate-300 font-mono uppercase">
            Estúdio de Criação 🛠️
          </h3>
        </div>

        {/* Sync Colors Toggle */}
        <button
          onClick={() => {
            const next = !syncColors;
            setSyncColors(next);
            if (next) {
              setHatColor1(sphereColor1);
              setHatColor2(sphereColor2 || sphereColor1);
              setGlassesColor1(sphereColor1);
              setGlassesColor2(sphereColor2 || sphereColor1);
              setCapColor1(sphereColor1);
              setCapColor2(sphereColor2 || sphereColor1);
              setBodyColor1(sphereColor1);
              setBodyColor2(sphereColor2 || sphereColor1);
            }
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all duration-300 cursor-pointer ${
            syncColors
              ? 'bg-sky-500/15 border-sky-500/35 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.15)]'
              : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
          }`}
          title="Sincronizar as cores da esfera com os acessórios automaticamente"
        >
          <RefreshCw className={`w-3 h-3 ${syncColors ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          <span>Sincronizar Cores 🔄</span>
        </button>
      </div>

      {/* Tabs Menu buttons based on Portuguese parameters requested by user */}
      <div className="grid grid-cols-5 gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveTab2('corpo')}
          className={`py-2 rounded-xl text-[10px] font-mono tracking-tighter transition font-medium flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'corpo'
              ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🧪</span>
          <span>Corpo</span>
        </button>

        <button
          onClick={() => setActiveTab2('chapeus')}
          className={`py-2 rounded-xl text-[10px] font-mono tracking-tighter transition font-medium flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'chapeus'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🎩</span>
          <span>Chapéus</span>
        </button>

        <button
          onClick={() => setActiveTab2('bones')}
          className={`py-2 rounded-xl text-[10px] font-mono tracking-tighter transition font-medium flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'bones'
              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🧢</span>
          <span>Bonés</span>
        </button>

        <button
          onClick={() => setActiveTab2('oculos')}
          className={`py-2 rounded-xl text-[10px] font-mono tracking-tighter transition font-medium flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'oculos'
              ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🕶️</span>
          <span>Óculos</span>
        </button>

        <button
          onClick={() => setActiveTab2('itens')}
          className={`py-2 rounded-xl text-[10px] font-mono tracking-tighter transition font-medium flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'itens'
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">✨</span>
          <span>Itens</span>
        </button>
      </div>

      {/* Tab Panel Content Box */}
      <div className="min-h-[220px] flex flex-col justify-between">
        {/* TAB 1: CORPO / CORES & ENFEITES */}
        {activeTab === 'corpo' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            {/* Cores da Esfera */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold block uppercase">
                🎨 Cores da Esfera (Sólida ou Gradiente)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Primary Color Picker */}
              <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-2xl space-y-1">
                <span className="text-[8px] uppercase font-mono text-blue-400 tracking-wider font-bold block">Cor 1 (Base)</span>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={`cc1-${color.id}`}
                      onClick={() => updateSphereColor1(color.id)}
                      className="w-4 h-4 rounded-full border cursor-pointer hover:scale-110 active:scale-90 transition-all"
                      style={{
                        backgroundColor: color.id,
                        borderColor: sphereColor1 === color.id ? '#ffffff' : 'rgba(255,255,255,0.12)',
                        boxShadow: sphereColor1 === color.id ? `0 0 8px ${color.id}` : 'none',
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Secondary Color Picker */}
              <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] uppercase font-mono text-purple-400 tracking-wider font-bold">Cor 2 (Gradiente)</span>
                  {sphereColor2 && (
                    <button
                      onClick={() => updateSphereColor2('')}
                      className="text-[8px] font-mono text-red-400 hover:text-red-300 uppercase font-bold"
                      title="Clique para desativar o gradiente e usar cor única"
                    >
                      [ Sólida ❌ ]
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={`cc2-${color.id}`}
                      onClick={() => updateSphereColor2(color.id)}
                      className="w-4 h-4 rounded-full border cursor-pointer hover:scale-110 active:scale-90 transition-all"
                      style={{
                        backgroundColor: color.id,
                        borderColor: sphereColor2 === color.id ? '#ffffff' : 'rgba(255,255,255,0.12)',
                        boxShadow: sphereColor2 === color.id ? `0 0 8px ${color.id}` : 'none',
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Body ornament category */}
            <div className="border-t border-white/5 pt-3.5 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold block uppercase">
                🎀 Enfeites de Corpo (Medalha, Cachecol, Gravata)
              </span>
              <div className="grid grid-cols-5 gap-1">
                {BODY_PRESETS.map((b) => {
                  const active = isBodyActive(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => setBodyType(toggleItemInString(bodyType, b.id))}
                      className={`p-2 rounded-xl text-[9px] font-medium border transition duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        active
                          ? 'bg-blue-500/10 border-blue-400/80 text-blue-200 shadow-[0_0_8px_rgba(59,130,246,0.1)]'
                          : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="text-lg leading-none">{b.icon}</span>
                      <span className="text-[8px] font-sans truncate max-w-full text-center">{b.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Adjust Body Ornament Colors */}
              {bodyType !== 'none' && bodyType !== '' && (
                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
                  <span className="text-[8px] text-blue-400 font-mono font-bold uppercase block">🎨 Cor do Enfeite de Peito:</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[7.5px] font-mono text-slate-500 block">Esquema 1</span>
                      <input
                        type="color"
                        value={bodyColor1}
                        onChange={(e) => updateBodyColor1(e.target.value)}
                        className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-[7.5px] font-mono text-slate-500 block">Esquema 2</span>
                      <input
                        type="color"
                        value={bodyColor2}
                        onChange={(e) => updateBodyColor2(e.target.value)}
                        className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CHAPÉUS */}
        {activeTab === 'chapeus' && (
          <div className="space-y-3.5 animate-[fadeIn_0.2s_ease-out]">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold block uppercase">
              🧙‍♂️ Chapéus de Elite
            </span>
            <div className="grid grid-cols-5 gap-1">
              {HAT_PRESETS.map((h) => {
                const active = isHatActive(h.id);
                return (
                  <button
                    key={h.id}
                    onClick={() => setHatType(toggleItemInString(hatType, h.id))}
                    className={`p-2 rounded-xl text-[9px] font-medium border transition duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      active
                        ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-200'
                        : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <span className="text-lg leading-none">{h.icon}</span>
                    <span className="text-[8px] font-sans truncate max-w-full text-center">{h.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Customizer specific hat coloring */}
            {hatType !== 'none' && hatType !== '' && (
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
                <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase block">🎨 Cor do Chapéu:</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[7.5px] font-mono text-slate-500 block">Cor Principal</span>
                    <input
                      type="color"
                      value={hatColor1}
                      onChange={(e) => updateHatColor1(e.target.value)}
                      className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[7.5px] font-mono text-slate-500 block">Cor Accent</span>
                    <input
                      type="color"
                      value={hatColor2}
                      onChange={(e) => updateHatColor2(e.target.value)}
                      className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BONÉS / BANDANAS */}
        {activeTab === 'bones' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            {/* New Cap system (snapback, propeller, bandana, sweatband) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold block uppercase">
                🧢 Bonés Esportivos & Bandanas
              </span>
              <div className="grid grid-cols-5 gap-1">
                {CAP_PRESETS.map((cp) => {
                  const active = isCapActive(cp.id);
                  return (
                    <button
                      key={cp.id}
                      onClick={() => setCapType(toggleItemInString(capType, cp.id))}
                      className={`p-2 rounded-xl text-[9px] font-medium border transition duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        active
                          ? 'bg-amber-500/10 border-amber-400/80 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                          : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="text-lg leading-none">{cp.icon}</span>
                      <span className="text-[8px] font-sans truncate max-w-full text-center">{cp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Older style caps and Gorros mapped as hatType */}
            <div className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold block uppercase">
                🎅 Gorros de Lado e Cômicos
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {BONES_PRESETS.map((b) => {
                  const active = isHatActive(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => setHatType(toggleItemInString(hatType, b.id))}
                      className={`p-1.5 rounded-xl text-[8px] font-medium border transition duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        active
                          ? 'bg-amber-500/10 border-amber-400/80 text-amber-200'
                          : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="text-base leading-none">{b.icon}</span>
                      <span className="text-[7.5px] font-sans truncate max-w-full text-center">{b.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coloring cap / legacy bonnet */}
            {capType !== 'none' && capType !== '' && (
              <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
                <span className="text-[8px] text-amber-500 font-mono font-bold uppercase block">🎨 Cor do Boné Esportivo:</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[7.5px] font-mono text-slate-500 block">Cor Principal</span>
                    <input
                      type="color"
                      value={capColor1}
                      onChange={(e) => updateCapColor1(e.target.value)}
                      className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[7.5px] font-mono text-slate-500 block">Segunda Cor / Vira</span>
                    <input
                      type="color"
                      value={capColor2}
                      onChange={(e) => updateCapColor2(e.target.value)}
                      className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ÓCULOS */}
        {activeTab === 'oculos' && (
          <div className="space-y-3.5 animate-[fadeIn_0.2s_ease-out]">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold block uppercase">
              🕶️ Óculos e Viseiras Estilosas
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
              {GLASSES_PRESETS.map((g) => {
                const active = isGlassesActive(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => setGlassesType(toggleItemInString(glassesType, g.id))}
                    className={`p-1.5 rounded-xl text-[8px] font-medium border transition duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      active
                        ? 'bg-purple-500/10 border-purple-400/80 text-purple-200'
                        : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <span className="text-base leading-none">{g.icon}</span>
                    <span className="text-[7.5px] font-sans truncate max-w-full text-center">{g.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Customizer specific glasses coloring */}
            {glassesType !== 'none' && glassesType !== '' && (
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
                <span className="text-[8px] text-purple-400 font-mono font-bold uppercase block">🎨 Cor das Lentes:</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[7.5px] font-mono text-slate-500 block">Armação</span>
                    <input
                      type="color"
                      value={glassesColor1}
                      onChange={(e) => updateGlassesColor1(e.target.value)}
                      className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[7.5px] font-mono text-slate-500 block">Lentes</span>
                    <input
                      type="color"
                      value={glassesColor2}
                      onChange={(e) => updateGlassesColor2(e.target.value)}
                      className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ITENS & MASCOTES */}
        {activeTab === 'itens' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            {/* New Independent hand items (represented by itemType) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold block uppercase">
                ✨ Brinquedos & Efeitos (Novo Slot!)
              </span>
              <div className="grid grid-cols-6 gap-1">
                {ITEM_PRESETS.map((item) => {
                  const active = isItemActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setItemType(toggleItemInString(itemType, item.id))}
                      className={`p-1.5 rounded-xl text-[8px] font-medium border transition duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        active
                          ? 'bg-rose-500/10 border-rose-400/80 text-rose-200'
                          : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="text-base leading-none">{item.icon}</span>
                      <span className="text-[7px] font-sans truncate max-w-full text-center">{item.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Adjust Item colors */}
              {itemType !== 'none' && itemType !== '' && (
                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
                  <span className="text-[8px] text-rose-400 font-mono font-bold uppercase block">🎨 Cor do Pequeno Brinquedo / Efeito:</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[7.5px] font-mono text-slate-500 block">Detalle 1</span>
                      <input
                        type="color"
                        value={itemColor1}
                        onChange={(e) => updateItemColor1(e.target.value)}
                        className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-[7.5px] font-mono text-slate-500 block">Detalle 2</span>
                      <input
                        type="color"
                        value={itemColor2}
                        onChange={(e) => updateItemColor2(e.target.value)}
                        className="w-full h-5 rounded-md border border-white/15 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legacy item overlays supported by hatType / glassesType slots */}
            <div className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider font-bold block uppercase">
                🐱 Mascotes & Enfeites Rosto (Clássicos)
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 h-[90px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-white/10">
                {LEGACY_ITENS_PRESETS.map((item) => {
                  const active = isLegacyItemSelected(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectLegacyItem(item)}
                      className={`p-1 rounded-xl text-[8px] font-medium border transition duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        active
                          ? 'bg-rose-500/10 border-rose-400/80 text-rose-200'
                          : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="text-base leading-none">{item.icon}</span>
                      <span className="text-[7px] font-sans truncate max-w-full text-center">{item.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-[9px] text-slate-500 font-mono text-center pt-2 border-t border-white/5">
        Toque em qualquer separador para personalizar o visual completo da sua Orni!
      </div>
    </div>
  );
}
