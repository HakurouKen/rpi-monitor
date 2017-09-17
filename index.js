var fs = require('fs');
var childProcess = require('child_process');

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

var proc = (module.exports = {});

proc.getCoreInfo = function() {
  var cpuInfo = read('/proc/cpuinfo');
  return {
    count: (cpuInfo.match(/^model name\s*:/gim) || []).length,
    serial: (cpuInfo.match(/^serial\s*:\s*(.*)$/im) || [])[1] || '',
    revision: (cpuInfo.match(/^revision\s*:\s*(.*)/im) || [])[1] || ''
  };
};

proc.getUptime = function() {
  var uptime = read('/proc/uptime');
  var arr = uptime.split(' ');
  return {
    total: +arr[0],
    idle: +arr[1]
  };
};

proc.getCpuTemperature = function() {
  return read('/sys/class/thermal/thermal_zone0/temp') / 1000;
};

proc.getGpuTemperature = function() {
  var temp = exec('/opt/vc/bin/vcgencmd measure_temp');
  return parseFloat(temp.replace('temp=', ''));
};

proc.getCpuState = function() {
  var stat = read('/proc/stat');
  var arr = (stat.split('\n')[0] || '').split(/\s+/).map(num => +num);
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
};

proc.getMemoryInfo = function() {
  var memInfo = read('/proc/meminfo');
  var INFO_MATCH_REGEXP = /^(.*?)\s*:\s*(\d+)/;
  return memInfo.split('\n').reduce((info, line) => {
    var matched = line.match(INFO_MATCH_REGEXP);
    if (matched) {
      info[matched[1]] = +matched[2] || 0;
    }
    return info;
  }, {});
};

proc.getLoadAvg = function() {
  var loadAvg = read('/proc/loadavg');
  var arr = loadAvg.split(' ');
  return {
    1: +arr[0] || 0,
    5: +arr[1] || 0,
    15: +arr[2] || 0
  };
};

proc.getNetInfo = function() {
  var net = read('/proc/net/dev');
  var eths = net.split('\n').slice(2);
  var NET_INFO_MATCH_STR = /^\s*(.*?):\s*(\d+)(?:\s*\d+){7}\s*(\d+)/;
  return eths.reduce((info, str) => {
    var matched = str.match(NET_INFO_MATCH_STR);
    if (matched) {
      info[matched[1]] = {
        received: +matched[2] || 0,
        transmit: +matched[3] || 0
      };
    }
    return info;
  }, {});
};

proc.getDiskInfo = function() {
  var df = exec('df');
  var info = df
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
};

proc.getInfo = function() {
  with (proc) {
    return {
      core: getCoreInfo(),
      uptime: getUptime(),
      temperature: {
        cpu: getCpuTemperature(),
        gpu: getGpuTemperature()
      },
      stat: getCpuState(),
      memory: getMemoryInfo(),
      loadAvg: getLoadAvg(),
      net: getNetInfo(),
      disk: getDiskInfo()
    };
  }
};
