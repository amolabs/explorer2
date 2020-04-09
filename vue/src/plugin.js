const globalMethods = {};

globalMethods.install = function (Vue, options) {
  Vue.prototype.$byteHuman = (param) => {
    let data = param;
    if (data === undefined) {
      data = 0;
    }
    let units = ['', 'K', 'M', 'G', 'T'];

    var idx = 0;
    while (data >= 1024 && idx < 4) {
      idx++;
      data /= 1024;
    }
    return Number(data.toFixed(2)).toLocaleString() + ' ' +  units[idx];
  };

  Vue.prototype.$amoHuman = (param) => {
    //console.log('byte calc', param);
    let data = param;
    if (data === undefined) {
      data = 0;
    }
    data /= 1000000000000000000; // mote to amo
    let units = ['', 'K', 'M', 'G', 'T'];

    var idx = 0;
    while (data >= 1000 && idx < 4) {
      idx++;
      data /= 1000;
    }
    return Number(data.toFixed(2)).toLocaleString() + '' +  units[idx];
  };

  Vue.prototype.$numHuman = (param) => {
    //console.log('byte calc', param);
    let data = param;
    if (data === undefined) {
      data = 0;
    }
    let units = ['', 'K', 'M', 'G', 'T'];

    var idx = 0;
    while (data >= 1000 && idx < 4) {
      idx++;
      data /= 1000;
    }
    return Number(data.toFixed(2)).toLocaleString() + '' +  units[idx];
  };

  Vue.prototype.$resolveSearch = (search) => {
    console.log('resolve search: ', search);
    var prefix;
    var key;
    prefix = search.split(':')[0];
    key = search.split(':')[1];
    switch (prefix) {
      case 'block':
        return {name: 'InspectBlock', params: { height: key } };
      case 'account':
        return {name: 'InspectAccount', params: { address: key } };
      case 'tx':
        return {name: 'InspectTx', params: { hash: key } };
      case 'validator':
        return {name: 'InspectValidator', params: { address: key } };
      default:
        return {name: 'Inspect' };
    }
  };
};

export default globalMethods;
