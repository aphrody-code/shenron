import { getShenronCharacters, DBCharacter } from "@/lib/shenron";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DragonBallWikiIndex() {
  const characters = await getShenronCharacters();
  const SHENRON_API_URL = process.env.SHENRON_API_URL || "https://shenron.rpbey.fr";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-6xl font-saiyan text-dbz-yellow mb-2" style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.8)" }}>
          ENCYCLOPÉDIE DRAGON BALL
        </h1>
        <p className="text-dbz-blue-light font-bold tracking-widest uppercase text-sm">
          Archives galactiques des guerriers, planètes et transformations.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {characters.map((char: DBCharacter) => (
          <Link 
            key={char.id} 
            href={`/wiki/dragon-ball/character/${char.id}`}
            className="dbz-panel p-2 flex flex-col items-center group hover:border-dbz-yellow transition-colors"
          >
            <div className="aspect-square w-full bg-dbz-bg border-2 border-dbz-border p-1 mb-2 overflow-hidden relative">
              <img 
                src={`${SHENRON_API_URL}/${char.image}`} 
                alt={char.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dbz-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase text-center group-hover:text-dbz-yellow transition-colors truncate w-full">
              {char.name}
            </h3>
            {char.race && (
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                {char.race}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
