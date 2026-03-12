const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided.'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded.user; // Attach user payload to the socket
    next();
  } catch (err) {
    return next(new Error('Authentication error: Token is not valid.'));
  }
};

module.exports = socketAuth;