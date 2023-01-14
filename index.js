/**
 * 返回值类型
 * @param {any} obj
 * @returns
 */
const type = (obj) =>
  Reflect.apply(Object.prototype.toString, obj, [])
    .replace(/^\[object\s(\w+)\]$/, "$1")
    .toLowerCase();

/**
 * 防抖
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 * @returns
 */
const debounce = (func, wait, immediate) => {
  let timerId, result;

  const debounced = function (...args) {
    const context = this;

    if (timerId) {
      clearTimeout(timerId);
    }
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timerId;
      timerId = setTimeout(function () {
        timerId = null;
      }, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
    } else {
      timerId = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = null;
  };

  return debounced;
};
