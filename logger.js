const bunyan = require('bunyan');

const logger = bunyan.createLogger({ name: 'myapp', streams: [{ path: 'app.log' }] });

module.exports = logger;
