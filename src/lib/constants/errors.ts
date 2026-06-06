export const ErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  PII_DETECTED: "PII_DETECTED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  DUPLICATE_VOTE: "DUPLICATE_VOTE",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const ErrorMessages: Record<ErrorCode, { en: string; tr: string }> = {
  UNAUTHORIZED: { en: "You must be signed in.", tr: "Giriş yapmanız gerekiyor." },
  FORBIDDEN: { en: "You don't have permission.", tr: "Bu işlem için yetkiniz yok." },
  VALIDATION_ERROR: { en: "Invalid input.", tr: "Geçersiz giriş." },
  RATE_LIMITED: { en: "Too many requests. Please try again later.", tr: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." },
  NOT_FOUND: { en: "Not found.", tr: "Bulunamadı." },
  INTERNAL_ERROR: { en: "Something went wrong.", tr: "Bir hata oluştu." },
  PII_DETECTED: { en: "Personal data detected and redacted.", tr: "Kişisel veri tespit edildi ve maskelendi." },
  FILE_TOO_LARGE: { en: "File is too large.", tr: "Dosya çok büyük." },
  INVALID_FILE_TYPE: { en: "Invalid file type.", tr: "Geçersiz dosya türü." },
  DUPLICATE_VOTE: { en: "Already voted.", tr: "Zaten oy kullandınız." },
  DUPLICATE_ENTRY: { en: "This entry already exists.", tr: "Bu kayıt zaten mevcut." },
  SERVICE_UNAVAILABLE: { en: "Service temporarily unavailable.", tr: "Hizmet geçici olarak kullanılamıyor." },
};
