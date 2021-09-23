/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2021-09-14 17:14:57
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/utils/crypto.ts
 * @Description: 由limit创建！
 */
/**
 * 工具类
 */
import CryptoJS from 'crypto-js'
export default {//加密
  encrypt(word: string, keyStr?: string){ 
    keyStr = keyStr ? keyStr : 'aizhixinaizhixin';
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
  },
  //解密
  decrypt(word: string, keyStr?: string){  
    keyStr = keyStr ? keyStr : 'aizhixinaizhixin';
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }

}