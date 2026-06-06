import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, Sliders, PlayCircle } from 'lucide-react';
import { VoiceConfig } from '../types';

interface VoiceSettingsProps {
  config: VoiceConfig;
  onChange: (newConfig: VoiceConfig) => void;
  customApiKey: string;
  onCustomApiKeyChange: (key: string) => void;
}

export default function VoiceSettings({ config, onChange, customApiKey, onCustomApiKeyChange }: VoiceSettingsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };

    loadVoices();
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Filter voices for Portuguese/Spanish/English or default
  const filteredVoices = voices.filter((v) => {
    const lang = v.lang.toLowerCase();
    return lang.includes('pt') || lang.includes('en') || lang.includes('es');
  });

  const displayVoices = filteredVoices.length > 0 ? filteredVoices : voices;

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...config, voiceURI: e.target.value });
  };

  const handleSliderChange = (key: 'pitch' | 'rate', val: number) => {
    onChange({ ...config, [key]: val });
  };

  const toggleMute = () => {
    onChange({ ...config, muted: !config.muted });
  };

  const testVoice = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance("Olá, eu sou a Orni! O meu sintetizador de voz está de perfeita saúde.");
    
    // Assign voice
    if (config.voiceURI) {
      const selectedVoice = voices.find((v) => v.voiceURI === config.voiceURI);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    utterance.pitch = config.pitch;
    utterance.rate = config.rate;
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 w-full max-w-md backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">Painel de Voz da Orni</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Test Voice Shortcut */}
          <button
            onClick={testVoice}
            disabled={config.muted}
            title="Testar Voz"
            className="p-1 px-2.5 rounded-lg bg-emerald-950 hover:bg-emerald-900/80 text-emerald-300 text-xs flex items-center gap-1 border border-emerald-800/60 disabled:opacity-50 transition"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Testar</span>
          </button>
          
          {/* Mute toggle button */}
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg border transition ${
              config.muted
                ? 'bg-rose-950/70 border-rose-800/60 text-rose-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title={config.muted ? 'Ativar Voz' : 'Silenciar Voz'}
          >
            {config.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Settings expand toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-lg border transition ${
              isOpen
                ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Ajustes de Áudio"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 text-xs">
          {/* Voice Selector */}
          <div className="space-y-1">
            <span className="text-slate-400 block font-medium">Sintetizador de Voz</span>
            <select
              value={config.voiceURI}
              onChange={handleVoiceChange}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
            >
              <option value="">-- Voz Padrão do Navegador --</option>
              {displayVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Speed slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Velocidade</span>
                <span className="font-mono text-emerald-400">{config.rate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={config.rate}
                onChange={(e) => handleSliderChange('rate', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Pitch slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Tom (Grave/Agudo)</span>
                <span className="font-mono text-emerald-400">{config.pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={config.pitch}
                onChange={(e) => handleSliderChange('pitch', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Custom API Key Config */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800/60">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 block font-medium">Chave API do Gemini</span>
              {!customApiKey ? (
                <span className="text-[10px] text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-900/40 font-mono">Padrão / Host</span>
              ) : (
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40 font-bold font-mono">Personalizada</span>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => onCustomApiKeyChange(e.target.value)}
                placeholder="Cole a sua chave (começa com AIzaSy)"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 pr-12 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
              />
              {customApiKey && (
                <button
                  type="button"
                  onClick={() => onCustomApiKeyChange('')}
                  className="absolute right-2 top-2 text-rose-400 hover:text-rose-300 text-[10px] bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 rounded px-1.5 py-0.5 cursor-pointer font-medium"
                  title="Restaurar padrão"
                >
                  Limpar
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Insira de graça uma chave obtida no <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-0.5">Google AI Studio</a> se houver erros de API no servidor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
