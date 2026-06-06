import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Sparkles, User, AudioLines, Send, ExternalLink, Key } from 'lucide-react';
import { Message } from '../types';

interface ChatPanelProps {
  messages: Message[];
  isThinking: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isMicSupported: boolean;
  onSendMessage: (text: string) => void;
  onToggleListen: () => void;
}

export default function ChatPanel({
  messages,
  isThinking,
  isSpeaking,
  isListening,
  isMicSupported,
  onSendMessage,
  onToggleListen,
}: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, isSpeaking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isThinking) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col h-[400px] bg-slate-900/30 border border-slate-800/60 rounded-3xl relative overflow-hidden backdrop-blur-md">
      {/* Scrollable Message Caption Box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              A Orni está acordada!
            </p>
            <p className="text-xs text-slate-500">
              Usa o microfone em baixo para falar. Ela responderá de volta em voz alta!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] ${
                  msg.role === 'user'
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </div>

              {/* Message Caption Bubble */}
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-[12.5px] leading-relaxed relative ${
                  msg.role === 'user'
                    ? 'bg-sky-600/10 border border-sky-500/20 text-sky-200 rounded-tr-none'
                    : 'bg-slate-950/60 border border-emerald-500/10 text-slate-200 rounded-tl-none w-full'
                }`}
              >
                {msg.text.includes('GEMINI_API_KEY') ? (
                  <div className="space-y-3 p-1">
                    <div className="flex items-center gap-1.5 text-rose-450 font-bold text-xs border-b border-rose-500/10 pb-2">
                      <Key className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>Configurar Chave de API na Vercel</span>
                    </div>
                    <p className="text-[11.5px] text-slate-300 leading-normal">
                      Para que a Orni fale consigo no domínio <code className="text-emerald-400 bg-emerald-950/30 px-1 py-0.5 rounded">orniapp.vercel.app</code>, precisa de adicionar a sua chave GEMINI_API_KEY:
                    </p>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex gap-2 items-start bg-slate-900/40 p-2 rounded-xl border border-slate-800/80">
                        <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-300 text-[9px] mt-0.5">1</div>
                        <div className="flex-1 text-slate-300 text-[10.5px]">
                          Vá ao painel da <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-0.5 font-semibold">Vercel <ExternalLink className="w-2.5 h-2.5 inline" /></a>, clique no projeto <strong>orniapp</strong> e vá à aba <strong>Settings</strong> (Configurações).
                        </div>
                      </div>
                      <div className="flex gap-2 items-start bg-slate-900/40 p-2 rounded-xl border border-slate-800/80">
                        <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-300 text-[9px] mt-0.5">2</div>
                        <div className="flex-1 text-slate-300 space-y-1 text-[10.5px]">
                          <div>Clique em <strong>Environment Variables</strong> e crie uma nova variável:</div>
                          <div className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800 font-mono text-[9.5px] text-rose-400 select-all font-semibold inline-block">
                            GEMINI_API_KEY
                          </div>
                          <div>No campo <strong>Value</strong>, cole a chave obtida de graça no Google AI Studio (começa por <code className="text-slate-400 select-all font-mono">AIzaSy...</code>).</div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start bg-slate-900/40 p-2 rounded-xl border border-slate-800/80">
                        <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-300 text-[9px] mt-0.5">3</div>
                        <div className="flex-1 text-slate-300 text-[10.5px]">
                          Vá à aba <strong>Deployments</strong> (Implantações), clique nos <strong className="text-slate-100 font-semibold text-xs">...</strong> do deploy recente e clique em <strong>Redeploy</strong>.
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 text-[10px] text-emerald-400 font-medium text-center">
                      Recarregue a página após isso e fale livremente! ✨
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          ))
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center animate-spin">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-950/60 border border-teal-500/10 text-slate-400 py-2 px-3.5 rounded-2xl rounded-tl-none italic text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              A processar...
            </div>
          </div>
        )}

        {/* Speaking visualizer effect inside chat logs */}
        {isSpeaking && (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center animate-pulse">
              <AudioLines className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 py-1.5 px-3 rounded-2xl rounded-tl-none text-xs flex flex-col gap-1 w-full">
              <div className="flex items-center gap-1 font-medium">
                <AudioLines className="w-3 h-3 animate-bounce text-emerald-400" />
                <span>Orni está a responder por voz...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Voice Status Indicator Overlay */}
      {isListening && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-[-12px] rounded-full bg-emerald-500/15 animate-ping duration-[1200ms]" />
            <div className="w-[84px] h-[84px] rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center relative z-10 shadow-lg shadow-emerald-500/10">
              <Mic className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">A escutar...</h4>
            <p className="text-slate-500 text-[11px]">Diz o que queres e ela responderá imediatamente.</p>
          </div>
          <button
            onClick={onToggleListen}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 text-[11px] font-mono uppercase text-rose-400 border border-rose-900/30 rounded-xl cursor-pointer transition shadow-sm flex items-center gap-1"
          >
            <MicOff className="w-3 h-3" />
            <span>Pausar</span>
          </button>
        </div>
      )}


      {/* Input Action Panel - Replaced with instruction panel for holding the sphere */}
      <div className="p-4 bg-slate-950/85 border-t border-slate-800/80 flex flex-col items-center justify-center text-center space-y-2 py-5">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
          <Mic className="w-4 h-4 animate-pulse text-emerald-400" />
          <span>Segura na Orni para falar!</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-xs leading-normal">
          Pressiona e mantém premido o clique na esfera Orni para ativares a voz. Solta quando terminares de falar e ela responderá!
        </p>
        {!isMicSupported && (
          <div className="text-[10px] text-rose-450 font-mono flex items-center justify-center gap-1 border border-rose-900/40 bg-rose-950/20 px-2.5 py-1 rounded-xl">
            <MicOff className="w-3.5 h-3.5 animate-bounce" />
            <span>Permite o microfone no topo do teu navegador.</span>
          </div>
        )}
        <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest mt-1">
          Auto-Mute desativado • Resposta Automática Ativa
        </p>
      </div>
    </div>
  );
}
