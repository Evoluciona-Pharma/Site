/**
 * The app is fully static, so it can either run on a Node host (`next start`)
 * or be exported to plain files. Setting STATIC_EXPORT=1 produces `out/` for
 * GitHub Pages; NEXT_PUBLIC_BASE_PATH is the subdirectory it will be served
 * from (`/Site`), and stays empty for local development.
 */
const isExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  ...(isExport
    ? {
        output: 'export',
        // Pages resolves /shop/ to shop/index.html — without this the export
        // emits shop.html and every deep link 404s.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
