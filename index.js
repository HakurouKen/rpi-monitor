const fs = require('fs');
const childProcess = require('child_process');

function read(filepath) {
  try {
    return fs.readFileSync(filepath, { encoding: 'utf-8' });
  } catch (e) {
    // treat error as an empty file.
    return '';
  }
}

function exec(command) {
  try {
    return childProcess.execSync(command).toString();
  } catch (e) {
    // treat execute error as empty.
    return '';
  }
}

class Proc {
  constructor() {
    this._cache = {};
    this.temperature = {
      get cpu() {
        return read('/sys/class/thermal/thermal_zone0/temp') / 1000;
      },
      get gpu() {
        const temp = exec('/opt/vc/bin/vcgencmd measure_temp');
        return parseFloat(temp.replace('temp=', ''));
      }
    };
  }

  toString() {
    return JSON.stringify(this.info, null, 2);
  }

  get core() {
    if (this._cache.core) {
      return this._cache.core;
    }
    const cpuInfo = read('/proc/cpuinfo');
    return (this._cache.core = {
      count: (cpuInfo.match(/^model name\s*:/gim) || []).length,
      serial: (cpuInfo.match(/^serial\s*:\s*(.*)$/im) || [])[1] || '',
      revision: (cpuInfo.match(/^revision\s*:\s*(.*)/im) || [])[1] || ''
    });
  }

  get uptime() {
    var uptime = read('/proc/uptime');
    var arr = uptime.split(' ');
    return {
      total: +arr[0],
      idle: +arr[1]
    };
  }

  get stat() {
    const stat = read('/proc/stat');
    const arr = (stat.split('\n')[0] || '').split(/\s+/).map(num => +num);
    return {
      user: arr[1],
      nice: arr[2],
      system: arr[3],
      idle: arr[4],
      iowait: arr[5],
      irq: arr[6],
      softirq: arr[7],
      steal: arr[8],
      guest: arr[9],
      guestNice: arr[10]
    };
  }

  get memory() {
    const memInfo = read('/proc/meminfo');
    const INFO_MATCH_REGEXP = /^(.*?)\s*:\s*(\d+)/;
    return memInfo.split('\n').reduce((info, line) => {
      var matched = line.match(INFO_MATCH_REGEXP);
      if (matched) {
        info[matched[1]] = +matched[2] || 0;
      }
      return info;
    }, {});
  }

  get loadAvg() {
    const loadAvg = read('/proc/loadavg');
    const arr = loadAvg.split(' ');
    return {
      1: +arr[0] || 0,
      5: +arr[1] || 0,
      15: +arr[2] || 0
    };
  }

  get net() {
    const net = read('/proc/net/dev');
    const eths = net.split('\n').slice(2);
    const NET_INFO_MATCH_STR = /^\s*(.*?):\s*(\d+)(?:\s*\d+){7}\s*(\d+)/;
    return eths.reduce((info, str) => {
      const matched = str.match(NET_INFO_MATCH_STR);
      if (matched) {
        info[matched[1]] = {
          received: +matched[2] || 0,
          transmit: +matched[3] || 0
        };
      }
      return info;
    }, {});
  }

  get disk() {
    const df = exec('df');
    const info = df
      .trim()
      .split('\n')
      .slice(1)
      .map(str => str.trim().split(/\s+/g))
      .filter(arr => {
        return arr[arr.length - 1] === '/';
      })[0];
    if (!info) return null;
    return {
      total: +info[1],
      used: +info[2],
      free: +info[3]
    };
  }

  get info() {
    const temperature = this.temperature;
    return {
      core: this.core,
      uptime: this.uptime,
      temperature: {
        cpu: temperature.cpu,
        gpu: temperature.gpu
      },
      stat: this.stat,
      memory: this.memory,
      loadAvg: this.loadAvg,
      net: this.net,
      disk: this.disk
    };
  }
}

module.exports = new Proc();
