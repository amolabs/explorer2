const globalMethods = {};

globalMethods.install = function (Vue, options) {

  // 전역 method
  Vue.prototype.$byteCalc = (param) => {

    let data = parseInt(param);
    let length = data.toString().length;

    // TB : 1000000000000
    // GB : 1000000000
    let res = data;
    let byte = '';

    if (length > 12) {
      res = data / 1000000000000;
      byte = 'T'
    } else if (length > 9) {
      res = data / 1000000000;
      byte = 'G'
    } else if (length > 6) {
      res = data / 1000000;
      byte = 'M';
    } else if (length > 3) {
      res = data / 1000;
      byte = 'K';
    } else {
      res = param
    }
    return Number(res.toFixed(2)).toLocaleString() + ' ' +  byte;
  };
};

export default globalMethods;
