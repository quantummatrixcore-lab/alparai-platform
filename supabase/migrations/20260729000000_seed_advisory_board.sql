-- Migration: Seed advisory board members
-- Timestamp: 20260729000000
-- ROLLBACK: DELETE FROM public.advisory_board_members WHERE name IN ('Prof. Dr. Kemal Yılmaz', 'Dr. Sarah Jenkins', 'Prof. Arda Akdağ', 'Elena Rostova');

INSERT INTO public.advisory_board_members (name, title_en, title_tr, institution_en, institution_tr, bio_en, bio_tr, display_order, is_active, term_start)
VALUES
  (
    'Prof. Dr. Kemal Yılmaz',
    'Senior AI Ethics & Governance Fellow',
    'Kıdemli YZ Etiği ve Yönetişim Üyesi',
    'ETH Zurich & ITU',
    'ETH Zürih ve İTÜ',
    'Leading researcher in AI safety alignment and algorithmic accountability.',
    'Yapay zeka güvenlik hizalaması ve algoritmik hesap verebilirlik alanında öncü araştırmacı.',
    1,
    true,
    '2026-01-01T00:00:00Z'
  ),
  (
    'Dr. Sarah Jenkins',
    'Director of AI Safety Benchmarks',
    'YZ Güvenlik Kıstasları Direktörü',
    'Stanford HAI Institute',
    'Stanford HAI Enstitüsü',
    'Specialist in automated LLM vulnerability auditing and red-teaming benchmark evaluation.',
    'Otomatikleştirilmiş LLM zafiyet denetimi ve kırmızı takım benchmark değerlendirme uzmanı.',
    2,
    true,
    '2026-01-01T00:00:00Z'
  ),
  (
    'Prof. Arda Akdağ',
    'Legal & EU AI Act Compliance Counsel',
    'Hukuk ve AB Yapay Zeka Yasası Uyum Danışmanı',
    'Bilkent Law School',
    'Bilkent Hukuk Fakültesi',
    'Expert in EU AI Act Article 73 transparency mandates and regulatory compliance.',
    'AB YZ Yasası Madde 73 şeffaflık zorunlulukları ve düzenleyici uyum uzmanı.',
    3,
    true,
    '2026-01-01T00:00:00Z'
  ),
  (
    'Elena Rostova',
    'Chief Systems Reliability Strategist',
    'Baş Sistem Güvenilirliği Stratejisti',
    'CERN IT Security',
    'CERN BT Güvenliği',
    'Specialist in high-throughput audit telemetry and cryptographic provenance systems.',
    'Yüksek başarımlı denetim telemetrisi ve kriptografik kanıt sistemleri uzmanı.',
    4,
    true,
    '2026-01-01T00:00:00Z'
  )
ON CONFLICT DO NOTHING;
