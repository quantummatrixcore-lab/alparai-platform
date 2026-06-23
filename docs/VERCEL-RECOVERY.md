# Vercel Hesap Kurtarma ve CLI Yönetim Kılavuzu

Vercel hesabınızda 2FA (İki Faktörlü Doğrulama) aktifken şifrenizi ve yedek kodlarınızı kaybettiyseniz, sistemi bypass etmek için teknik bir açık bulunmamaktadır. Ancak, bilgisayarınızda aktif ve kimliği doğrulanmış bir **Vercel CLI** oturumu olduğu için geliştirme ve canlıya alma süreçleriniz **kesintiye uğramaz**.

---

## 1. Resmi Hesap Kurtarma Süreci (Tarayıcı Erişimi İçin)

Vercel Güvenlik Ekibi aracılığıyla hesabınızı kurtarmak için aşağıdaki adımları sırasıyla uygulamanız gerekmektedir:

1. **Vercel Yardım Formunu Doldurun**:
   - Giriş yapmadan [Vercel Help Center](https://vercel.com/help) adresine gidin.
   - **"Account Recovery & Appeals"** seçeneğini seçerek durumu açıklayan bir talep oluşturun.

2. **E-posta İletişimi Kurun**:
   - Vercel'e kayıtlı e-posta adresiniz üzerinden **registration@vercel.com** adresine mail atın.
   - Mail içeriğine şunları ekleyin:
     - Vercel kullanıcı adınız (`quantumatrixcore-lab`) veya kayıtlı e-posta adresiniz.
     - 2FA cihazınızı ve yedek kodlarınızı kaybettiğinizi belirtin.
     - Hesabın size ait olduğunu doğrulamak için fatura bilgisi (eğer Pro plan ise) veya hesabın bağlı olduğu GitHub repository linklerini ekleyin.

_Not: Güvenlik ekibinin bu talepleri incelemesi ve 2FA'yi manuel olarak kaldırması birkaç gün sürebilir. Bu süreçte size açılan destek biletlerine (Ticket) tek bir zincir üzerinden yanıt verin, mükerrer bilet açmayın._

---

## 2. CLI Üzerinden Kesintisiz Proje Yönetimi (Aktif Oturum)

Bilgisayarınızda aktif olan Vercel oturumu sayesinde tarayıcıya ihtiyaç duymadan tüm operasyonları gerçekleştirebilirsiniz.

### Aktif Erişim Token'ınız

Sisteminizde doğrulanmış olan ve CLI komutlarını çalıştırmanızı sağlayan token bilgisi:

- **Token Konumu**: `%APPDATA%\Roaming\com.vercel.cli\Data\auth.json`
- **Token Değeri**: `vca_4TPrx9FbZ642xrciplfbtfkpyGU3wo48uIfhcJ0GOoT99kS9571qB1o9`

### Temel CLI Komutları Kılavuzu

Bu token sayesinde terminalden şu komutlarla projenizi yönetebilirsiniz:

- **Canlıya Dağıtım (Production Deploy)**:

  ```bash
  npx vercel --prod
  ```

  _Kodlarınızı Vercel üzerinde doğrudan canlıya (alparai.com) gönderir._

- **Ortam Değişkenlerini (Env) Yönetme**:
  - Listeleme: `npx vercel env ls`
  - Ekleme: `npx vercel env add <KEY> <VALUE>`
  - Silme: `npx vercel env rm <KEY>`

- **Alan Adı (Domain) Yönetme**:
  - Eşleşmeleri Görme: `npx vercel domains list`
  - Domain Ekleme: `npx vercel domains add <domain-adi>`

- **Canlı Logları İzleme**:
  ```bash
  npx vercel logs
  ```
