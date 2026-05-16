export const dynamic = "force-dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const aboutContent = `
# À propos de DBFR

DBFR est le hub communautaire français dédié à l'univers de Dragon Ball. 
Notre objectif est de rassembler les fans autour d'un contenu riche, 
d'un wiki encyclopédique et d'un serveur Discord interactif.

### Notre Vision
Nous croyons en une communauté soudée où chaque membre peut partager sa passion, 
participer à des événements et progresser dans notre système de niveaux.

### Rejoignez-nous
Que vous soyez un vétéran de l'époque du Club Dorothée ou un nouveau fan 
découvrant Dragon Ball Super, vous avez votre place parmi nous.
`;

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{aboutContent}</ReactMarkdown>
      </div>
    </div>
  );
}

