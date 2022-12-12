export const deepCopy = (obj: any) => {
    if (obj instanceof Object) {
        let result = new obj.constructor();
        Object.keys(obj).forEach(k => {
            result[k] = deepCopy(obj[k]);
        })
        return result;
    }
    else if (obj instanceof Array) {
        let result = obj.map(element => deepCopy(element));
    }
    else return obj;
}