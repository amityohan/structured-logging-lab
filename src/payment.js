const processPayment = (requestLogger) => {
  requestLogger.info('payment.started');
  // Simulate some payment processing
  setTimeout(() => {
    requestLogger.info('payment.completed');
  }, 500);
};

module.exports = { processPayment };
