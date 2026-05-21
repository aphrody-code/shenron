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
 * Les images inline sont retirées (`disallowedElements`) car les URLs de pièces
 * jointes Discord expirent ; l'image de couverture est gérée séparément.
 * Les titres markdown (#) sont rabaissés visuellement pour tenir dans une carte.
 */
const components: Components = {
	a: ({ href, children }) => (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-dbz-orange hover:text-white underline underline-offset-2 transition-colors"
		>
			{children}
		</a>
	),
	p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
	strong: ({ children }) => (
		<strong className="font-bold text-white">{children}</strong>
	),
	em: ({ children }) => <em className="italic text-white/90">{children}</em>,
	ul: ({ children }) => (
		<ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>
	),
	ol: ({ children }) => (
		<ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>
	),
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
	h1: ({ children }) => (
		<span className="block font-bold text-white mb-1">{children}</span>
	),
	h2: ({ children }) => (
		<span className="block font-bold text-white mb-1">{children}</span>
	),
	h3: ({ children }) => (
		<span className="block font-bold text-white mb-1">{children}</span>
	),
};

export function Markdown({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
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
