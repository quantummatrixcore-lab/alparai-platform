const fs = require('fs');

const enPath = 'd:/Alparai/messages/en.json';
const trPath = 'd:/Alparai/messages/tr.json';

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const tr = JSON.parse(fs.readFileSync(trPath, 'utf8'));

const newEn = {
  ...en,
  error: {
    ...en.error,
    somethingWentWrong: 'Something went wrong',
    errorId: 'Error ID:',
    tryAgain: 'Try again'
  },
  feed: {
    ...en.feed,
    shareOnX: 'Share on X',
    shareOnLinkedIn: 'Share on LinkedIn',
    copyForInstagram: 'Copy for Instagram',
    shareOnWhatsApp: 'Share on WhatsApp',
    truthScore: 'Truth Score'
  },
  incident: {
    ...en.incident,
    truthScore: 'TruthScore:',
    confidence: 'Confidence:',
    calculatedUsing: 'Calculated using multi-model consensus and semantic audit engines.',
    auditorEngine: 'Auditor Engine:',
    verified: 'Verified',
    timeline: 'Incident timeline'
  },
  forms: {
    ...en.forms,
    submitting: 'Submitting...',
    submissionTransmitted: 'Submission Transmitted',
    submitAnotherReport: 'Submit Another Report',
    zeroKnowledgeTransmission: 'Zero-Knowledge Transmission',
    encryptingPayload: 'Encrypting Payload...',
    selectReason: 'Select a reason',
    details: 'Details',
    explainIssue: 'Explain the issue and provide supporting facts.',
    contactEmail: 'Contact email',
    cancel: 'Cancel',
    submit: 'Submit',
    title: 'Title',
    thanksForSuggestion: 'Thanks for your suggestion!',
    redirecting: 'Redirecting to suggestions list…'
  },
  admin: {
    ...en.admin,
    socialDashboard: 'Social Dashboard',
    systemAuditLogsTable: 'System Audit Logs Table',
    autopilotPoliciesTable: 'Autopilot Policies Table',
    aiProvidersTable: 'AI Providers Table',
    registeredUsersTable: 'Registered Users Table'
  },
  newsletter: {
    ...en.newsletter,
    gdprCompliant: 'GDPR Compliant',
    emailEncrypted: 'Your email is encrypted and secure.',
    weeklyPulse: 'Weekly Pulse',
    oneDigest: 'One digest email per week. No daily spam.'
  },
  suggestions: {
    ...en.suggestions,
    signInToSuggest: 'Sign in to suggest',
    newSuggestion: 'New suggestion',
    shareFeatureIdea: 'Share a feature idea, a bug, or anything that would make ALPAR better.'
  }
};

const newTr = {
  ...tr,
  error: {
    ...tr.error,
    somethingWentWrong: 'Bir şeyler ters gitti',
    errorId: 'Hata Kimliği:',
    tryAgain: 'Tekrar dene'
  },
  feed: {
    ...tr.feed,
    shareOnX: 'X\'te Paylaş',
    shareOnLinkedIn: 'LinkedIn\'de Paylaş',
    copyForInstagram: 'Instagram için Kopyala',
    shareOnWhatsApp: 'WhatsApp\'ta Paylaş',
    truthScore: 'Doğruluk Skoru'
  },
  incident: {
    ...tr.incident,
    truthScore: 'Doğruluk Skoru:',
    confidence: 'Güven:',
    calculatedUsing: 'Çoklu model fikir birliği ve anlamsal denetim motorları kullanılarak hesaplanmıştır.',
    auditorEngine: 'Denetim Motoru:',
    verified: 'Doğrulandı',
    timeline: 'Olay zaman çizelgesi'
  },
  forms: {
    ...tr.forms,
    submitting: 'Gönderiliyor...',
    submissionTransmitted: 'İhbar İletildi',
    submitAnotherReport: 'Başka Bir Rapor Gönder',
    zeroKnowledgeTransmission: 'Sıfır Bilgi İletimi',
    encryptingPayload: 'Yük Şifreleniyor...',
    selectReason: 'Bir neden seçin',
    details: 'Detaylar',
    explainIssue: 'Sorunu açıklayın ve destekleyici gerçekleri sağlayın.',
    contactEmail: 'İletişim e-postası',
    cancel: 'İptal',
    submit: 'Gönder',
    title: 'Başlık',
    thanksForSuggestion: 'Öneriniz için teşekkürler!',
    redirecting: 'Öneri listesine yönlendiriliyor…'
  },
  admin: {
    ...tr.admin,
    socialDashboard: 'Sosyal Pano',
    systemAuditLogsTable: 'Sistem Denetim Günlükleri Tablosu',
    autopilotPoliciesTable: 'Otopilot Politikaları Tablosu',
    aiProvidersTable: 'Yapay Zeka Sağlayıcıları Tablosu',
    registeredUsersTable: 'Kayıtlı Kullanıcılar Tablosu'
  },
  newsletter: {
    ...tr.newsletter,
    gdprCompliant: 'GDPR Uyumlu',
    emailEncrypted: 'E-postanız şifrelenmiştir ve güvendedir.',
    weeklyPulse: 'Haftalık Nabız',
    oneDigest: 'Haftada bir özet e-posta. Günlük spam yok.'
  },
  suggestions: {
    ...tr.suggestions,
    signInToSuggest: 'Öneri yapmak için giriş yapın',
    newSuggestion: 'Yeni öneri',
    shareFeatureIdea: 'Bir özellik fikri, hata veya ALPAR\'ı daha iyi yapacak herhangi bir şey paylaşın.'
  }
};

fs.writeFileSync(enPath, JSON.stringify(newEn, null, 2), 'utf8');
fs.writeFileSync(trPath, JSON.stringify(newTr, null, 2), 'utf8');
