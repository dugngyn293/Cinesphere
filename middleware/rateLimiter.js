const requestCounts = {}; // In-memory store for request counts

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  if (!requestCounts[ip]) {
    // First request from this IP
    requestCounts[ip] = {
      count: 1,
      startTime: now,
    };
    return next();
  }

  const ipData = requestCounts[ip];
  const elapsedTime = now - ipData.startTime;

  if (elapsedTime > windowMs) {
    // Window has reset
    ipData.count = 1;
    ipData.startTime = now;
    return next();
  }

  if (ipData.count >= maxRequests) {
    // Exceeded max requests
    return res.status(429).json({
      message: 'Too many requests from this IP, please try again after 15 minutes',
    });
  }

  // Increment request count
  ipData.count++;
  next();
};

module.exports = { rateLimiter };