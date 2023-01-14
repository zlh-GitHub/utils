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

/**
 * 节流
 * @param {Function} func
 * @param {Number} wait
 * @param {{ leading: Boolean, trailing: Boolean }} options leading: 鼠标移入是否能立刻执行  trailing: 停止触发的时是否还能再执行一次
 * @returns
 */
const throttle = (func, wait, options = {}) => {
  const { leading, trailing } = options;
  let prevTimestamp = 0, timerId;

  const throttled = function (...args) {
    const now = Date.now();
    if (!prevTimestamp && !leading) {
      // 是第一次执行并且禁用
      prevTimestamp = now; // 这样的话会使得下面的代码因为now - prevTimestamp不够wait秒而不立刻执行
    }
    const left = wait - (now - prevTimestamp);
    const context = this;
    if (left <= 0 || left > wait) {
      if (timerId) {
        // 因为上一秒 left <= 0 || left > wait 未满足而设置了定时器，所以要取消掉
        clearTimeout(timerId);
        timerId = null;
      }
      func.apply(context, args);
      prevTimestamp = now;
    } else if (!timerId && trailing) {
      // 这里就是最后一次执行的代码
      timerId = setTimeout(() => {
        prevTimestamp = leading ? Date.now() : 0; // 如果是禁用第一次执行，则需要重置prevTimestamp
        func.apply(context, args);
        timerId = null;
      }, wait);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timerId);
    prevTimestamp = 0;
    timerId = null;
  };

  return throttled;
};
