import { type FormEvent, useState } from "react";
import { api } from "../lib/api";

interface Props {
  onLogin: () => void;
}

export function Login({ onLogin }: Props) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/login", { token });
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/40 p-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mb-2 text-5xl">🐉</div>
          <h1 className="text-2xl font-bold text-brand-400">Shenron Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Tu as réuni les sept Dragon Balls. Fais ton vœu.
          </p>
        </div>

        <div>
          <label htmlFor="token" className="mb-2 block text-sm font-medium text-zinc-300">
            API Admin Token
          </label>
          <input
            id="token"
            type="password"
            className="input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="API_ADMIN_TOKEN"
            required
            autoFocus
          />
          <p className="mt-1 text-xs text-zinc-500">
            Token défini côté bot dans <code>.env</code> · <code>API_ADMIN_TOKEN</code>
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-700 bg-red-900/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !token} className="btn btn-primary w-full">
          {loading ? "Vérification…" : "Entrer"}
        </button>
      </form>
    </div>
  );
}
