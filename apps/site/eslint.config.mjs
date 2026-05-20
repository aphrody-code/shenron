import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = import.meta.path;
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	basePath: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

const eslintConfig = [
	{
		ignores: [".next/**", "dist/**", "build/**", "node_modules/**"],
	},
	...compat.extends("next/core-web-vitals"),
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@next/next/no-img-element": "off",
			"react/no-unescaped-entities": "off",
		},
	},
];

export default eslintConfig;
