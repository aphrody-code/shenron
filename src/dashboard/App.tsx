import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { DiscordLoginPrompt } from "./components/DiscordLoginPrompt";
import { Login } from "./pages/Login";
import { Overview } from "./pages/Overview";
import { Database } from "./pages/Database";
import { TableView } from "./pages/TableView";
import { Cron } from "./pages/Cron";
import { Services } from "./pages/Services";
import { Bot } from "./pages/Bot";
import { Stats } from "./pages/Stats";
import { Audit } from "./pages/Audit";
import { Moderation } from "./pages/Moderation";
import { Settings } from "./pages/Settings";
import { Logs } from "./pages/Logs";
import { Levels } from "./pages/Levels";
import { Messages } from "./pages/Messages";
import { CanvasPage } from "./pages/Canvas";
import { Profile } from "./pages/Profile";
import { Webhooks } from "./pages/Webhooks";
import { api } from "./lib/api";
import { useEventStream } from "./lib/event-stream";

interface SessionUser {
  id?: string;
  username?: string;
  avatar?: string | null;
  source: "token" | "discord" | "better-auth";
}
interface Session {
  authenticated: boolean;
  checkedAt: number;
  user?: SessionUser;
}

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [route, setRoute] = useState<string>(() => window.location.pathname);

  // Sync live bot ↔ dashboard via SSE — actif uniquement quand authentifié
  useEventStream(!!session?.authenticated);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    api
      .get<{ authenticated: boolean; user?: SessionUser }>("/auth/me")
      .then((r) =>
        setSession({ authenticated: r.authenticated, user: r.user, checkedAt: Date.now() }),
      )
      .catch(() => setSession({ authenticated: false, checkedAt: Date.now() }));
  }, []);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-500">
        <div className="animate-pulse">Chargement en cours…</div>
      </div>
    );
  }

  if (!session.authenticated) {
    return <Login onLogin={() => setSession({ authenticated: true, checkedAt: Date.now() })} />;
  }

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  return (
    <>
      <Layout route={route} navigate={navigate}>
        {renderRoute(route, navigate)}
      </Layout>
      <DiscordLoginPrompt visible={session.user?.source === "token"} />
    </>
  );
}

function renderRoute(route: string, navigate: (path: string) => void) {
  if (route === "/" || route === "") return <Overview />;
  if (route === "/profile") return <Profile />;
  if (route === "/webhooks") return <Webhooks />;
  if (route === "/cron") return <Cron />;
  if (route === "/services") return <Services />;
  if (route === "/bot") return <Bot />;
  if (route === "/stats") return <Stats />;
  if (route === "/levels") return <Levels />;
  if (route === "/messages") return <Messages />;
  if (route === "/canvas") return <CanvasPage />;
  if (route === "/audit") return <Audit />;
  if (route === "/moderation") return <Moderation />;
  if (route === "/logs") return <Logs />;
  if (route === "/settings") return <Settings />;
  if (route === "/database") return <Database navigate={navigate} />;
  if (route.startsWith("/database/")) {
    const table = route.slice("/database/".length);
    return <TableView table={table} navigate={navigate} />;
  }
  return (
    <div className="card text-center">
      <h2 className="mb-2 text-2xl">Page introuvable</h2>
      <p className="text-zinc-400">Aucune route ne correspond à : {route}</p>
    </div>
  );
}
