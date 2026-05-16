import { getShenronCharacter } from "@/lib/shenron";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = await getShenronCharacter(parseInt(id));
  const SHENRON_API_URL = process.env.SHENRON_API_URL || "https://shenron.rpbey.fr";

  if (!character) notFound();

  return (
    <div className="space-y-12">
      <Link href="/wiki/dragon-ball" className="inline-flex items-center gap-2 text-dbz-blue-light hover:text-dbz-yellow transition-colors font-bold uppercase text-xs tracking-widest mb-4">
        <span>← Retour à l'index</span>
      </Link>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="w-full md:w-1/3">
           <div className="dbz-panel p-4 border-4 border-dbz-blue-light bg-dbz-bg relative overflow-hidden">
             <img 
               src={`${SHENRON_API_URL}/${character.image}`} 
               alt={character.name} 
               className="w-full h-auto object-contain relative z-10"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-dbz-blue/20 to-transparent" />
           </div>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-saiyan text-white mb-2" style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.8)" }}>
              {character.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {character.race && (
                <span className="px-3 py-1 bg-dbz-bg border-2 border-dbz-orange text-dbz-orange font-bold text-xs uppercase tracking-widest">
                  {character.race}
                </span>
              )}
              {character.affiliation && (
                <span className="px-3 py-1 bg-dbz-bg border-2 border-dbz-blue-light text-dbz-blue-light font-bold text-xs uppercase tracking-widest">
                  {character.affiliation}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed text-lg italic">
            {character.description || "Aucune description disponible pour ce guerrier."}
          </p>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-dbz-bg border-2 border-dbz-border p-4">
               <p className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest mb-1">KI Actuel</p>
               <p className="scouter-text text-2xl text-dbz-orange">{character.ki || "???"}</p>
             </div>
             <div className="bg-dbz-bg border-2 border-dbz-border p-4">
               <p className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest mb-1">KI Maximum</p>
               <p className="scouter-text text-2xl text-dbz-yellow">{character.maxKi || "???"}</p>
             </div>
          </div>

          {character.originPlanet && (
            <div className="dbz-panel p-4 flex items-center gap-4 hover:border-dbz-blue-light transition-colors group">
              <div className="w-16 h-16 bg-dbz-bg border-2 border-dbz-border p-1 overflow-hidden shrink-0">
                <img 
                  src={`${SHENRON_API_URL}/${character.originPlanet.image}`} 
                  alt={character.originPlanet.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Planète d'Origine</p>
                <p className="text-xl font-saiyan text-white group-hover:text-dbz-blue-light transition-colors">{character.originPlanet.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {character.transformations && character.transformations.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-saiyan text-4xl text-dbz-orange border-b-2 border-dbz-orange pb-2">
            TRANSFORMATIONS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {character.transformations.map(transfo => (
              <div key={transfo.id} className="dbz-panel p-2 flex flex-col items-center group">
                <div className="aspect-square w-full bg-dbz-bg border-2 border-dbz-border p-1 mb-2 overflow-hidden relative">
                  <img 
                    src={`${SHENRON_API_URL}/${transfo.image}`} 
                    alt={transfo.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-[10px] font-bold text-white uppercase text-center group-hover:text-dbz-yellow transition-colors leading-tight">
                  {transfo.name}
                </h3>
                {transfo.ki && (
                  <span className="text-[9px] text-dbz-orange font-bold uppercase mt-1">
                    KI: {transfo.ki}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
