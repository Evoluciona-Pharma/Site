/** Public-asset URL helper.
 *
 * `next/link` and the router prefix `basePath` automatically, but raw `<img src>`
 * does not — so every image path goes through here. On GitHub Pages the site is
 * served from a subdirectory (`/Site`), which the build passes in as
 * NEXT_PUBLIC_BASE_PATH; locally it is empty and paths stay root-relative.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function asset(path: string): string {
  return `${basePath}/${path.replace(/^\//, '')}`;
}
