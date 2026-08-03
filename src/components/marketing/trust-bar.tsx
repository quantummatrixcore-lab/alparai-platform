import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github, BookOpen, Shield, Ban } from 'lucide-react';

export function TrustBar() {
  const t = useTranslations('trust');
  const items = [
    { icon: Github, label: t('open_source'), href: 'https://github.com/quantummatrixcore-lab/alparai-platform' },
    { icon: BookOpen, label: t('methodology'), href: '/methodology' },
    { icon: Shield, label: t('neutrality'), href: '/legal/neutrality' },
    { icon: Ban, label: t('no_funding'), href: '/legal/neutrality' },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-6 py-4 px-8 border-y border-white/10 bg-white/5 backdrop-blur-sm">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors">
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
