"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RagHit {
  kind: string;
  title: string;
  url: string;
}

const PERSONA_THEMES = {
  whis: {
    name: "Whis",
    icon: "🥋",
    accent: "from-cyan-400 to-amber-300",
    bgGlow: "rgba(34, 211, 238, 0.15)",
    bubbleBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-200",
    inputFocus: "focus:border-cyan-500/50 focus:ring-cyan-500/20",
    placeholder: "Demande conseil à l'ange Whis...",
    welcome: "Oh oh ! Bonjour jeune disciple. Comment puis-je guider vos pas dans l'Univers 7 aujourd'hui ?"
  },
  beerus: {
    name: "Beerus",
    icon: "🪐",
    accent: "from-purple-500 to-pink-500",
    bgGlow: "rgba(168, 85, 247, 0.15)",
    bubbleBg: "bg-purple-500/10 border-purple-500/20 text-purple-200",
    inputFocus: "focus:border-purple-500/50 focus:ring-purple-500/20",
    placeholder: "Parle à Beerus le Destructeur...",
    welcome: "Mmmh ? Encore un mortel insignifiant. Sois bref ou je détruis ta planète entière !"
  },
  shenron: {
    name: "Shenron",
    icon: "🐉",
    accent: "from-emerald-500 to-amber-500",
    bgGlow: "rgba(16, 185, 129, 0.15)",
    bubbleBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
    inputFocus: "focus:border-emerald-500/50 focus:ring-emerald-500/20",
    placeholder: "Exprime ton souhait au Dragon Sacré...",
    welcome: "Je suis Shenron. Je t'écoute. Exprime ton souhait et je l'exaucerai dans la limite de mes pouvoirs."
  }
};

type PersonaId = keyof typeof PERSONA_THEMES;

export function FloatingAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<PersonaId>("whis");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageContext, setPageContext] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const theme = PERSONA_THEMES[persona];

  // Détecter les changements de page pour mettre à jour le contexte
  useEffect(() => {
    if (typeof window !== "undefined") {
      const title = document.title || "Wiki Dragon Ball";
      setPageTitle(title);
      
      // Recherche de l'élément contenant le texte principal de la fiche wiki
      const mainContentEl = document.querySelector("article") || 
                            document.querySelector("#wiki-content") || 
                            document.querySelector(".prose") || 
                            document.querySelector("main");
      
      let text = "";
      if (mainContentEl) {
        // Extraire le texte brut, nettoyer les espaces blancs et sauts de ligne excessifs
        text = (mainContentEl.textContent || "")
          .replace(/\s+/g, " ")
          .replace(/[\n\r\t]/g, " ")
          .trim();
        
        // Tronquer le texte pour éviter des requêtes URL excessivement lourdes
        if (text.length > 2500) {
          text = text.substring(0, 2500) + "...";
        }
      }
      
      const contextString = `L'utilisateur consulte actuellement la page ${pathname} ("${title}"). Voici le contenu textuel de cette page pour vous guider :\n${text}`;
      setPageContext(contextString);
    }
  }, [pathname]);

  // Réinitialiser les messages de bienvenue à chaque changement de persona
  useEffect(() => {
    setMessages([
      { role: "assistant", content: PERSONA_THEMES[persona].welcome }
    ]);
  }, [persona]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Session stable par navigateur -> mémoire de conversation côté bot.
      let sid = "";
      try {
        sid = localStorage.getItem("dbfr_chat_session") || "";
        if (!sid) {
          sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
          localStorage.setItem("dbfr_chat_session", sid);
        }
      } catch {
        /* localStorage indisponible */
      }
      const url = `/api/chat?q=${encodeURIComponent(userMessage)}&persona=${persona}&context=${encodeURIComponent(pageContext)}${sid ? `&session=${encodeURIComponent(sid)}` : ""}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error("Erreur serveur lors de l'appel chat");
      }

      const data = await res.json();
      const botResponse = data.answer || "Même les dieux restent muets sur cette question...";
      
      setMessages((prev) => [...prev, { role: "assistant", content: botResponse }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Une perturbation cosmique empêche la communication. Veuillez réessayer." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Fenêtre de Chat */}
      {isOpen && (
        <div
          className="mb-4 w-96 h-[520px] rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right"
          style={{ boxShadow: `0 10px 30px -5px ${theme.bgGlow}` }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{theme.icon}</span>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-1.5">
                    Conseil de l'Univers 7
                  </h3>
                  <p className="text-[10px] text-zinc-400 max-w-[200px] truncate">
                    Sur : {pageTitle.replace(" — DBFR", "")}
                  </p>
                </div>
              </div>
              
              {/* Sélecteur de Persona */}
              <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                {(Object.keys(PERSONA_THEMES) as PersonaId[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPersona(p)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      persona === p
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {PERSONA_THEMES[p].name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-none"
                      : `${theme.bubbleBg} border rounded-bl-none`
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl text-sm leading-relaxed border mr-auto max-w-[85%] bg-white/5 border-white/5">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulaire d'envoi */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={theme.placeholder}
              className={`flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all ${theme.inputFocus}`}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`bg-gradient-to-r ${theme.accent} text-black font-semibold text-xs px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none`}
            >
              Envoyer
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-14 h-14 rounded-full bg-zinc-900 border border-white/10 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group`}
      >
        {/* Anneau lumineux en dégradé */}
        <div
          className={`absolute inset-[-2px] rounded-full bg-gradient-to-r ${theme.accent} opacity-50 blur-sm group-hover:opacity-100 transition-opacity duration-300`}
        />
        <div className="absolute inset-[1px] rounded-full bg-zinc-950 flex items-center justify-center font-semibold text-lg z-10">
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span className="text-xl">{theme.icon}</span>
          )}
        </div>
      </button>
    </div>
  );
}
