import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import FaqPage from '@/components/faq/FaqPage';
import { faqTopicBySlug, faqTopics } from '@/lib/catalog';

export function generateStaticParams() {
  return faqTopics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const t = faqTopicBySlug(topic);
  return { title: t ? `${t.label} — Provider FAQ — Evoluciona Pharma` : 'Provider FAQ — Evoluciona Pharma' };
}

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const t = faqTopicBySlug(topic);
  if (!t) notFound();
  return <FaqPage topic={t} />;
}
