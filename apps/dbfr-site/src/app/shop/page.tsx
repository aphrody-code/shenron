import { getShenronShop, ShenronShopItem } from "@/lib/shenron";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const TYPE_LABELS: Record<string, string> = {
  card: "CARTE",
  badge: "BADGE",
  color: "COULEUR",
  title: "TITRE",
};

export default async function ShopPage() {
  const items = await getShenronShop();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-5xl md:text-7xl text-dbz-yellow mb-4" style={{ textShadow: "4px 4px 0px rgba(229, 90, 0, 0.8)" }}>
          BOUTIQUE SHENRON
        </h1>
        <p className="text-dbz-blue-light font-bold tracking-widest uppercase max-w-2xl mx-auto">
          Débloquez des cosmétiques exclusifs. Équipez-les via <span className="text-dbz-orange">/inventaire equip</span>.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {items.length === 0 ? (
          <div className="col-span-full dbz-panel p-12 text-center">
            <p className="font-saiyan text-3xl text-dbz-orange uppercase tracking-wider">La boutique galactique est fermée pour maintenance.</p>
          </div>
        ) : (
          items.map((item: ShenronShopItem) => (
            <div key={item.key} className="dbz-panel p-5 flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                 <span className="font-saiyan text-xl text-dbz-blue-light bg-dbz-bg px-2 border-2 border-dbz-blue-light">
                   {TYPE_LABELS[item.type] || item.type}
                 </span>
                 <div className="flex flex-col items-end">
                    <span className="scouter-text text-2xl leading-none">{item.price.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-dbz-orange uppercase">Zénis</span>
                 </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl text-white mb-2 leading-tight">{item.name}</h2>
                <p className="text-gray-400 text-sm mb-6 flex-1">{item.description || "Aucune description."}</p>
                
                <div className="bg-dbz-bg border-2 border-dbz-border p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Acheter sur Discord avec
                  </p>
                  <code className="text-dbz-yellow font-bold text-sm">/shop {item.key}</code>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
