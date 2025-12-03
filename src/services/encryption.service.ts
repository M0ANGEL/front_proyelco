// // src/services/encryption.service.ts
// import CryptoJS from 'crypto-js';

// class EncryptionService {
//   private key: string;

//   constructor() {
//     this.key = this.getEncryptionKey();
//   }

//   private getEncryptionKey(): string {
//     // 1. Intentar obtener clave del environment
//     const envKey = import.meta.env.VITE_ENCRYPTION_KEY;
//     if (envKey && envKey.length >= 16) {
//       return envKey;
//     }

//     // 2. Intentar obtener clave del localStorage
//     const storedKey = localStorage.getItem('encryption_key');
//     if (storedKey) {
//       return storedKey;
//     }

//     // 3. Generar nueva clave y guardarla
//     const newKey = this.generateRandomKey();
//     localStorage.setItem('encryption_key', newKey);
//     return newKey;
//   }

//   private generateRandomKey(): string {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
//     let result = '';
//     for (let i = 0; i < 32; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   }

//   encrypt(data: any): string {
//     try {
//       const jsonString = JSON.stringify(data);
//       const encrypted = CryptoJS.AES.encrypt(jsonString, this.key).toString();
//       return encrypted;
//     } catch (error) {
//       console.error('❌ Encryption error:', error);
//       throw new Error('Failed to encrypt data');
//     }
//   }

//   decrypt(encryptedData: string): any {
//     try {
//       if (!this.isEncrypted(encryptedData)) {
//         throw new Error('Data is not encrypted or is corrupted');
//       }

//       const bytes = CryptoJS.AES.decrypt(encryptedData, this.key);
//       const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
//       if (!decryptedString) {
//         throw new Error('Failed to decrypt data - invalid key or corrupted data');
//       }

//       return JSON.parse(decryptedString);
//     } catch (error) {
//       console.error('❌ Decryption error:', error);
//       throw error;
//     }
//   }

//   isEncrypted(data: string): boolean {
//     try {
//       if (!data || typeof data !== 'string') {
//         return false;
//       }

//       // Los datos cifrados con CryptoJS suelen tener un formato específico
//       const encryptedRegex = /^[A-Za-z0-9+/=]+$/;
//       return encryptedRegex.test(data) && data.length > 16;
//     } catch {
//       return false;
//     }
//   }

//   // Método para regenerar clave
//   regenerateKey(): void {
//     try {
//       const newKey = this.generateRandomKey();
//       this.key = newKey;
//       localStorage.setItem('encryption_key', newKey);
      
//       // Limpiar datos cifrados con la clave anterior
//       localStorage.removeItem('encrypted_user_data');
      
//     } catch (error) {
//       console.error('❌ Error regenerating encryption key:', error);
//     }
//   }
// }

// // Exportar una instancia singleton
// export const encryptionService = new EncryptionService();


import CryptoJS from 'crypto-js';

class EncryptionService {
  private key: string;

  constructor() {
    this.key = this.getEncryptionKey();
  }

  private getEncryptionKey(): string {
    // 1. Siempre se debe usar UNA clave fija del env
    const envKey = import.meta.env.VITE_ENCRYPTION_KEY;
    if (envKey && envKey.length >= 16) {
      return envKey;
    }

    // Si no existe, NO generar claves aleatorias
    throw new Error(
      "❌ Faltó definir VITE_ENCRYPTION_KEY en el .env (mínimo 16 caracteres)"
    );
  }

  encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonString, this.key).toString();
    } catch (error) {
      console.error("❌ Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  decrypt(encryptedData: string): any {
    try {
      if (!this.isEncrypted(encryptedData)) {
        throw new Error("Data is not encrypted or invalid");
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, this.key);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        throw new Error("Failed to decrypt: wrong key or corrupted data");
      }

      return JSON.parse(decryptedString);
    } catch (error) {
      console.error("❌ Decryption error:", error);
      throw error;
    }
  }

  isEncrypted(data: string): boolean {
    // CryptoJS ALWAYS starts encrypted data with this prefix
    return typeof data === "string" && data.startsWith("U2FsdGVkX1");
  }

  regenerateKey(): void {
    console.warn("⚠️ regenerateKey() ya no debe ser usado porque destruye datos anteriores");
  }
}

export const encryptionService = new EncryptionService();
