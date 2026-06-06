import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, Mic, Volume2, HelpCircle, Code, Settings, Menu, X } from 'lucide-react';
import OrniSphere from './components/OrniSphere';
import ChatPanel from './components/ChatPanel';
import VoiceSettings from './components/VoiceSettings';
import SphereCustomizer from './components/SphereCustomizer';
import { Message, VoiceConfig, OrniState } from './types';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function App() {
  const [orniState, setOrniState] = useState<OrniState>('initial');
  
  // Customization States (supporting dual colors for gradient/highlight styling)
  const [sphereColor1, setSphereColor1] = useState<string>('#2563eb');
  const [sphereColor2, setSphereColor2] = useState<string>('#a855f7');
  const [hatType, setHatType] = useState<string>('none');
  const [hatColor1, setHatColor1] = useState<string>('#2563eb');
  const [hatColor2, setHatColor2] = useState<string>('#a855f7');
  const [glassesType, setGlassesType] = useState<string>('none');
  const [glassesColor1, setGlassesColor1] = useState<string>('#2563eb');
  const [glassesColor2, setGlassesColor2] = useState<string>('#a855f7');

  // New customization hooks for Caps, Items and Body options
  const [capType, setCapType] = useState<string>('none');
  const [capColor1, setCapColor1] = useState<string>('#2563eb');
  const [capColor2, setCapColor2] = useState<string>('#a855f7');
  const [itemType, setItemType] = useState<string>('none');
  const [itemColor1, setItemColor1] = useState<string>('#fbbf24');
  const [itemColor2, setItemColor2] = useState<string>('#38bdf8');
  const [bodyType, setBodyType] = useState<string>('none');
  const [bodyColor1, setBodyColor1] = useState<string>('#ef4444');
  const [bodyColor2, setBodyColor2] = useState<string>('#fbbf24');

  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  // Voice Synthesis Configuration
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    voiceURI: '',
    pitch: 1.1, // slightly higher pitch for friendly alien vibe
    rate: 1.05,
    muted: false,
  });

  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem('orni_custom_api_key') || '';
  });

  const handleCustomApiKeyChange = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem('orni_custom_api_key', key);
  };

  // Check microphone and SpeechRecognition support on mount
  useEffect(() => {
    if (SpeechRecognition) {
      setIsMicSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      // Auto-detect Portuguese or default
      rec.lang = 'pt-PT';
      
      rec.onstart = () => {
        setIsListening(true);
      };
      
      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText && resultText.trim()) {
          handleSendMessage(resultText);
        }
      };
      
      rec.onerror = (e: any) => {
        console.warn('Erro de reconhecimento de voz:', e.error);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(rec);
    } else {
      setIsMicSupported(false);
    }
  }, []);

  // Update voice synthesis state
  const speakText = (text: string) => {
    if (voiceConfig.muted || typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel current speaking
    window.speechSynthesis.cancel();

    // Remove asterisks or Markdown parts for cleaner speech output
    const cleanSpeech = text.replace(/[\*\_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    
    const allVoices = window.speechSynthesis.getVoices();
    
    if (voiceConfig.voiceURI) {
      const selectedVoice = allVoices.find((v) => v.voiceURI === voiceConfig.voiceURI);
      if (selectedVoice) utterance.voice = selectedVoice;
    } else {
      // Auto-choose a Portuguese speaking voice if none specified
      const ptVoice = allVoices.find((v) => 
        v.lang.toLowerCase().startsWith('pt-pt') || 
        v.lang.toLowerCase().startsWith('pt-br') ||
        v.lang.toLowerCase().startsWith('pt')
      );
      if (ptVoice) utterance.voice = ptVoice;
    }

    utterance.pitch = voiceConfig.pitch;
    utterance.rate = voiceConfig.rate;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleEvolved = () => {
    setOrniState('transitioning');
    
    // Delayed transition to welcome screen
    setTimeout(() => {
      setOrniState('evolved');
      const introMessage = "Olá! Eu sou a Orni. Finalmente livre! Qual é o teu nome?";
      
      // Add introduction message
      const initialMsg: Message = {
        id: 'intro',
        role: 'model',
        text: introMessage,
        timestamp: new Date(),
      };
      setMessages([initialMsg]);

      // Speak introduction
      setTimeout(() => {
        speakText(introMessage);
      }, 500);
    }, 1200);
  };

  const handleVoiceStart = () => {
    if (!recognition) return;
    
    // Stop anything Orni is speaking before listening to avoid echo loops
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    try {
      recognition.start();
    } catch (e) {
      console.warn('Recognition start caught:', e);
    }
  };

  const handleVoiceEnd = () => {
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (e) {
      console.warn('Recognition stop caught:', e);
    }
  };

  const toggleVoiceListen = () => {
    if (!recognition) return;
    if (isListening) {
      handleVoiceEnd();
    } else {
      handleVoiceStart();
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    // Create user message state
    const userMsg: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      role: 'user',
      text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      // POST payload with current prompt and recent historical sequence
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customApiKey) {
        headers['x-api-key'] = customApiKey;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          history: updatedMessages.slice(-8), // send last 8 messages for context
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.text) {
        const replyMsg: Message = {
          id: `model-${Date.now()}-${Math.random()}`,
          role: 'model',
          text: data.text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, replyMsg]);
        
        // Let Orni verbalize the text response loudly
        speakText(data.text);
      } else {
        throw new Error(data.error || 'Falha no servidor');
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        id: `error-${Date.now()}-${Math.random()}`,
        role: 'model',
        text: `Ups! Ocorreu um erro ao comunicar comigo: ${error.message || 'Verifica a ligação.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-200 font-sans flex flex-col justify-center items-center p-4 overflow-hidden relative selection:bg-teal-500/30">
      {/* Background Atmosphere Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-950/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] bg-indigo-950/20 rounded-full blur-[150px]" />
      </div>

      {/* Main Interactive Container */}
      <main className="w-full max-w-lg flex flex-col items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {orniState === 'initial' && (
            <motion.div
              key="charge-stage"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.3 } }}
              className="flex flex-col items-center justify-center space-y-8 w-full"
            >
              <div className="text-center space-y-2 px-4">
                <h1 className="text-3xl font-light tracking-wider text-white">
                  Esfera Eletrostática
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  Toca na esfera para carregar o raio dentro da camada azul, metade por metade!
                </p>
              </div>

              <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] backdrop-blur-lg flex items-center justify-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <OrniSphere 
                  state="initial" 
                  onEvolved={handleEvolved} 
                  sphereColor1={sphereColor1}
                  sphereColor2={sphereColor2}
                  hatType={hatType}
                  hatColor1={hatColor1}
                  hatColor2={hatColor2}
                  glassesType={glassesType}
                  glassesColor1={glassesColor1}
                  glassesColor2={glassesColor2}
                  capType={capType}
                  capColor1={capColor1}
                  capColor2={capColor2}
                  itemType={itemType}
                  itemColor1={itemColor1}
                  itemColor2={itemColor2}
                  bodyType={bodyType}
                  bodyColor1={bodyColor1}
                  bodyColor2={bodyColor2}
                />
              </div>
            </motion.div>
          )}

          {orniState === 'transitioning' && (
            <motion.div
              key="transition-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-[220px] flex flex-col justify-center items-center text-center space-y-4 bg-white/[0.02] border border-white/5 rounded-3xl p-10 max-w-sm w-full backdrop-blur-md"
            >
              <div className="relative">
                <div className="absolute inset-[-15px] bg-blue-500/15 rounded-full blur-[25px] animate-ping" />
                <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-spin">
                  <Sparkles className="w-6 h-6 text-blue-300" />
                </div>
              </div>
              <p className="text-xs font-mono text-blue-400 animate-pulse tracking-widest font-semibold uppercase">
                EMISSÃO ATINGIDA...
              </p>
            </motion.div>
          )}

          {orniState === 'evolved' && (
            <motion.div
              key="chat-stage"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="flex flex-col items-center justify-center space-y-6 w-full"
            >
              <div className="text-center space-y-1 px-4">
                <h1 className="text-4xl font-light tracking-wide text-emerald-400">
                  Orni
                </h1>
                <p className="text-emerald-500/60 text-[11px] tracking-widest uppercase font-mono">
                  Esfera Desbloqueada • Assistente Virtual Ativa
                </p>
              </div>

              <div className="p-6 bg-white/[0.01] border border-emerald-500/10 rounded-[30px] backdrop-blur-lg flex flex-col items-center justify-center shadow-2xl relative overflow-hidden w-full max-w-md">
                <div className="relative my-2 flex items-center justify-center">
                  <OrniSphere
                    state="evolved"
                    onEvolved={() => {}}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleVoiceStart();
                    }}
                    onPointerUp={(e) => {
                      e.preventDefault();
                      handleVoiceEnd();
                    }}
                    isListening={isListening}
                    sphereColor1={sphereColor1}
                    sphereColor2={sphereColor2}
                    hatType={hatType}
                    hatColor1={hatColor1}
                    hatColor2={hatColor2}
                    glassesType={glassesType}
                    glassesColor1={glassesColor1}
                    glassesColor2={glassesColor2}
                    capType={capType}
                    capColor1={capColor1}
                    capColor2={capColor2}
                    itemType={itemType}
                    itemColor1={itemColor1}
                    itemColor2={itemColor2}
                    bodyType={bodyType}
                    bodyColor1={bodyColor1}
                    bodyColor2={bodyColor2}
                  />
                </div>

                <button
                  onClick={() => {
                    setOrniState('initial');
                    setMessages([]);
                  }}
                  className="mt-4 px-5 py-2 bg-blue-900/20 hover:bg-blue-800/30 border border-blue-500/20 rounded-xl text-[10px] uppercase tracking-wider font-mono font-medium text-blue-300 pointer-events-auto transition cursor-pointer hover:scale-105 active:scale-95"
                >
                  Carregar Outra Vez!
                </button>
              </div>

              <ChatPanel
                messages={messages}
                isThinking={isThinking}
                isSpeaking={isSpeaking}
                isListening={isListening}
                isMicSupported={isMicSupported}
                onSendMessage={handleSendMessage}
                onToggleListen={toggleVoiceListen}
              />

              <VoiceSettings
                config={voiceConfig}
                onChange={setVoiceConfig}
                customApiKey={customApiKey}
                onCustomApiKeyChange={handleCustomApiKeyChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time customization panel right under constraints */}
        {orniState !== 'transitioning' && (
          <AnimatePresence>
            {isCustomizerOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="mt-6 w-full flex justify-center overflow-hidden"
              >
                <SphereCustomizer
                  sphereColor1={sphereColor1}
                  setSphereColor1={setSphereColor1}
                  sphereColor2={sphereColor2}
                  setSphereColor2={setSphereColor2}
                  hatType={hatType}
                  setHatType={setHatType}
                  hatColor1={hatColor1}
                  setHatColor1={setHatColor1}
                  hatColor2={hatColor2}
                  setHatColor2={setHatColor2}
                  glassesType={glassesType}
                  setGlassesType={setGlassesType}
                  glassesColor1={glassesColor1}
                  setGlassesColor1={setGlassesColor1}
                  glassesColor2={glassesColor2}
                  setGlassesColor2={setGlassesColor2}
                  capType={capType}
                  setCapType={setCapType}
                  capColor1={capColor1}
                  setCapColor1={setCapColor1}
                  capColor2={capColor2}
                  setCapColor2={setCapColor2}
                  itemType={itemType}
                  setItemType={setItemType}
                  itemColor1={itemColor1}
                  setItemColor1={setItemColor1}
                  itemColor2={itemColor2}
                  setItemColor2={setItemColor2}
                  bodyType={bodyType}
                  setBodyType={setBodyType}
                  bodyColor1={bodyColor1}
                  setBodyColor1={setBodyColor1}
                  bodyColor2={bodyColor2}
                  setBodyColor2={setBodyColor2}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Floating Hamburger Menu button made of three straight lines */}
      {orniState !== 'transitioning' && (
        <button
          onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
          className={`fixed top-6 right-6 z-50 p-3.5 rounded-full border shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group ${
            isCustomizerOpen
              ? 'bg-rose-950/80 hover:bg-rose-900/90 border-rose-500/30 text-rose-300 scale-105'
              : 'bg-slate-900/90 hover:bg-slate-800/95 border-white/10 text-slate-300 hover:text-white'
          }`}
          id="customizer-hamburger-btn"
          title="Customizar Esfera e Acessórios"
        >
          {isCustomizerOpen ? (
            <>
              <X className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest hidden sm:inline-block">Fechar</span>
            </>
          ) : (
            <>
              <Menu className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest hidden sm:inline-block">Customizar 🛠️</span>
            </>
          )}
        </button>
      )}

      {/* Embedded Ambient Sound Credit and Mode Tracker */}
      <span className="absolute bottom-6 text-[10px] uppercase font-mono tracking-widest text-slate-600 pointer-events-none">
        ÁUDIO SINTETIZADOR DINÂMICO ATIVO
      </span>
    </div>
  );
}
