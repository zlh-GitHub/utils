/**
 * 浮点数加减乘除运算，来自《JavaScript重难点实例精讲》
 */
const operationObj = {
  /**
   * 处理传入的参数，不管传入的是数组还是以逗号分隔的参数都处理为数组
   * @param args
   * @returns {*}
   */
  getParam(args) {
    return Array.prototype.concat.apply([], args);
  },

  /**
   * 获取每个数的乘数因子，根据小数位数计算
   * 1.首先判断是否有小数点，如果没有，则返回1;
   * 2.有小数点时，将小数位数的长度作为Math.pow()函数的参数进行计算 
   * 例如2的乘数因子为1，2.01的乘数因子为100
   * @param x
   * @returns {number}
   */
  multiplier(x) {
    const parts = x.toString().split('.');
    return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
  },

  /**
   * 获取多个数据中最大的乘数因子
   * 例如1.3的乘数因子为10，2.13的乘数因子为100 
   * 则1.3和2.13的最大乘数因子为100
   * @returns {*}
   */
  correctionFactor() {
    const args = Array.prototype.slice.call(arguments);
    const argArr = this.getParam(args);
    return argArr.reduce((accum, next) => {
      const num = this.multiplier(next);
      return Math.max(accum, num);
    }, 1);
  },

  /**
   * 加法运算
   * @param args
   * @returns {number}
   */
  add(...args) {
    const calArr = this.getParam(args);
    // 获取参与运算值的最大乘数因子
    const corrFactor = this.correctionFactor(calArr);
    const sum = calArr.reduce((accum, curr) =>
      // 将浮点数乘以最大乘数因子，转换为整数参与运算
      accum + Math.round(curr * corrFactor),
    0);
    // 除以最大乘数因子
    return sum / corrFactor;
  },

  /**
   * 减法运算
   * @param args
   * @returns {number} 
   */
  subtract(...args) {
    const calArr = this.getParam(args);
    const corrFactor = this.correctionFactor(calArr);
    const diff = calArr.reduce((accum, curr, curIndex) => {
      // reduce()函数在未传入初始值时，curIndex从1开始，第一位参与运算的值需要
      // 乘以最大乘数因子
      if (curIndex === 1) {
        return Math.round(accum * corrFactor) - Math.round(curr * corrFactor);
      }
      // accum作为上一次运算的结果，就无须再乘以最大因子
      return Math.round(accum) - Math.round(curr * corrFactor);
    });
    // 除以最大乘数因子
    return diff / corrFactor;
  },

  /**
   * 乘法运算
   * @param args
   * @returns {*}
   */
  multiply(...args) {
    let calArr = this.getParam(args);
    const corrFactor = this.correctionFactor(calArr);
    calArr = calArr.map(item =>
      // 乘以最大乘数因子
      item * corrFactor
    );
    const multi = calArr.reduce((accum, curr) => Math.round(accum) * Math.round(curr), 1);
    // 除以最大乘数因子
    return multi / Math.pow(corrFactor, calArr.length);
  },

  /**
   * 除法运算
   * @param args 
   * @returns {*}
   */
  divide(...args) {
    const calArr = this.getParam(args);
    const quotient = calArr.reduce((accum, curr) => {
      const corrFactor = this.correctionFactor(accum, curr);
      // 同时转换为整数参与运算
      return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
    });
    return quotient;
  },
};
