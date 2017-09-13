import { expect } from 'chai';
import * as singleMonitors from '..';

describe('singleMonitors', function() {
  describe('#getCoreInfo()', function() {
    it('should return core system architecture dependent items', function() {
      const info = singleMonitors.getCoreInfo();
      expect(info).to.be.an('object');

      expect(info.count).to.be.a('number');
      expect(info.count).to.not.equal(0);

      expect(info.serial).to.be.a('string');
      expect(info.serial).to.not.equal('');

      expect(info.revision).to.be.a('string');
      expect(info.revision).to.not.equal('');
    });
  });

  describe('#getUptime()', function() {
    it('should return the total number of seconds the system has been up', function() {
      const info = singleMonitors.getUptime();
      expect(info).to.be.an('object');

      expect(info.total).to.be.a('number');
      expect(info.total).to.not.equal(0);

      expect(info.idle).to.be.a('number');
      expect(info.idle).to.not.equal(0);
    });
  });

  describe('#getCpuTemperature()', function() {
    it('should return the temperature of cpu', function() {
      const temp = singleMonitors.getCpuTemperature();
      expect(temp).to.be.a('number');
      expect(temp).to.not.equal(0);
    });
  });

  describe('#getGpuTemperature()', function() {
    it('should return the temperature of gpu', function() {
      const temp = singleMonitors.getGpuTemperature();
      expect(temp).to.be.a('number');
      expect(temp).to.not.equal(0);
    });
  });

  describe('#getCpuState()', function() {
    it('should return the cpu processing state', function() {
      const stat = singleMonitors.getCpuState();
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
    });
  });

  describe('#getMemInfo()', function() {
    it('should return statistics about memory usage on the system', function() {
      const info = singleMonitors.getMemInfo();
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
    });
  });

  describe('#getLoadAvg()', function() {
    it('should return load average figures giving the number of jobs in the run queue or waiting for disk I/O averaged over 1, 5, and 15 minutes', function() {
      const info = singleMonitors.getLoadAvg();
      expect(info).to.be.an('object');
      [1, 5, 15].forEach(t => {
        expect(info[t]).to.be.a('number');
      });
    });
  });

  describe('#getNetInfo()', function() {
    it('should return network device status information', function() {
      const infos = singleMonitors.getNetInfo();
      expect(infos).to.be.an('object');
      Object.keys(infos).forEach(key => {
        const info = infos[key];
        expect(info).to.be.an('object');
        expect(info.received).to.be.a('number');
        expect(info.transmit).to.be.a('number');
      });
    });
  });

  describe('#getDiskInfo()', function() {
    it('should return file system disk space usage', function() {
      const info = singleMonitors.getDiskInfo();
      expect(info).to.be.an('object');
      ['total', 'used', 'free'].forEach(key => {
        expect(info[key]).to.be.a('number');
      });
    });
  });
});
