import CryptoJS from 'crypto-js'
import config from '../config'
export const secure = () => {
    const SECRET_KEY = config.CRYPTOJS_SECRET_KEY!;
    const encrypt = (message:string) => {
        const encrypted = CryptoJS.AES.encrypt(message, SECRET_KEY)
        return encrypted.toString()
    }
    const decrypt = (data:string) => {
        const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY)
        return decrypted.toString(CryptoJS.enc.Utf8)
    }
    const setItem = (key:string, item:string) => {
        localStorage.setItem(key,encrypt(item))
    }
    const getItem = (key:string) => {
        const encrypted = localStorage.getItem(key)
        if(!encrypted) {
            return null
        }
        else {
            return decrypt(encrypted)
        }
        
    }
    const removeItem = (key:string) => {
        localStorage.removeItem(key)
    }
    const local = () => {
        return {
            setItem, getItem, removeItem
        }
    }
    const encryptWrapper = (data:any) => {
        return encrypt(data)
    }
    const decryptWrapper = (encryptStr:string) => {
        try {
            return decrypt(encryptStr)
        } catch (error) {
            console.log('이거에러')
            return '이거에러'//encryptStr
        }
    }


    const wrapper = () => {
        return {
            encryptWrapper, decryptWrapper
        }
    }
    //secure().local()
    return {
        local, wrapper
    }
    //secure().wrapper()
    //
}


// there is no need to stringify/parse you objects before and after storing.
