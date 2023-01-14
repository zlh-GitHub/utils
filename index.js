/**
 * 返回值类型
 * @param {any} obj
 * @returns
 */
const type = (obj) =>
  Reflect.apply(Object.prototype.toString, obj, [])
    .replace(/^\[object\s(\w+)\]$/, "$1")
    .toLowerCase();
