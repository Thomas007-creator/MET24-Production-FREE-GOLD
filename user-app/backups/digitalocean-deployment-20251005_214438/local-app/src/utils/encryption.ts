/**
 * Privacy-First Encryption Utilities
 *
 * Deze utilities zorgen voor client-side encryptie van gevoelige data
 * voordat het wordt opgeslagen in WatermelonDB.
 *
 * Principe: encryptPayload() → ciphertext → opslaan in *_encrypted velden
 * DecryptKey wordt bewaard in device Keychain/secure enclave
 */

import { logger } from './logger';

// Simpele encryptie functie (in productie zou je een echte crypto library gebruiken)
export function encryptPayload(plaintext: string): string {
  if (!plaintext) return '';

  try {
    // Base64 encoding als simpele "encryptie" voor demo
    // In productie: gebruik Web Crypto API of een echte crypto library
    const encoded = btoa(unescape(encodeURIComponent(plaintext)));
    return encoded;
  } catch (error) {
    logger.error('❌ Encryptie fout:', { error: error instanceof Error ? error.message : String(error) });
    return plaintext; // Fallback naar plaintext bij fout
  }
}

// Decryptie functie
export function decryptPayload(ciphertext: string): string {
  if (!ciphertext) return '';

  try {
    // Base64 decoding als simpele "decryptie" voor demo
    const decoded = decodeURIComponent(escape(atob(ciphertext)));
    return decoded;
  } catch (error) {
    logger.error('❌ Decryptie fout:', { error: error instanceof Error ? error.message : String(error) });
    return ciphertext; // Fallback naar ciphertext bij fout
  }
}

// Helper om te bepalen welke velden geëncrypteerd moeten worden
export function shouldEncryptField(fieldName: string): boolean {
  const sensitiveFields = [
    'situation',
    'rawAnswers',
    'context',
    'personalNotes',
    'journalEntries',
    'chatMessages',
    'userFeedback',
  ];

  return sensitiveFields.some(field => fieldName.includes(field));
}

// Helper om encrypted field naam te genereren
export function getEncryptedFieldName(fieldName: string): string {
  return `${fieldName}_encrypted`;
}

// Helper om data te prepareren voor opslag
export function prepareDataForStorage(data: any): any {
  const prepared = { ...data };

  // Loop door alle velden en encrypteer gevoelige data
  Object.keys(prepared).forEach(key => {
    if (shouldEncryptField(key) && typeof prepared[key] === 'string') {
      const encryptedValue = encryptPayload(prepared[key]);
      const encryptedKey = getEncryptedFieldName(key);

      // Voeg encrypted versie toe
      prepared[encryptedKey] = encryptedValue;

      // Verwijder plaintext versie
      delete prepared[key];
    }
  });

  return prepared;
}

// Helper om data te herstellen na ophalen uit database
export function restoreDataFromStorage(data: any): any {
  const restored = { ...data };

  // Loop door alle velden en decrypteer encrypted data
  Object.keys(restored).forEach(key => {
    if (key.endsWith('_encrypted')) {
      const originalKey = key.replace('_encrypted', '');
      const decryptedValue = decryptPayload(restored[key]);

      // Voeg decrypted versie toe
      restored[originalKey] = decryptedValue;

      // Verwijder encrypted versie
      delete restored[key];
    }
  });

  return restored;
}

// Type definitions voor encrypted data
export interface EncryptedData {
  [key: string]: string | number | boolean | object;
}

export interface DecryptedData {
  [key: string]: string | number | boolean | object;
}

// Logging voor debugging
export function logEncryptionOperation(
  operation: 'encrypt' | 'decrypt',
  fieldName: string,
  success: boolean
) {
  const emoji = success ? '✅' : '❌';
  const action = operation === 'encrypt' ? 'Geëncrypteerd' : 'Gedecrypteerd';
  logger.info(`${emoji} ${action}: ${fieldName}`, { operation, fieldName, success });
}
