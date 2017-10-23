const chai = require('chai');
const expect = chai.expect;

const proc = require('.');

const procTestCases = {
  core(info) {
    expect(info).to.be.an('object');

    expect(info.count).to.be.a('number');
    expect(info.count).to.not.equal(0);

    expect(info.serial).to.be.a('string');
    expect(info.serial).to.not.equal('');

    expect(info.revision).to.be.a('string');
    expect(info.revision).to.not.equal('');
  },

  uptime(info) {
    expect(info).to.be.an('object');

    expect(info.total).to.be.a('number');
    expect(info.total).to.not.equal(0);

    expect(info.idle).to.be.a('number');
    expect(info.idle).to.not.equal(0);
  },

  'temperature.cpu'(temp) {
    expect(temp).to.be.a('number');
    expect(temp).to.not.equal(0);
  },

  'temperature.gpu'(temp) {
    expect(temp).to.be.a('number');
    expect(temp).to.not.equal(0);
  },

  stat(stat) {
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

  memory(info) {
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

  loadAvg(info) {
    expect(info).to.be.an('object');
    [1, 5, 15].forEach(t => {
      expect(info[t]).to.be.a('number');
    });
  },

  net(infos) {
    expect(infos).to.be.an('object');
    Object.keys(infos).forEach(key => {
      const info = infos[key];
      expect(info).to.be.an('object');
      expect(info.received).to.be.a('number');
      expect(info.transmit).to.be.a('number');
    });
  },

  disk(info) {
    expect(info).to.be.an('object');
    ['total', 'used', 'free'].forEach(key => {
      expect(info[key]).to.be.a('number');
    });
  }
};

describe('single process', function() {
  function testproc(getter, desc) {
    describe(`get#${getter}`, function() {
      it(desc, function() {
        procTestCases[getter](eval(`proc.${getter}`));
      });
    });
  }

  testproc('core', 'should return core system archiecture dependent items');

  testproc(
    'uptime',
    'should return the total number of seconds the system has been up'
  );

  testproc('temperature.cpu', 'should return the temperature of cpu');

  testproc('temperature.gpu', 'should return the temperature of gpu');

  testproc('stat', 'should return the cpu processing state');

  testproc(
    'memory',
    'should return statistics about memory usage on the system'
  );

  testproc(
    'loadAvg',
    'should return load average figures giving the number of jobs in the run queue or waiting for disk I/O averaged over 1, 5, and 15 minutes'
  );

  testproc('net', 'should return network device status information');

  testproc('disk', 'should return file system disk space usage');
});

describe('aggregated process', function() {
  describe('get#info()', function() {
    it('should return aggregated information of single ones', function() {
      const info = proc.info;
      expect(info).to.be.an('object');
      procTestCases.core(info.core);
      procTestCases.uptime(info.uptime);
      procTestCases['temperature.cpu'](info.temperature.cpu);
      procTestCases['temperature.gpu'](info.temperature.gpu);
      procTestCases.stat(info.stat);
      procTestCases.memory(info.memory);
      procTestCases.loadAvg(info.loadAvg);
      procTestCases.net(info.net);
      procTestCases.disk(info.disk);
    });
  });
});
