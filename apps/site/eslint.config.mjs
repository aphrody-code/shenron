import nextConfig from "eslint-config-next";

const eslintConfig = [
	{
		// `.next-build/**` est le répertoire de build du déploiement bleu/vert
		// (cf. scripts/ops/deploy-site.ts) : c'est de la sortie de compilation, pas des sources.
		// `public/**` sert des fichiers statiques tels quels (dont les miroirs bxc, ~158 Mo
		// de JS/CSS vendorés) : les linter n'a aucun sens et coûte plusieurs minutes par run.
		ignores: [
			".next/**",
			".next-build/**",
			"dist/**",
			"build/**",
			"node_modules/**",
			"public/**",
		],
	},
	...nextConfig,
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@next/next/no-img-element": "off",
			"react/no-unescaped-entities": "off",
			"react/react-in-jsx-scope": "off",
			"react-hooks/set-state-in-effect": "off",
			"react-hooks/immutability": "off",
			"react-hooks/refs": "off",
			"react/no-unknown-property": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"react-hooks/purity": "off",
			"react-hooks/incompatible-library": "off",
		},
	},
];

export default eslintConfig;
