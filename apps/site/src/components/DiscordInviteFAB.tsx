"use client";

import { useEffect, useState } from "react";

export function DiscordInviteFAB() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("dbfr_fab_dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    localStorage.setItem("dbfr_fab_dismissed", "true");
    setIsVisible(false);
  };

  const inviteUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/votre_invite_ici";

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
      <a
        href={inviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="dbz-button inline-flex items-center gap-3 !px-4 !py-3 hover:scale-105"
      >
        <span className="text-xl md:text-2xl mt-1">REJOINDRE LE DISCORD</span>
        <button
          onClick={handleDismiss}
          className="absolute -top-3 -right-3 w-8 h-8 bg-dbz-bg border-2 border-dbz-orange text-dbz-orange flex items-center justify-center font-sans font-black text-sm hover:bg-dbz-orange hover:text-white transition-colors"
          title="Fermer"
        >
          X
        </button>
      </a>
    </div>
  );
}
