export const deepCopy = (obj: any) => {
  if (!Array.isArray(obj) && obj instanceof Object) {
    let result = new obj.constructor();
    Object.keys(obj).forEach((k) => {
      result[k] = deepCopy(obj[k]);
    });
    return result;
  } else if (obj instanceof Array) {
    const result: any[] = obj.map((element) => deepCopy(element));
    return result;
  } else return obj;
};
