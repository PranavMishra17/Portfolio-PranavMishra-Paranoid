// v19 — the résumé, fetched once, ahead of time.
//
// The PDF lives on GitHub and is served as an attachment, so it is fetched as a blob and kept as
// an object URL for the life of the page. The site starts the fetch the moment the wall comes
// down, so by the time anyone clicks Résumé it is already here and the page does not reload.

export const GITHUB_PDF = 'https://raw.githubusercontent.com/PranavMishra17/PranavMishra17/main/RESUME%20Pranav_Mishra.pdf';
export const GITHUB_VIEW = 'https://github.com/PranavMishra17/PranavMishra17/blob/main/RESUME%20Pranav_Mishra.pdf';

let url = null;
let inflight = null;

export function cachedResume() {
  return url;
}

export function prefetchResume() {
  if (url) return Promise.resolve(url);
  if (inflight) return inflight;
  inflight = fetch(GITHUB_PDF, { mode: 'cors' })
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.blob();
    })
    .then((blob) => {
      url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      return url;
    })
    .catch(() => {
      inflight = null;
      return null;
    });
  return inflight;
}

/* the page's code too, so the route is instant */
export function prefetchResumePage() {
  return import('./Resume').catch(() => null);
}
