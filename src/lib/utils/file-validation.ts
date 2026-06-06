const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  "image/jpeg": [new Uint8Array([0xFF, 0xD8, 0xFF])],
  "image/png": [new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])],
  "image/webp": [new Uint8Array([0x52, 0x49, 0x46, 0x46])],
  "image/gif": [new Uint8Array([0x47, 0x49, 0x46, 0x38])],
  "application/pdf": [new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D])],
};

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",
  "video/webm",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileType(mimeType: string): FileValidationResult {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return { valid: false, error: `File type ${mimeType} is not allowed` };
  }
  return { valid: true };
}

export function validateFileSize(sizeBytes: number): FileValidationResult {
  if (sizeBytes > MAX_FILE_SIZE) {
    return { valid: false, error: `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }
  return { valid: true };
}

export function validateMagicBytes(buffer: ArrayBuffer, claimedMimeType: string): FileValidationResult {
  const expectedBytes = MAGIC_BYTES[claimedMimeType];
  if (!expectedBytes) {
    return { valid: true };
  }
  const header = new Uint8Array(buffer.slice(0, 16));
  const matches = expectedBytes.some((magic) =>
    magic.every((byte, index) => header[index] === byte)
  );
  if (!matches) {
    return { valid: false, error: "File content does not match its declared type" };
  }
  return { valid: true };
}

export function validateFile(file: { mimeType: string; sizeBytes: number; buffer?: ArrayBuffer }): FileValidationResult {
  const typeCheck = validateFileType(file.mimeType);
  if (!typeCheck.valid) return typeCheck;
  const sizeCheck = validateFileSize(file.sizeBytes);
  if (!sizeCheck.valid) return sizeCheck;
  if (file.buffer) {
    const magicCheck = validateMagicBytes(file.buffer, file.mimeType);
    if (!magicCheck.valid) return magicCheck;
  }
  return { valid: true };
}
