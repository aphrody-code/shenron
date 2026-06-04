"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  Brain, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Zap, 
  Award,
  Sparkles
} from "lucide-react";
import { api } from "@/lib/admin-api";

interface EvalReport {
  rag: {
    chunkCount: number;
    date: string;
    rows: {
      mode: string;
      recall: Record<string, number>;
      mrr: number;
      ndcg: number;
      cases: number;
    }[];
    lexical: {
      recall5: number;
      mrr: number;
      ndcg: number;
      cases: number;
    };
  } | null;
  llm: {
    avgPersona: number;
    avgFact: number;
    avgConcise: number;
    evaluated: number;
    persona: string;
    date: string;
    resultsTable: {
      question: string;
      tone: string;
      facts: string;
      brevity: string;
      justification: string;
    }[];
  } | null;
}

interface CacheStats {
  hits: number;
  misses: number;
  total: number;
  hitRate: number;
}

export default function EvaluationsDashboard() {
  // Query pour les rapports d'évaluations (RAG & LLM)
  const { data: reports, isLoading: isReportsLoading, refetch: refetchReports } = useQuery<EvalReport>({
    queryKey: ["admin", "eval", "reports"],
    queryFn: () => api.get<EvalReport>("/public/eval/reports"),
    refetchInterval: 30000, // rafraîchir toutes les 30s
  });

  // Query pour les stats de cache sémantique
  const { data: cacheStats, isLoading: isCacheLoading, refetch: refetchCache } = useQuery<CacheStats>({
    queryKey: ["admin", "eval", "cache-stats"],
    queryFn: () => api.get<CacheStats>("/public/eval/cache-stats"),
    refetchInterval: 10000, // rafraîchir toutes les 10s pour le temps réel
  });

  const handleRefreshAll = () => {
    refetchReports();
    refetchCache();
  };

  const isLoading = isReportsLoading || isCacheLoading;

  // Calcul du statut global
  const ragScore = reports?.rag?.lexical.recall5 ?? 0;
  const llmScore = reports?.llm ? (reports.llm.avgPersona + reports.llm.avgFact + reports.llm.avgConcise) / 3 : 0;
  
  let globalStatus = "stable";
  let statusColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  let statusText = "Système Optimal (SOTA)";
  
  if (ragScore < 0.7 || (reports?.llm && llmScore < 3.5)) {
    globalStatus = "warning";
    statusColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
    statusText = "Attention : Pertinence ou Style en baisse";
  }
  if (ragScore < 0.5 || (reports?.llm && llmScore < 2.5)) {
    globalStatus = "danger";
    statusColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
    statusText = "Alerte : Dégradation majeure détectée";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-400" />
            LLM Factory & RAG Monitor
          </h1>
          <p className="text-sm text-zinc-400">
            Supervisez les performances de pertinence du RAG, les évaluations du Grand Prêtre et le cache sémantique Redis.
          </p>
        </div>
        <button
          onClick={handleRefreshAll}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm border border-zinc-700 transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Rafraîchir
        </button>
      </div>

      {/* Global Status Bar */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${statusColor} transition-all`}>
        <div className="flex items-center gap-3">
          {globalStatus === "stable" ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <AlertTriangle className="h-6 w-6" />
          )}
          <div>
            <div className="font-semibold text-white">{statusText}</div>
            <div className="text-xs opacity-80">
              Dernière évaluation RAG : {reports?.rag ? new Date(reports.rag.date).toLocaleString("fr-FR") : "Aucune"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
          <Clock className="h-3 w-3" />
          <span>Mise à jour automatique 30s</span>
        </div>
      </div>

      {/* Grid KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 : Recall@5 */}
        <div className="card">
          <div className="mb-2 flex items-center justify-between text-zinc-400">
            <h3 className="text-xs font-medium uppercase tracking-wide">RAG Recall@5</h3>
            <Database className="h-4 w-4 text-brand-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {reports?.rag ? `${(reports.rag.lexical.recall5 * 100).toFixed(1)}%` : "N/A"}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span className={ragScore >= 0.7 ? "text-emerald-400" : "text-rose-400"}>
              {ragScore >= 0.7 ? "✓ Supérieur au seuil" : "✗ Sous le seuil (70%)"}
            </span>
          </div>
        </div>

        {/* KPI 2 : Persona Tone */}
        <div className="card">
          <div className="mb-2 flex items-center justify-between text-zinc-400">
            <h3 className="text-xs font-medium uppercase tracking-wide">Score Style LLM</h3>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {reports?.llm ? `${reports.llm.avgPersona.toFixed(2)}/5` : "N/A"}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Évalué par le Grand Prêtre ({reports?.llm?.persona.toUpperCase()})</span>
          </div>
        </div>

        {/* KPI 3 : Semantic Cache Hit Rate */}
        <div className="card">
          <div className="mb-2 flex items-center justify-between text-zinc-400">
            <h3 className="text-xs font-medium uppercase tracking-wide">Taux Hit Cache</h3>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {cacheStats ? `${cacheStats.hitRate.toFixed(1)}%` : "0.0%"}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
            <span>{cacheStats?.hits ?? 0} hits sur {cacheStats?.total ?? 0} requêtes</span>
          </div>
        </div>

        {/* KPI 4 : Size of Index */}
        <div className="card">
          <div className="mb-2 flex items-center justify-between text-zinc-400">
            <h3 className="text-xs font-medium uppercase tracking-wide">Chunks Indexés</h3>
            <Cpu className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {reports?.rag?.chunkCount ? reports.rag.chunkCount.toLocaleString("fr-FR") : "N/A"}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
            <span>SQLite-vec + BM25 FTS5</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne 1 & 2 : Rapport détaillé */}
        <div className="lg:col-span-2 space-y-6">
          {/* Évaluation LLM (Grand Prêtre) */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-amber-400" />
                Jugement du Grand Prêtre (Dernier Run)
              </h2>
              {reports?.llm && (
                <span className="text-xs bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded text-zinc-300">
                  Persona : {reports.llm.persona.toUpperCase()}
                </span>
              )}
            </div>

            {reports?.llm ? (
              <div className="space-y-6">
                {/* Score breakdown */}
                <div className="grid grid-cols-3 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                  <div className="text-center">
                    <div className="text-xs text-zinc-400 uppercase font-medium">Style / Voix</div>
                    <div className="text-2xl font-bold text-amber-400 mt-1">{reports.llm.avgPersona.toFixed(2)}/5</div>
                  </div>
                  <div className="text-center border-x border-zinc-800">
                    <div className="text-xs text-zinc-400 uppercase font-medium">Exactitude RAG</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">{reports.llm.avgFact.toFixed(2)}/5</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-zinc-400 uppercase font-medium">Concision</div>
                    <div className="text-2xl font-bold text-blue-400 mt-1">{reports.llm.avgConcise.toFixed(2)}/5</div>
                  </div>
                </div>

                {/* Cas de test détaillés */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Questions évaluées</h3>
                  <div className="space-y-3">
                    {reports.llm.resultsTable.map((t, idx) => (
                      <div key={idx} className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-medium text-sm text-white">Q: "{t.question}"</span>
                          <div className="flex gap-2 text-xs font-mono shrink-0">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Style {t.tone}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Facts {t.facts}</span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 italic bg-black/20 p-2.5 rounded border border-zinc-800">
                          ⚖️ {t.justification}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                <Brain className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                Aucun rapport LLM disponible. Lancer le pipeline d'évaluation pour le générer.
              </div>
            )}
          </div>

          {/* Pertinence RAG détaillée */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-brand-400" />
                Détail de la pertinence de recherche (RAG)
              </h2>
            </div>

            {reports?.rag ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-3 font-medium">Mode de recherche</th>
                      <th className="py-3 font-medium text-center">Recall@1</th>
                      <th className="py-3 font-medium text-center">Recall@5</th>
                      <th className="py-3 font-medium text-center">MRR</th>
                      <th className="py-3 font-medium text-center">nDCG@10</th>
                      <th className="py-3 font-medium text-center">Cas testés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.rag.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-zinc-850 hover:bg-zinc-900/10">
                        <td className="py-3.5 font-medium text-white flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            row.mode.includes("rerank") ? "bg-emerald-400" :
                            row.mode.includes("hybrid") ? "bg-blue-400" : "bg-zinc-400"
                          }`} />
                          {row.mode}
                        </td>
                        <td className="py-3.5 text-center font-mono">{(row.recall["1"] * 100).toFixed(1)}%</td>
                        <td className="py-3.5 text-center font-mono">{(row.recall["5"] * 100).toFixed(1)}%</td>
                        <td className="py-3.5 text-center font-mono">{row.mrr.toFixed(3)}</td>
                        <td className="py-3.5 text-center font-mono">{row.ndcg.toFixed(3)}</td>
                        <td className="py-3.5 text-center text-zinc-400">{row.cases}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                <Database className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                Aucune donnée d'évaluation RAG disponible. Lancer le pipeline pour la calculer.
              </div>
            )}
          </div>
        </div>

        {/* Colonne 3 : Télémétrie du cache sémantique Redis */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Zap className="h-5 w-5 text-emerald-400" />
              Télémétrie Cache Sémantique
            </h2>

            {cacheStats ? (
              <div className="space-y-6">
                {/* Doughnut de Hit Rate */}
                <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/40 rounded-xl border border-zinc-800">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-zinc-800"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-emerald-500 transition-all duration-1000"
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={2 * Math.PI * 54 * (1 - cacheStats.hitRate / 100)}
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-bold text-white">{cacheStats.hitRate.toFixed(1)}%</span>
                      <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">Hit Rate</span>
                    </div>
                  </div>
                </div>

                {/* Détail numérique */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm py-1 border-b border-zinc-855">
                    <span className="text-zinc-400">Total requêtes RAG/LLM</span>
                    <span className="font-semibold text-white font-mono">{cacheStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-zinc-855">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Cache Hits
                    </span>
                    <span className="font-semibold text-emerald-400 font-mono">{cacheStats.hits}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-zinc-855">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Cache Misses (Inférences)
                    </span>
                    <span className="font-semibold text-zinc-300 font-mono">{cacheStats.misses}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-zinc-400">Économie d'appels API</span>
                    <span className="font-semibold text-emerald-400 font-mono">
                      {cacheStats.hits} appels
                    </span>
                  </div>
                </div>

                {/* Explication technique */}
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                  <div className="font-semibold text-zinc-300">Fonctionnement du Cache Sémantique</div>
                  <p>
                    Pour chaque question reçue, son embedding est calculé localement via le sidecar et comparé par similarité cosinus aux requêtes en cache stockées dans Redis.
                  </p>
                  <p className="text-emerald-500/80 font-medium font-mono text-[10px]">Seuil de similarité requis : {0.92 * 100}%</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                Impossible de charger les statistiques Redis.
              </div>
            )}
          </div>

          {/* Infos Infrastructure */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Shield className="h-5 w-5 text-blue-400" />
              Infrastructure LLM
            </h2>
            <div className="space-y-3.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Inférence par défaut</span>
                <span className="text-white font-medium">Gemini 2.x (aphrody)</span>
              </div>
              <div className="flex justify-between">
                <span>Modèle d'embedding local</span>
                <span className="text-white font-medium font-mono">multilingual-e5-small (q8)</span>
              </div>
              <div className="flex justify-between">
                <span>Modèle de reranking local</span>
                <span className="text-white font-medium font-mono">bge-reranker-base (q8)</span>
              </div>
              <div className="flex justify-between">
                <span>Seuil de confiance RAG</span>
                <span className="text-white font-medium font-mono">Score cosinus &gt;= 0.72</span>
              </div>
              <div className="flex justify-between">
                <span>Inférence locale CPU</span>
                <span className="text-white font-medium">llama.cpp fallback (3B GGUF)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
