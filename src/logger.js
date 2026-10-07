const SERVICE = 'orders-api';

const createLogger = (bindings = {}) => {
  const write = (level, fields, msg) => {
    const context = typeof fields === 'string' ? {} : fields;
    const message = typeof fields === 'string' ? fields : msg;

    console.log(JSON.stringify({
      ...bindings,
      ...context,
      ts: new Date().toISOString(),
      level,
      service: SERVICE,
      msg: message,
    }));
  };

  return {
    debug: (fields, msg) => write('debug', fields, msg),
    info: (fields, msg) => write('info', fields, msg),
    warn: (fields, msg) => write('warn', fields, msg),
    error: (fields, msg) => write('error', fields, msg),
    child: (childBindings) => createLogger({ ...bindings, ...childBindings }),
  };
};

const logger = createLogger();

module.exports = { logger };
