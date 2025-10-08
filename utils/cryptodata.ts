import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_VAULT_KEY || "my-secret-key";

export function encryptData(data: any) {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
}

export function decryptData(cipher: string) {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}