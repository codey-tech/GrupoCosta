"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "grupocosta-cookie-consent";

export default function CookieConsent() {
  const [hydrated, setHydrated] = useState(false);
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    } else {
      setConsent("pending");
    }
    setHydrated(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setConsent("rejected");
  };

  const showBanner = hydrated && consent === "pending";

  return (
    <>
      {hydrated && consent === "accepted" && (
        <>
          {process.env.NEXT_PUBLIC_GA_ID ? (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          ) : null}
          <Analytics />
        </>
      )}

      {showBanner ? (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[50000] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          role="region"
          aria-label="Aviso de cookies"
          aria-live="polite"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/12 bg-[#121212]/95 p-4 text-white shadow-2xl backdrop-blur-md md:p-5">
            <div className="flex gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
                aria-hidden
              >
                <Cookie className="h-5 w-5 text-white/60" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="cookie-consent-title"
                  className="text-sm font-medium tracking-wide text-white"
                >
                  Cookies e privacidade
                </h2>
                <p
                  id="cookie-consent-desc"
                  className="mt-1.5 text-xs leading-relaxed text-white/55 md:text-[13px]"
                >
                  Utilizamos cookies e ferramentas de medição de audiência para
                  melhorar sua experiência e entender como o site é usado. Você
                  pode aceitar ou recusar o uso desses cookies não essenciais.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={reject}
                    className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-xs font-medium tracking-wide text-white/70 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Recusar
                  </button>
                  <button
                    type="button"
                    onClick={accept}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-medium tracking-wide text-[#121212] transition-opacity hover:opacity-90"
                  >
                    Aceitar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
