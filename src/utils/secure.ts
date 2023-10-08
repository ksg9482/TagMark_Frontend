import CryptoJS from "crypto-js";
import config from "../config";
export const secure = () => {
  const SECRET_KEY = config.CRYPTOJS_SECRET_KEY || "";
  const encrypt = (message: string) => {
    const encrypted = CryptoJS.AES.encrypt(message, SECRET_KEY);
    return encrypted.toString();
  };
  const decrypt = (data: string) => {
    const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY);

    return decrypted.toString(CryptoJS.enc.Utf8);
  };
  const setItem = (key: string, item: string) => {
    localStorage.setItem(key, encrypt(item));
  };
  const getItem = (key: string) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) {
      return null;
    } else {
      return decrypt(encrypted);
    }
  };
  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };
  const local = () => {
    return {
      setItem,
      getItem,
      removeItem,
    };
  };
  const encryptWrapper = (data: any) => {
    return encrypt(data);
  };
  const decryptWrapper = (encryptStr: string) => {
    try {
      const result = decrypt(encryptStr);
      //url이 암호화, 비암호화 통일이 안됨. + 로컬, 온라인 인풋도 다름
      if (result.length <= 0) {
        return encryptStr;
      }
      return result;
    } catch (error) {
      return encryptStr;
    }
  };

  const wrapper = () => {
    return {
      encryptWrapper,
      decryptWrapper,
    };
  };
  return {
    local,
    wrapper,
  };
};
