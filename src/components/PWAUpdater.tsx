"use client";

import { useEffect } from "react";

export function PWAUpdater() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let refreshing = false;

    // 1. When new Service Worker activates and takes control, reload page automatically
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        console.log("[PWA] New update detected and activated! Reloading app...");
        window.location.reload();
      }
    });

    // 2. Register Service Worker with clean update checks
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registered:", registration.scope);

        // Check for updates on register
        registration.update();

        // 3. When app returns to foreground (user taps Home Screen icon), check for updates
        const handleVisibilityChange = () => {
          if (document.visibilityState === "visible") {
            console.log("[PWA] App resumed from Home Screen. Checking for updates...");
            registration.update().catch((err) => console.log("[PWA] Update check failed:", err));
          }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        // 4. Handle newly installed waiting workers
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[PWA] New content available. Triggering skipWaiting...");
                newWorker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });
      })
      .catch((err) => {
        console.error("[PWA] Service Worker registration failed:", err);
      });
  }, []);

  return null;
}
