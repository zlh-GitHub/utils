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

/**
 * 格式化时间
 * @param {String | Date ｜ Number} time 时间戳/时间字符串/Date对象
 * @param {String} fmt 格式
 * @returns {String}
 * @example
 *    年-月-日 时:分:秒
 *    yyyy-MM-dd hh:mm:ss:SS => 2016-10-29 10:22:22.176
 *    yyyy年MM月dd日 hh:mm:ss:SS => 2016年10月29日 10:22:22.176
 */
const formatDate = (time, fmt) => {
  const date = new Date(time);
  const obj = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds(),
  };

  for (const k in obj) {
    const re = new RegExp('(' + k + ')');
    fmt = fmt.replace(re, String(obj[k]).padStart(2, 0));
  }

  return fmt;
};

/**
 * 将url中? 后面的参数, 变成一个json
 * @param {String} url
 * @return {Object}
 * @example
 * '#hash?a=1&b=3' => {a: 1, b: 3}
 * '?a=1&b=3#hash' => {a: 1, b: 3}
 * '?a=1&b=3#hash?a=2&b=4' => {a: 2, b: 4}
 */
const getUrlParams = sourceStr => {
  // 防止hash值, 影响参数名称
  let search;
  if (sourceStr) {
    // 只取最后一个?号后面的参数
    search =
      sourceStr.indexOf('?') > -1
        ? sourceStr.split('?').slice(-1).toString()
        : sourceStr;
  } else {
    // 链接中的最后一个
    search = location.search.substr(1);
    const hashSearch = location.hash.split('?')[1] || '';
    search = search ? `${search}&${hashSearch}` : hashSearch;
  }

  // 如果没有, 则返回空对象
  if (!search) {
    return {};
  }
  const searchArr = decodeURIComponent(search).split('&');

  const urlParams = {};
  searchArr.forEach(str => {
    const paramArr = str.split('=');
    // 过滤空字符串
    if (!paramArr[0]) {
      return false;
    }
    // 后面重复的参数覆盖前面的参数
    urlParams[paramArr[0]] = unescape(paramArr[1]);
  });
  return urlParams;
};

/**
 * 延迟指定毫秒的时间
 * @param {Number} mill 毫秒，默认2000
 * @returns {Promise}
 */
const delay = (mill = 2000) => new Promise(r => setTimeout(r, mill));

/**
 * compose函数，按传递的函数倒叙执行
 * @param  {...Function} funcs 
 * @returns {any}
 */
const compose = (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

/**
 * 1天的毫秒数
 */
const ONE_DAY_OF_MILL = 86400000;

/**
 * 返回当天的结束时间戳，即当天23:59:59的时间戳
 * @param {Date} target 时间对象
 * @returns {Number}
 */
const getTargetDayEndTimeStamp = (target = new Date()) => target.setHours(0, 0, 0, 0) + ONE_DAY_OF_MILL - 1;

/**
 * 返回当天的开始时间戳，即当天00:00:00的时间戳
 * @param {Date} target 时间对象
 * @returns {Number}
 */
const getTargetDayStartTimeStamp = (target = new Date()) => target.setHours(0, 0, 0, 0);

/**
 * 返回指定日期的时间戳范围
 * @param {Date} target 时间对象
 * @returns {{ start: Number, end: Number }}
 */
const getTargetDayTimeStampRange = (target = new Date()) => ({
  start: getTargetDayStartTimeStamp(target),
  end: getTargetDayEndTimeStamp(target),
});

/**
 * 返回指定时间所在星期的开始时间戳
 * 星期一的0:0:0.0 - 星期天的23:59:59.999
 * @param {Date} target 时间对象
 * @returns {Number}
 */
const getTargetWeekStartTimeStamp = (target = new Date()) => {
  const targetYear = target.getFullYear();
  const targetMonth = target.getMonth();
  const targetDate = target.getDate();
  const targetDay = target.getDay() || 7;
  return new Date(targetYear, targetMonth, targetDate - targetDay + 1).setHours(0, 0, 0, 0);
};

/**
 * 返回指定时间所在星期的结束时间戳
 * @param {Date} target 时间对象
 * @returns {Date}
 */
const getTargetWeekEndTimeStamp = (target = new Date()) => {
  const targetYear = target.getFullYear();
  const targetMonth = target.getMonth();
  const targetDate = target.getDate();
  const targetDay = target.getDay() || 7;
  return new Date(targetYear, targetMonth, targetDate + (7 - targetDay)).setHours(23, 59, 59, 999);
};

/**
 * 返回指定日期所在星期的时间戳范围
 * @param {Date} target 时间对象
 * @returns {{ start: Number, end: Number }}
 */
const getTargetWeekTimeStampRange = (target = new Date()) => ({
  start: getTargetWeekStartTimeStamp(target),
  end: getTargetWeekEndTimeStamp(target),
});
