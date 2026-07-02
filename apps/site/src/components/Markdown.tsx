import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Rendu markdown sûr — utilisé pour les actualités issues des salons d'annonces
 * Discord (markdown préservé : gras, listes, liens, citations).
 *
 * Sécurité (cf. best practices react-markdown) : on N'ACTIVE PAS `rehype-raw`,
 * donc tout HTML brut présent dans le texte est échappé (pas d'exécution → pas
 * de XSS). `remark-gfm` ajoute strikethrough / autolinks / tables.
 *
 * Protocoles de lien : on revalide explicitement chaque `href` via une allowlist
 * (`safeHref`) — même logique que le transform d'URL par défaut de react-markdown
 * (et que `WikiMarkdown`), en défense en profondeur : un lien `javascript:` /
 * `data:` / `vbscript:` (injectable par un admin dans une section custom) est
 * neutralisé (rendu en texte) au lieu d'aboutir à un href exécutable au clic.
 *
 * Les images inline sont retirées (`disallowedElements`) car les URLs de pièces
 * jointes Discord expirent ; l'image de couverture est gérée séparément.
 * Les titres markdown (#) sont rabaissés visuellement pour tenir dans une carte.
 */

// Protocoles autorisés dans les liens (identiques à l'allowlist par défaut de
// react-markdown). Tout le reste (javascript:, data:, vbscript:…) est rejeté.
const SAFE_PROTOCOL = /^(https?|ircs?|mailto|xmpp)$/i;

/** Retourne l'href s'il est sûr (relatif, ancre ou protocole whitelisté), sinon `undefined`. */
function safeHref(href: unknown): string | undefined {
	if (typeof href !== "string") return undefined;
	const value = href.trim();
	const colon = value.indexOf(":");
	if (colon === -1) return value; // relatif (pas de protocole)
	const slash = value.indexOf("/");
	const question = value.indexOf("?");
	const hash = value.indexOf("#");
	// Un `:` situé après un `/`, `?` ou `#` n'est pas un protocole (ex. `/a?x=b:c`).
	if (
		(slash !== -1 && colon > slash) ||
		(question !== -1 && colon > question) ||
		(hash !== -1 && colon > hash) ||
		SAFE_PROTOCOL.test(value.slice(0, colon))
	) {
		return value;
	}
	return undefined;
}

const components: Components = {
	a: ({ href, children }) => {
		const safe = safeHref(href);
		// href hostile → on retombe sur le texte brut (pas de lien cliquable).
		if (!safe) return <>{children}</>;
		return (
			<a
				href={safe}
				target="_blank"
				rel="noopener noreferrer"
				className="text-dbz-orange hover:text-white underline underline-offset-2 transition-colors"
			>
				{children}
			</a>
		);
	},
	p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
	strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
	em: ({ children }) => <em className="italic text-white/90">{children}</em>,
	ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
	ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
	li: ({ children }) => <li className="text-gray-400">{children}</li>,
	blockquote: ({ children }) => (
		<blockquote className="border-l-2 border-dbz-orange/60 pl-3 italic text-white/70">
			{children}
		</blockquote>
	),
	code: ({ children }) => (
		<code className="px-1.5 py-0.5 rounded bg-white/10 text-dbz-orange font-mono text-[0.85em]">
			{children}
		</code>
	),
	// Titres markdown → simple emphase forte (pas de h1 géant dans une carte).
	h1: ({ children }) => <span className="block font-bold text-white mb-1">{children}</span>,
	h2: ({ children }) => <span className="block font-bold text-white mb-1">{children}</span>,
	h3: ({ children }) => <span className="block font-bold text-white mb-1">{children}</span>,
};

export function Markdown({ children, className }: { children: string; className?: string }) {
	return (
		<div className={className}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				disallowedElements={["img"]}
				unwrapDisallowed
				components={components}
			>
				{children}
			</ReactMarkdown>
		</div>
	);
}
