// src/services/encryption.service.ts
class EncryptionService {
  private readonly algorithm = 'AES-GCM';
  private readonly key: CryptoKey | null = null;

  constructor() {
    this.initKey();
  }

  private async initKey() {
    // Usar una clave derivada de un secret fijo + domain
    const secret = import.meta.env.VITE_ENCRYPTION_SECRET || 'proyelco-default-secret-2024';
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    this.key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('proyelco-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: this.algorithm, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data: any): Promise<string> {
    if (!this.key) throw new Error('Encryption key not initialized');
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      this.key,
      encodedData
    );

    // Combinar IV + datos encriptados en un string base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(encryptedData: string): Promise<any> {
    if (!this.key) throw new Error('Encryption key not initialized');

    try {
      // Convertir de base64 a Uint8Array
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // Extraer IV (primeros 12 bytes) y datos encriptados
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: this.algorithm, iv },
        this.key,
        encrypted
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decrypted));
    } catch (error) {
      console.error('❌ Error decrypting data:', error);
      return null;
    }
  }

  // Verificar si los datos están cifrados (heurística simple)
  isEncrypted(data: string): boolean {
    try {
      // Los datos cifrados en base64 tienen una estructura específica
      if (data.length % 4 !== 0) return false;
      const decoded = atob(data);
      return decoded.length > 12; // Debe tener IV + datos
    } catch {
      return false;
    }
  }
}

export const encryptionService = new EncryptionService();