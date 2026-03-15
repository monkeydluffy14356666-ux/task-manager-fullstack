import CryptoJS from "crypto-js";

const KEY = process.env.ENCRYPTION_KEY;

export function encrypt(text) {
  return CryptoJS.AES.encrypt(String(text), KEY).toString();
}

export function decrypt(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}