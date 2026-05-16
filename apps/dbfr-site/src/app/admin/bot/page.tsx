const SHENRON_API_URL = process.env.SHENRON_API_URL || "https://shenron.rpbey.fr";

export const dynamic = "force-dynamic";

export default async function AdminBotStatus() {
  const healthRes = await fetch(`${SHENRON_API_URL}/health/check`, { cache: 'no-store' }).catch(() => null);
  const health = healthRes && healthRes.ok ? await healthRes.json() : null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-saiyan text-dbz-orange uppercase">STATUT DU BOT SHENRON</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dbz-panel p-6">
          <p className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest mb-2">État du Système</p>
          <div className="flex items-center gap-3">
             <div className={`w-4 h-4 rounded-none border-2 ${health ? 'bg-green-500 border-green-700 animate-pulse' : 'bg-red-500 border-red-700'}`} />
             <span className="text-2xl font-saiyan text-white">{health ? 'OPÉRATIONNEL' : 'HORS LIGNE'}</span>
          </div>
        </div>

        {health && (
          <>
            <div className="dbz-panel p-6">
              <p className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest mb-2">Uptime</p>
              <p className="scouter-text text-2xl">{Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m</p>
            </div>
            <div className="dbz-panel p-6">
              <p className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest mb-2">Version</p>
              <p className="scouter-text text-2xl">v{health.version}</p>
            </div>
          </>
        )}
      </div>

      <div className="dbz-panel p-8">
        <h2 className="text-2xl text-dbz-yellow mb-4">ACTIONS D'URGENCE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton label="Synchroniser Slash" action="sync_commands" />
          <ActionButton label="Recharger Services" action="reload" />
          <ActionButton label="Vider Cache Rendu" action="clear_cache" />
          <ActionButton label="Check Health DB" action="check_db" />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, action }: { label: string, action: string }) {
  return (
    <button className="dbz-panel p-4 text-center group cursor-not-allowed opacity-50">
       <span className="text-xs font-bold text-white uppercase group-hover:text-dbz-orange transition-colors">{label}</span>
       <p className="text-[10px] text-gray-500 mt-1">/{action}</p>
    </button>
  );
}
