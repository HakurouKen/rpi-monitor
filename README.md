# rpi-proc-info

Get process information of your Raspberry Pi.

## Installation
```
npm install rpi-proc-info
```

## Usage
```javascript
var proc = require('rpi-proc-info');

// core system archiecture dependent items
proc.core

// the total number of seconds the system has been up
proc.uptime

// the temperature of cpu
proc.temperature.cpu

// the temperature of gpu
proc.temperature.gpu

// statistics about memory usage on the system
proc.memory

// load average figures giving the number of jobs in the run queue or waiting for disk I/O averaged over 1, 5, and 15 minutes
proc.loadAvg

// network device status information
proc.net

// file system disk space usage
proc.disk

// aggregated information of single ones(all above)
proc.info
```

## License
[MIT](https://github.com/HakurouKen/rpi-proc-info/blob/master/LICENSE)
