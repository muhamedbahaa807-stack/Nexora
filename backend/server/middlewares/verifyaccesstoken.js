import jwt from 'jsonwebtoken';
export const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
  if (!authHeader.startsWith('Bearer ')) {
    const error = new Error('Invalid token');
    error.status = 401;
    throw error;
  }
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    const error = new Error('Invalid or expired token');
    error.status = 401;
    throw error;
  }
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }

  req.user = user;
  next();
};
