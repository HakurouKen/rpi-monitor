# rpi-proc-info

Get process information of your Raspberry Pi.

## Installation
```
npm install rpi-proc-info
```

## Usage
```javascript
var proc = require('rpi-proc-info');

// get core system archiecture dependent items
proc.getCoreInfo();

// get the total number of seconds the system has been up
proc.getUptime();

// get the temperature of cpu
proc.getCpuTemperature();

// get the temperature of gpu
proc.getGpuTemperature();

// get statistics about memory usage on the system
proc.getMemoryInfo();

// get load average figures giving the number of jobs in the run queue or waiting for disk I/O averaged over 1, 5, and 15 minutes
proc.getLoadAvg();

// get network device status information
proc.getNetInfo();

// get file system disk space usage
proc.getDiskInfo();

// get aggregated information of single ones(all above)
proc.getInfo();
```

## License
MIT
