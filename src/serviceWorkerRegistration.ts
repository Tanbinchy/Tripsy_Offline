export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(async (registration) => {
        const worker =
          registration.active || registration.waiting || registration.installing;

        const assetUrls = [
          window.location.origin + "/",
          window.location.origin + "/index.html",
          ...Array.from(
            document.querySelectorAll<HTMLLinkElement>(
              'link[rel="stylesheet"], link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]'
            )
          ).map((link) => link.href),
          ...Array.from(document.scripts).map((script) => script.src),
        ].filter(Boolean);

        if (worker) {
          worker.postMessage({ type: "CACHE_URLS", urls: assetUrls });
        }

        await navigator.serviceWorker.ready;
        navigator.serviceWorker.controller?.postMessage({
          type: "CACHE_URLS",
          urls: assetUrls,
        });
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });
}
