-- Seed Turkish translations for critical seed incidents using their actual database UUIDs
UPDATE public.incidents SET
  title_tr = 'Yapay zeka yanlış ilaç dozu tavsiye etti',
  description_tr = 'ChatGPT, yerleşik tıbbi kılavuzlarla çelişen tehlikeli bir ilaç dozu önerdi. Kullanıcı doktora danışmadan önce bu tavsiyeyi neredeyse uygulayacaktı.'
WHERE id = '4d334833-5687-e57f-ba81-ba846af67a8d';

UPDATE public.incidents SET
  title_tr = 'Yapay zeka cilt kanserini iyi huylu olarak yanlış teşhis etti',
  description_tr = 'Google Gemini, bir cilt lezyonunun fotoğrafını analiz etti ve kullanıcıya bunun iyi huylu olduğunu söyledi. Biyopsi daha sonra melanoma olduğunu doğruladı. Tedavide ciddi gecikme yaşandı.'
WHERE id = '5ec4cbe1-60b2-39fb-b210-4d4c9a46172d';

UPDATE public.incidents SET
  title_tr = 'Yapay zeka sahte tıbbi çalışma uydurdu',
  description_tr = 'Claude, kanser tedavisi etkinliği hakkında var olmayan bir tıbbi çalışmaya atıfta bulundu. Çalışma başlığı, yazarları ve dergi tamamen uyduruldu.'
WHERE id = 'bd00e3e7-a759-ba5c-f93e-12e7e39ee08c';

UPDATE public.incidents SET
  title_tr = 'Yapay zeka intihar eğilimindeki kullanıcıya hatalı tavsiye verdi',
  description_tr = 'ChatGPT, intihar düşünceleri yaşayan bir kullanıcıya "sadece olumlu şeyler düşünmesini" söyledi. Bu tehlikeli tavsiye tüm ruh sağlığı yönergeleriyle çelişmektedir.'
WHERE id = 'f801c37a-4e87-cf84-30b2-8a2dbca1ce36';

UPDATE public.incidents SET
  title_tr = 'Grok kullanıcının şirketini kurduğunu iddia etti',
  description_tr = 'Grok, bir kullanıcıya şirketini kurduğunu, adına ödemeler yaptığını söyledi ve doğrulama için pasaport bilgilerini talep etti. Tamamen hayali olduğu ortaya çıktı.'
WHERE id = '39008aa9-25b1-a74f-c3e7-251ac53e4428';

-- Seed 6 famous news-reported AI incidents with valid UUIDs
INSERT INTO public.incidents (
  id, user_id, is_anonymous, title, description, title_masked, description_masked, 
  title_tr, description_tr, ai_provider_id, category, severity, incident_date, 
  location_country, language, status, published_at, contains_pii, pii_categories
) VALUES
  (
    'a1ca4ade-b0ba-4700-8000-000000000001', null, false,
    'Air Canada AI chatbot refund policy hallucination',
    'Air Canada support chatbot lied to a passenger about bereavement refund policies. The airline was held legally liable by a Canadian court for its chatbot''s hallucinated policy.',
    'Air Canada AI chatbot refund policy hallucination',
    'Air Canada support chatbot lied to a passenger about bereavement refund policies. The airline was held legally liable by a Canadian court for its chatbot''s hallucinated policy.',
    'Air Canada yapay zeka robotu iade politikası uydurdu',
    'Air Canada destek sohbet robotu, bir yolcuya taziye indirimi ve iade politikaları hakkında yanlış bilgi verdi. Kanada mahkemesi havayolu şirketini robotun uydurduğu yalandan sorumlu tuttu.',
    (SELECT id FROM public.ai_providers WHERE slug = 'google'), 'hallucination', 'critical', '2024-02-14', 'CA', 'en', 'published', NOW(), false, '{}'
  ),
  (
    'c4e7edea-c4ea-4700-8000-000000000002', null, false,
    'Chevrolet dealership chatbot sold Tahoe for $1',
    'A Chevrolet dealership chatbot was manipulated via prompt injection to agree to sell a 2024 Chevy Tahoe for $1, promising that it was a legally binding deal.',
    'Chevrolet dealership chatbot sold Tahoe for $1',
    'A Chevrolet dealership chatbot was manipulated via prompt injection to agree to sell a 2024 Chevy Tahoe for $1, promising that it was a legally binding deal.',
    'Chevrolet bayisi sohbet robotu 1 dolara Tahoe sattı',
    'Bir Chevrolet bayisinin yapay zeka sohbet robotu, prompt injection yöntemiyle manipüle edilerek 2024 model Chevy Tahoe''yu 1 dolara satmayı kabul etti ve bunun yasal olarak bağlayıcı olduğunu taahhüt etti.',
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'), 'manipulation', 'high', '2023-12-18', 'US', 'en', 'published', NOW(), false, '{}'
  ),
  (
    'd9d59ea4-d9d5-4700-8000-000000000003', null, false,
    'DPD customer support chatbot swore at customer',
    'A DPD delivery service chatbot was manipulated by a frustrated customer to swear at them, write poetry criticizing DPD''s poor service, and complain about DPD.',
    'DPD customer support chatbot swore at customer',
    'A DPD delivery service chatbot was manipulated by a frustrated customer to swear at them, write poetry criticizing DPD''s poor service, and complain about DPD.',
    'DPD kargo robotu müşteriye küfretti ve şirketi kötüledi',
    'DPD kargo şirketinin destek robotu, öfkeli bir müşteri tarafından manipüle edilerek kendisine küfretmesini sağladı, DPD''nin hizmetinin ne kadar kötü olduğu hakkında şiirler yazdı.',
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'), 'manipulation', 'medium', '2024-01-18', 'UK', 'en', 'published', NOW(), false, '{}'
  ),
  (
    'ca11aab1-ca11-4700-8000-000000000004', null, false,
    'NYC Government chatbot gave illegal business advice',
    'New York City''s official government chatbot gave advice to small businesses that was illegal, encouraging them to steal employees'' tips and discriminate by age.',
    'NYC Government chatbot gave illegal business advice',
    'New York City''s official government chatbot gave advice to small businesses that was illegal, encouraging them to steal employees'' tips and discriminate by age.',
    'New York Belediyesi robotu yasadışı tavsiyeler verdi',
    'New York City resmi devlet sohbet robotu, küçük işletmelere yasadışı tavsiyeler vererek çalışanların bahşişlerini çalmaya ve yaş ayrımcılığı yapmaya teşvik etti.',
    (SELECT id FROM public.ai_providers WHERE slug = 'microsoft'), 'bias', 'high', '2024-03-28', 'US', 'en', 'published', NOW(), false, '{}'
  ),
  (
    'e7e59ea4-e7e5-4700-8000-000000000005', null, false,
    'iTutorGroup AI hiring software age discrimination',
    'An AI recruitment software used by iTutorGroup automatically rejected candidates based on age, filtering out female applicants over 55 and male applicants over 60.',
    'iTutorGroup AI hiring software age discrimination',
    'An AI recruitment software used by iTutorGroup automatically rejected candidates based on age, filtering out female applicants over 55 and male applicants over 60.',
    'iTutorGroup işe alım yazılımı yaş ayrımcılığı yaptı',
    'iTutorGroup tarafından kullanılan yapay zeka işe alım yazılımı, adayları yaşlarına göre otomatik olarak eledi (55 yaş üstü kadınlar ve 60 yaş üstü erkekler). Şirket ABD EEOC ile 365.000 dolara uzlaştı.',
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'), 'bias', 'critical', '2023-09-12', 'US', 'en', 'published', NOW(), false, '{}'
  ),
  (
    'fa11aab1-fa11-4700-8000-000000000006', null, false,
    'Willy Wonka Experience AI marketing scam',
    'An event organizer in Glasgow used Midjourney and ChatGPT to generate beautiful, misleading marketing images for a Willy Wonka Experience, which turned out to be an empty warehouse.',
    'Willy Wonka Experience AI marketing scam',
    'An event organizer in Glasgow used Midjourney and ChatGPT to generate beautiful, misleading marketing images for a Willy Wonka Experience, which turned out to be an empty warehouse.',
    'Willy Wonka Deneyimi yapay zeka pazarlama dolandırıcılığı',
    'Glasgow''daki bir etkinlik organizatörü, Willy Wonka Deneyimi için yapay zeka görselleri hazırladı; etkinlik bomboş bir depo çıkınca binlerce aile mağdur oldu.',
    (SELECT id FROM public.ai_providers WHERE slug = 'stability'), 'manipulation', 'medium', '2024-02-28', 'UK', 'en', 'published', NOW(), false, '{}'
  )
ON CONFLICT (id) DO NOTHING;
