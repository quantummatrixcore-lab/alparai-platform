# KVKK Compliance

> 6698 sayılı Kişisel Verilerin Korunması Kanunu — Uyumluluk Notları

## Veri sorumlusu

ALPAR AI ("Veri Sorumlusu" sıfatıyla) aşağıdaki kişisel verileri işler.

## İşlenen veri kategorileri

| Kategori        | Veri türü                                | İşleme amacı                              | Hukuki sebep (KVKK m.5/6)         |
| --------------- | ---------------------------------------- | ----------------------------------------- | --------------------------------- |
| Kimlik          | Ad, e-posta, OAuth sağlayıcı meta verisi | Hesap oluşturma, oturum yönetimi           | Açık rıza (m.5/1)                |
| İçerik          | Olay başlık/açıklaması, kanıt dosyaları  | Platform işletme, moderasyon              | Açık rıza (m.5/1) + Meşru menfaat|
| İletişim        | IP, kullanıcı aracısı (hash'lenmiş)      | Güvenlik, hız sınırlaması, kötüye kullanım| Meşru menfaat (m.5/2-f)          |
| Çerez           | Oturum çerezi, tercih çerezi             | Oturum yönetimi, kullanıcı tercihleri     | Açık rıza (m.5/1)                |

## Maskeleme (PII Guardian)

Başvurular, depolanmadan önce **PII Guardian** tarafından taranır. Tespit edilen kişisel veriler (e-posta, telefon, TC, IBAN, kredi kartı, API anahtarı vb.) otomatik olarak maskelenir. Ham metin hiçbir zaman herkese açık kolonlara yazılmaz.

## Veri saklama

- Hesap verisi: hesap silinene kadar.
- Yayınlanan olaylar: PII maskelenmiş olarak süresiz (şeffaflık amacıyla).
- Reddedilen olaylar: 90 gün sonra silinir.
- Denetim günlüğü: 2 yıl.
- Yedekler: 30 gün.

## Veri sahibinin hakları (KVKK m.11)

- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenmişse buna ilişkin bilgi talep etme
- İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
- Yurt içinde/dışında aktarıldığı 3. kişileri öğrenme
- Eksik/yanlış işlenen verilerin düzeltilmesini isteme
- Şartlar oluştuğunda silinmesini/yok edilmesini isteme
- Otomatik sistemlerle aşağılayıcı sonuç doğan analizlere itiraz etme

## Başvuru

Haklarınızı kullanmak için **privacy@alparai.online** adresine kimliğinizi tevsik eden belge ile yazılı başvuru yapın. 30 gün içinde yanıtlanır.

KVKK Kurulu'na şikâyet hakkınız saklıdır (https://www.kvkk.gov.tr).

## Uluslararası aktarım

Veriler AB (Frankfurt) bölgesinde barındırılır. AEA dışı aktarımlar için standart sözleşme maddeleri (SCC) kullanılır.

## Çocuklar

Platform 18+ kullanıma yöneliktir. Kayıt olarak 18+ olduğunuzu onaylarsınız.
