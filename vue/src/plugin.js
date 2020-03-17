const globalMethods = {};

globalMethods.install = function (Vue, options) {
  Vue.prototype.$byteCalc = (param) => {
    //console.log('byte calc', param);
    let data;
    if (param === undefined) {
      data = 0;
    } else {
      data = parseInt(param);
    }
    let units = ['', 'K', 'M', 'G', 'T'];

    var idx = 0;
    while (data >= 1024 && idx < 4) {
      idx++;
      data /= 1024;
    }
    return Number(data.toFixed(2)).toLocaleString() + ' ' +  units[idx];
  };
};

export default globalMethods;
