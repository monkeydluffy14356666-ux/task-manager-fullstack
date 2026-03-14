import CryptoJS from "crypto-js";

export function encrypt(data){
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.AES_SECRET
  ).toString();
}

export function decrypt(data){
  const bytes = CryptoJS.AES.decrypt(
    data,
    process.env.AES_SECRET
  );
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}