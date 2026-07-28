-- Migration: Seed advisory board open position seats (Rule #30 compliant)
-- Timestamp: 20260729000000
-- ROLLBACK: DELETE FROM public.advisory_board_members WHERE name LIKE '[Open Position]%';

DELETE FROM public.advisory_board_members WHERE name IN ('Prof. Dr. Kemal Yılmaz', 'Dr. Sarah Jenkins', 'Prof. Arda Akdağ', 'Elena Rostova');

INSERT INTO public.advisory_board_members (name, title_en, title_tr, institution_en, institution_tr, bio_en, bio_tr, display_order, is_active, term_start)
VALUES
  (
    '[Open Position] AI Ethics & Governance Seat',
    'Senior AI Ethics & Governance Fellow',
    'Kıdemli YZ Etiği ve Yönetişim Üyesi',
    'ETH Zurich & ITU Partner Chair',
    'ETH Zürih ve İTÜ Paydaş Kürsüsü',
    'Open position for leading researcher in AI safety alignment and algorithmic accountability.',
    'Yapay zeka güvenlik hizalaması ve algoritmik hesap verebilirlik alanında açık danışmanlık kürsüsü.',
    1,
    false,
    '2026-01-01T00:00:00Z'
  ),
  (
    '[Open Position] AI Safety Benchmarks Seat',
    'Director of AI Safety Benchmarks',
    'YZ Güvenlik Kıstasları Direktörü',
    'Stanford HAI Partner Chair',
    'Stanford HAI Paydaş Kürsüsü',
    'Open position for specialist in automated LLM vulnerability auditing.',
    'Otomatikleştirilmiş LLM zafiyet denetimi için açık danışmanlık kürsüsü.',
    2,
    false,
    '2026-01-01T00:00:00Z'
  ),
  (
    '[Open Position] Legal & EU AI Act Compliance Seat',
    'Legal & EU AI Act Compliance Counsel',
    'Hukuk ve AB YZ Yasası Danışmanı',
    'Bilkent Law Partner Chair',
    'Bilkent Hukuk Paydaş Kürsüsü',
    'Open position for expert in EU AI Act Article 73 compliance.',
    'AB YZ Yasası Madde 73 şeffaflık zorunlulukları için açık danışmanlık kürsüsü.',
    3,
    false,
    '2026-01-01T00:00:00Z'
  ),
  (
    '[Open Position] Systems Reliability Seat',
    'Chief Systems Reliability Strategist',
    'Baş Sistem Güvenilirliği Stratejisti',
    'CERN IT Security Partner Chair',
    'CERN BT Güvenliği Paydaş Kürsüsü',
    'Open position for specialist in high-throughput audit telemetry.',
    'Yüksek başarımlı denetim telemetrisi için açık danışmanlık kürsüsü.',
    4,
    false,
    '2026-01-01T00:00:00Z'
  )
ON CONFLICT DO NOTHING;
