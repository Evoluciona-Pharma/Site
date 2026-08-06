import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductPage from '@/components/product/ProductPage';
import { productBySlug, products } from '@/lib/catalog';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  return { title: product ? `${product.name} — Evoluciona Pharma` : 'Evoluciona Pharma' };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  // Keyed by slug so image index, accordion, and presentation reset per product.
  return <ProductPage key={product.slug} product={product} />;
}
