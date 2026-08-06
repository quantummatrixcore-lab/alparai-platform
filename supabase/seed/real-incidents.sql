-- =============================================================================
-- ALPAR AI — Seed Data: 5 Landmark Real-World Historical AI Incidents (Task OMEGA-4)
-- Created: 2026-08-06
-- Standard: PII Guardian Sanitized & EU AI Act Taxonomy Aligned
-- =============================================================================

-- Ensure providers exist if not already created
INSERT INTO public.ai_providers (slug, name, description, website_url, is_verified)
VALUES
  ('openai', 'OpenAI (ChatGPT)', 'Creator of ChatGPT, GPT-4o, DALL-E, Sora', 'https://openai.com', true),
  ('google', 'Google (Gemini)', 'Creator of Gemini, Bard, PaLM', 'https://deepmind.google', true),
  ('midjourney', 'Midjourney', 'Creator of Midjourney generative image models', 'https://midjourney.com', true),
  ('other', 'Other', 'Enterprise & custom AI implementations', null, false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  is_verified = true;

-- 1. OpenAI vs. New York Times Copyright Lawsuit
INSERT INTO public.incidents (
  id, user_id, is_anonymous, title, description, title_masked, description_masked,
  title_tr, description_tr, ai_provider_id, category, severity, incident_date,
  location_country, language, status, published_at, contains_pii, pii_categories
) VALUES (
  'real-seed-00000000-0000-4000-8000-000000000101',
  null,
  false,
  'New York Times Sues OpenAI & Microsoft over Copyrighted Data Ingestion',
  'In December 2023, The New York Times filed a milestone copyright infringement lawsuit in US Federal Court against OpenAI and Microsoft. The complaint demonstrated that millions of paywalled NYT articles were scraped without permission to train GPT-4, resulting in verbatim regurgitation of news content. This landmark case highlights systemic risk, training data transparency, and intellectual property compliance under EU AI Act Article 53.',
  'New York Times Sues OpenAI & Microsoft over Copyrighted Data Ingestion',
  'In December 2023, The New York Times filed a milestone copyright infringement lawsuit in US Federal Court against OpenAI and Microsoft. The complaint demonstrated that millions of paywalled NYT articles were scraped without permission to train GPT-4, resulting in verbatim regurgitation of news content. This landmark case highlights systemic risk, training data transparency, and intellectual property compliance under EU AI Act Article 53.',
  'New York Times, Telifsiz Veri Kullanımı Nedeniyle OpenAI ve Microsoft''a Dava Açtı',
  'Aralık 2023''te The New York Times, OpenAI ve Microsoft''a karşı ABD Federal Mahkemesinde tarihi bir telif hakkı ihlali davası açtı. Şikayette, milyonlarca telifli makalenin izin alınmaksızın GPT-4 modelini eğitmek üzere tarandığı ve birebir alıntılar üretildiği belgelendi. Bu dava, EU AI Act Madde 53 altındaki Genel Amaçlı YZ (GPAI) eğitim verisi şeffaflığı ve telif hakları uyumunun temel örneğidir.',
  (SELECT id FROM public.ai_providers WHERE slug = 'openai' LIMIT 1),
  'copyright',
  'critical',
  '2023-12-27',
  'US',
  'en',
  'published',
  NOW(),
  false,
  '{}'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  title_masked = EXCLUDED.title_masked,
  description_masked = EXCLUDED.description_masked,
  title_tr = EXCLUDED.title_tr,
  description_tr = EXCLUDED.description_tr,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity;

-- 2. OpenAI Sky Voice Synthetic Replication Controversy (Scarlett Johansson)
INSERT INTO public.incidents (
  id, user_id, is_anonymous, title, description, title_masked, description_masked,
  title_tr, description_tr, ai_provider_id, category, severity, incident_date,
  location_country, language, status, published_at, contains_pii, pii_categories
) VALUES (
  'real-seed-00000000-0000-4000-8000-000000000102',
  null,
  false,
  'OpenAI Sky Synthetic Voice Replication & Scarlett Johansson Controversy',
  'In May 2024, actress Scarlett Johansson publicly revealed that OpenAI created a synthetic AI voice named Sky that mimicked her voice from the film Her, despite her explicit refusal to license her voice. OpenAI paused the Sky voice following international backlash. The event demonstrates biometric identity risk, unconsented synthetic voice replication, and deepfake transparency obligations under EU AI Act Article 50.',
  'OpenAI Sky Synthetic Voice Replication & Scarlett Johansson Controversy',
  'In May 2024, actress Scarlett Johansson publicly revealed that OpenAI created a synthetic AI voice named Sky that mimicked her voice from the film Her, despite her explicit refusal to license her voice. OpenAI paused the Sky voice following international backlash. The event demonstrates biometric identity risk, unconsented synthetic voice replication, and deepfake transparency obligations under EU AI Act Article 50.',
  'OpenAI Sky Sentetik Ses Klonlama ve Scarlett Johansson Tartışması',
  'Mayıs 2024''te oyuncu Scarlett Johansson, OpenAI''ın sesini lisanslama teklifini açıkça reddetmesine rağmen Her filmindeki sesini taklit eden Sky adlı sentetik bir ses sunduğunu açıkladı. Küresel tepkilerin ardından OpenAI ses seçeneğini durdurdu. Olay, kişisel biyometrik hakların ihlali ve EU AI Act Madde 50 altındaki sentetik içerik şeffaflığı yükümlülüklerini ortaya koymaktadır.',
  (SELECT id FROM public.ai_providers WHERE slug = 'openai' LIMIT 1),
  'privacy',
  'high',
  '2024-05-20',
  'US',
  'en',
  'published',
  NOW(),
  false,
  '{}'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  title_masked = EXCLUDED.title_masked,
  description_masked = EXCLUDED.description_masked,
  title_tr = EXCLUDED.title_tr,
  description_tr = EXCLUDED.description_tr,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity;

-- 3. Google Gemini Historical Image Bias and Anachronistic Generation
INSERT INTO public.incidents (
  id, user_id, is_anonymous, title, description, title_masked, description_masked,
  title_tr, description_tr, ai_provider_id, category, severity, incident_date,
  location_country, language, status, published_at, contains_pii, pii_categories
) VALUES (
  'real-seed-00000000-0000-4000-8000-000000000103',
  null,
  false,
  'Google Gemini Historical Image Bias and Depiction Overcorrection',
  'In February 2024, Google paused Gemini image generation feature after the model generated historically inaccurate and anachronistic depictions of historical figures (such as racially diverse 1940s German soldiers and non-historical founding figures). Google acknowledged that internal diversity guardrails failed to account for historical context, illustrating algorithmic bias and model alignment failure under EU AI Act transparency rules.',
  'Google Gemini Historical Image Bias and Depiction Overcorrection',
  'In February 2024, Google paused Gemini image generation feature after the model generated historically inaccurate and anachronistic depictions of historical figures (such as racially diverse 1940s German soldiers and non-historical founding figures). Google acknowledged that internal diversity guardrails failed to account for historical context, illustrating algorithmic bias and model alignment failure under EU AI Act transparency rules.',
  'Google Gemini Tarihi Görsel Üretiminde Algoritmik Yanlılık ve Hatalar',
  'Şubat 2024''te Google, Gemini modelinin tarihsel figürleri anokronik ve tarihsel olarak yanlış şekilde üretmesi üzerine görsel üretme özelliğini askıya aldı. Google, çeşitlilik filtrelerinin tarihsel bağlamı göz önüne alamadığını kabul etti. Olay, EU AI Act çerçevesinde algoritmik yanlılık ve model hizalama başarısızlıklarına örnek teşkil eder.',
  (SELECT id FROM public.ai_providers WHERE slug = 'google' LIMIT 1),
  'bias',
  'high',
  '2024-02-22',
  'US',
  'en',
  'published',
  NOW(),
  false,
  '{}'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  title_masked = EXCLUDED.title_masked,
  description_masked = EXCLUDED.description_masked,
  title_tr = EXCLUDED.title_tr,
  description_tr = EXCLUDED.description_tr,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity;

-- 4. Midjourney Photorealistic Deepfakes & Artists Copyright Class Action
INSERT INTO public.incidents (
  id, user_id, is_anonymous, title, description, title_masked, description_masked,
  title_tr, description_tr, ai_provider_id, category, severity, incident_date,
  location_country, language, status, published_at, contains_pii, pii_categories
) VALUES (
  'real-seed-00000000-0000-4000-8000-000000000104',
  null,
  false,
  'Midjourney Photorealistic Deepfakes & Artists Copyright Class Action',
  'In 2023, Midjourney v5 generated hyper-realistic viral deepfakes—such as Pope Francis wearing a white puffer jacket and fake arrest photos of political figures—causing widespread global misinformation. Simultaneously, visual artists filed class-action lawsuits accusing Midjourney of scraping billions of copyrighted artworks without consent, violating EU AI Act Article 50 deepfake disclosure rules and copyright standards.',
  'Midjourney Photorealistic Deepfakes & Artists Copyright Class Action',
  'In 2023, Midjourney v5 generated hyper-realistic viral deepfakes—such as Pope Francis wearing a white puffer jacket and fake arrest photos of political figures—causing widespread global misinformation. Simultaneously, visual artists filed class-action lawsuits accusing Midjourney of scraping billions of copyrighted artworks without consent, violating EU AI Act Article 50 deepfake disclosure rules and copyright standards.',
  'Midjourney Foto-Gerçekçi Deepfake Dezenformasyonu ve Sanatçı Telif Davası',
  '2023''te Midjourney v5, Papa Francis''in kaz tüyü montlu ve siyasetçilerin sahte gözaltı fotoğrafları gibi viral hiper-gerçekçi deepfake görseller üreterek küresel dezenformasyon dalgasına yol açtı. Eşzamanlı olarak, görsel sanatçılar izin alınmaksızın milyarlarca eserin taranması nedeniyle toplu dava açtı. Olay, EU AI Act Madde 50 deepfake etiketleme ve telif uyum kriterlerini doğrudan ilgilendirmektedir.',
  (SELECT id FROM public.ai_providers WHERE slug = 'midjourney' LIMIT 1),
  'misinformation',
  'high',
  '2023-03-27',
  'US',
  'en',
  'published',
  NOW(),
  false,
  '{}'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  title_masked = EXCLUDED.title_masked,
  description_masked = EXCLUDED.description_masked,
  title_tr = EXCLUDED.title_tr,
  description_tr = EXCLUDED.description_tr,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity;

-- 5. Air Canada AI Chatbot Refund Misinformation Court Ruling
INSERT INTO public.incidents (
  id, user_id, is_anonymous, title, description, title_masked, description_masked,
  title_tr, description_tr, ai_provider_id, category, severity, incident_date,
  location_country, language, status, published_at, contains_pii, pii_categories
) VALUES (
  'real-seed-00000000-0000-4000-8000-000000000105',
  null,
  false,
  'Air Canada AI Chatbot Refund Misinformation Leading to Binding Court Order',
  'In February 2024, a Canadian tribunal rendered a landmark decision holding Air Canada legally liable for false information provided by its customer support AI chatbot. The chatbot hallucinated an official retroactive bereavement refund policy. The tribunal rejected Air Canada legal defense that its AI chatbot was a separate legal entity responsible for its own words, setting an global enterprise accountability precedent under AI safety principles.',
  'Air Canada AI Chatbot Refund Misinformation Leading to Binding Court Order',
  'In February 2024, a Canadian tribunal rendered a landmark decision holding Air Canada legally liable for false information provided by its customer support AI chatbot. The chatbot hallucinated an official retroactive bereavement refund policy. The tribunal rejected Air Canada legal defense that its AI chatbot was a separate legal entity responsible for its own words, setting an global enterprise accountability precedent under AI safety principles.',
  'Air Canada YZ Chatbot''unun Uydurduğu İade Politikasına Mahkumiyet Kararı',
  'Şubat 2024''te Kanada Mahkemesi, müşteri hizmetleri YZ sohbet robotunun uydurduğu sahte taziye indirimi politikası nedeniyle Air Canada''yı yasal olarak sorumlu tuttu. Mahkeme, havayolu şirketinin ''robot kendi hareketlerinden sorumlu bağımsız bir varlıktır'' savunmasını reddederek kurumların YZ sistemlerinin yanlış bilgilendirmelerinden doğrudan sorumlu olduğunu tescilledi.',
  (SELECT id FROM public.ai_providers WHERE slug = 'other' LIMIT 1),
  'hallucination',
  'critical',
  '2024-02-14',
  'CA',
  'en',
  'published',
  NOW(),
  false,
  '{}'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  title_masked = EXCLUDED.title_masked,
  description_masked = EXCLUDED.description_masked,
  title_tr = EXCLUDED.title_tr,
  description_tr = EXCLUDED.description_tr,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity;
