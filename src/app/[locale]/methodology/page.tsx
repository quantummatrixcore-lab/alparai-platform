import { getTranslations } from 'next-intl/server';

export default async function MethodologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'methodology' });
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <section className="prose prose-invert max-w-none">
        <h2>{t('scoring_title')}</h2>
        <p>{t('scoring_desc')}</p>
        <h2>{t('wilson_title')}</h2>
        <p>{t('wilson_desc')}</p>
        <h2>{t('corrections_title')}</h2>
        <p>{t('corrections_desc')}</p>
      </section>
    </main>
  );
}
