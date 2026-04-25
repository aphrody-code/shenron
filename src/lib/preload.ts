import "reflect-metadata";

// Note : Tailwind v4 est pré-compilé par `bun run dashboard:css` (CLI officiel)
// qui scanne les TSX et génère `src/dashboard/styles.compiled.css`. Le bundler
// HTML import de Bun.serve sert ensuite ce fichier déjà compilé.
// Le plugin `bun-plugin-tailwind` à `Bun.plugin(...)` n'est pas appliqué au
// bundling HTML runtime (testé), d'où le pre-build via CLI.
