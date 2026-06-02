import nextConfig from "eslint-config-next";

const eslintConfig = [
	{
		ignores: [".next/**", "dist/**", "build/**", "node_modules/**"],
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
