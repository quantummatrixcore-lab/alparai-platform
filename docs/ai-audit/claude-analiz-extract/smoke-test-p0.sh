#!/usr/bin/env bash
# smoke-test-p0.sh
#
# ALPAR AI — P0 sorunlarının otomatik kontrolü.
# Amaç: MASTER_CHECKLIST.md'deki P0 maddelerinin (ALP-001..004) sessizce yeniden
# açılmasını önlemek. Her deploy sonrası (veya CI'da her PR'da) çalıştırılmalı.
#
# KULLANIM: Bu bir ŞABLONDUR. URL'leri ve kontrol mantığını kendi domain/API
# yapınıza göre uyarlayın. `jq` ve `curl` gerektirir.
#
# Çıkış kodu 0 = tüm kontroller geçti. Çıkış kodu 1 = en az bir P0 hâlâ/yeniden açık.

set -uo pipefail
BASE_URL="${ALPAR_BASE_URL:-https://www.alparai.com}"
FAIL=0

pass() { echo "  ✅ $1"; }
fail() { echo "  ❌ $1"; FAIL=1; }

echo "== ALP-003: /transparency 404 kontrolü =="
for locale in en tr; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/${locale}/transparency")
  if [ "$code" = "200" ]; then
    pass "/${locale}/transparency → 200"
  else
    fail "/${locale}/transparency → ${code} (beklenen: 200)"
  fi
done

echo "== ALP-004: About sayfasında çift-locale kırık link kontrolü =="
about_html=$(curl -s "${BASE_URL}/en/about")
if echo "$about_html" | grep -q "/en/en/"; then
  fail "About sayfasında '/en/en/' deseni bulundu (çift locale linki)"
else
  pass "About sayfasında çift-locale linki yok"
fi

echo "== ALP-002: Hero sayacı ile /incidents sayısının eşleşmesi =="
# NOT: Gerçek projede bu, hero sayacının render ettiği sayıyı (HTML'den veya bir
# /api/stats endpoint'inden) ve /incidents'taki published kayıt sayısını
# karşılaştırmalı. Aşağıdaki örnek, varsayımsal bir API endpoint'i kullanır —
# kendi backend'inize göre değiştirin.
hero_count=$(curl -s "${BASE_URL}/api/stats/verified-incidents" | jq -r '.count // "ERROR"')
if [ "$hero_count" = "ERROR" ] || [ -z "$hero_count" ]; then
  fail "Hero sayaç API'sinden sayı alınamadı — endpoint'i kendi projenize göre güncelleyin"
elif [ "$hero_count" = "0" ]; then
  fail "Hero sayacı 0 gösteriyor — published incident filtresi kontrol edilmeli"
else
  pass "Hero sayacı ${hero_count} gösteriyor (0 değil)"
fi

echo "== ALP-001: Leaderboard / About yeni tasarım sistemi işaretçisi =="
# NOT: Yeni tasarım sisteminize özgü, HTML'de bulunan benzersiz bir class/attribute
# seçin (örn. data-design-system="v2") ve aşağıyı buna göre güncelleyin.
for path in "/en/leaderboard" "/en/about"; do
  html=$(curl -s "${BASE_URL}${path}")
  if echo "$html" | grep -q 'data-design-system="v2"'; then
    pass "${path} → yeni tasarım sistemi işaretçisi bulundu"
  else
    fail "${path} → yeni tasarım sistemi işaretçisi BULUNAMADI (hâlâ eski layout olabilir)"
  fi
done

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "TÜM P0 KONTROLLERİ GEÇTİ."
  exit 0
else
  echo "EN AZ BİR P0 KONTROLÜ BAŞARISIZ. MASTER_CHECKLIST.md'yi güncelleyin, durumu 🔴 olarak işaretleyin."
  exit 1
fi
