"use client";

import { useEffect } from "react";

// ⚠️  BUMP THIS ON EVERY DEPLOYMENT — must match CACHE_NAME in /public/sw.js
const CURRENT_DEPLOYMENT_VERSION = "v2.0.5";

export function PWAUpdater() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Deployment Version Check via LocalStorage
    try {
      const savedVersion = localStorage.getItem("namo_app_version");
      if (savedVersion !== CURRENT_DEPLOYMENT_VERSION) {
        console.log(`[PWA] New version detected: ${CURRENT_DEPLOYMENT_VERSION} (was ${savedVersion})`);
        localStorage.setItem("namo_app_version", CURRENT_DEPLOYMENT_VERSION);

        // Clear all CacheStorage caches
        if ("caches" in window) {
          caches.keys().then((names) => {
            Promise.all(names.map((name) => caches.delete(name))).then(() => {
              console.log("[PWA] CacheStorage cleared for new version.");
              window.location.reload();
            });
          });
        }
      }
    } catch (e) {
      console.error("[PWA] Version check error:", e);
    }

    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;

    // 2. When new Service Worker activates and takes control, reload page automatically
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        console.log("[PWA] New Service Worker activated! Reloading app...");
        window.location.reload();
      }
    });

    // 3. Listen for SW_UPDATED message from the service worker (sent after activate)
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "SW_UPDATED" && !refreshing) {
        refreshing = true;
        console.log("[PWA] SW signaled update. Reloading...");
        window.location.reload();
      }
    });

    // 4. Register Service Worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registered:", registration.scope);

        // Check for updates immediately
        registration.update();

        // 5. When app returns to foreground (Home Screen tap), check for updates
        const handleVisibilityChange = () => {
          if (document.visibilityState === "visible") {
            console.log("[PWA] App resumed. Checking for SW updates...");
            registration.update().catch((err) => console.log("[PWA] Update check failed:", err));
          }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        // 6. Handle newly installed waiting workers
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[PWA] New content available. Activating immediately...");
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
