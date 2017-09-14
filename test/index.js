import { expect } from 'chai';
import * as singleMonitors from '..';
import monitor from '..';

const singleMonitorTestCases = {
  getCoreInfo(info) {
    expect(info).to.be.an('object');

    expect(info.count).to.be.a('number');
    expect(info.count).to.not.equal(0);

    expect(info.serial).to.be.a('string');
    expect(info.serial).to.not.equal('');

    expect(info.revision).to.be.a('string');
    expect(info.revision).to.not.equal('');
  },

  getUptime(info) {
    expect(info).to.be.an('object');

    expect(info.total).to.be.a('number');
    expect(info.total).to.not.equal(0);

    expect(info.idle).to.be.a('number');
    expect(info.idle).to.not.equal(0);
  },

  getCpuTemperature(temp) {
    expect(temp).to.be.a('number');
    expect(temp).to.not.equal(0);
  },

  getGpuTemperature(temp) {
    expect(temp).to.be.a('number');
    expect(temp).to.not.equal(0);
  },

  getCpuState(stat) {
    expect(stat).to.be.an('object');

    [
      'user',
      'nice',
      'system',
      'idle',
      'iowait',
      'irq',
      'softirq',
      'steal',
      'guest',
      'guestNice'
    ].forEach(key => {
      expect(stat[key]).to.be.a('number');
    });
  },

  getMemInfo(info) {
    expect(info).to.be.an('object');
    [
      'MemTotal',
      'MemFree',
      'MemAvailable',
      'Buffers',
      'Cached',
      'SwapCached',
      'SwapTotal',
      'SwapFree'
    ].forEach(key => {
      expect(info[key]).to.be.a('number');
      expect(info[key]).to.not.equal(0);
    });
  },

  getLoadAvg(info) {
    expect(info).to.be.an('object');
    [1, 5, 15].forEach(t => {
      expect(info[t]).to.be.a('number');
    });
  },

  getNetInfo(infos) {
    expect(infos).to.be.an('object');
    Object.keys(infos).forEach(key => {
      const info = infos[key];
      expect(info).to.be.an('object');
      expect(info.received).to.be.a('number');
      expect(info.transmit).to.be.a('number');
    });
  },

  getDiskInfo(info) {
    expect(info).to.be.an('object');
    ['total', 'used', 'free'].forEach(key => {
      expect(info[key]).to.be.a('number');
    });
  }
};

describe('singleMonitors', function() {
  function testSingleMonitor(func, desc) {
    describe(`#${func}()`, function() {
      it(desc, function() {
        singleMonitorTestCases[func](singleMonitors[func]());
      });
    });
  }

  testSingleMonitor(
    'getCoreInfo',
    'should return core system archiecture dependent items'
  );

  testSingleMonitor(
    'getUptime',
    'should return the total number of seconds the system has been up'
  );

  testSingleMonitor(
    'getCpuTemperature',
    'should return the temperature of cpu'
  );

  testSingleMonitor(
    'getGpuTemperature',
    'should return the temperature of gpu'
  );

  testSingleMonitor('getCpuState', 'should return the cpu processing state');

  testSingleMonitor(
    'getMemInfo',
    'should return statistics about memory usage on the system'
  );

  testSingleMonitor(
    'getLoadAvg',
    'should return load average figures giving the number of jobs in the run queue or waiting for disk I/O averaged over 1, 5, and 15 minutes'
  );

  testSingleMonitor(
    'getNetInfo',
    'should return network device status information'
  );

  testSingleMonitor(
    'getDiskInfo',
    'should return file system disk space usage'
  );
});

describe('monitor', function() {
  it('should return aggregated information of single monitors', function() {
    const info = monitor();
    expect(info).to.be.an('object');
    singleMonitorTestCases.getCoreInfo(info.core);
    singleMonitorTestCases.getUptime(info.uptime);
    singleMonitorTestCases.getCpuTemperature(info.temperature.cpu);
    singleMonitorTestCases.getGpuTemperature(info.temperature.gpu);
    singleMonitorTestCases.getCpuState(info.stat);
    singleMonitorTestCases.getMemInfo(info.memory);
    singleMonitorTestCases.getLoadAvg(info.loadAvg);
    singleMonitorTestCases.getNetInfo(info.net);
    singleMonitorTestCases.getDiskInfo(info.disk);
  });
});
