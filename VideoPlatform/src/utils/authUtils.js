const jwt = require("jsonwebtoken");
const config = require("../config");
const argon2 = require("argon2");
const User = require("../models/Users");
// Generate JWT token
function generateToken(user) {
  const payload = {
    useruuid: user.useruuid,
    authdate: new Date(),
  };

  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1000h" });
  return token;
}

// Verify JWT token and extract payload
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (err) {
    return null;
  }
}

// Middleware to authenticate user and attach user UUID to the request
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
  User.findOne({ useruuid: decoded.useruuid })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Attach user UUID and username to the request object
      req.userUUID = decoded.useruuid;
      req.username = user.username;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
};

function generateResetToken(userId) {
  const payload = { id: userId };
  const token = jwt.sign(payload, config.jwtResetSecret, { expiresIn: "1000h" }); // Set appropriate expiration
  return token;
}

// Verify the reset token and extract the user ID
function verifyResetToken(token) {
  try {
    return jwt.verify(token, config.jwtResetSecret);
  } catch (err) {
    return null;
  }
}

async function verifyPassword(providedPassword, storedHash) {
  try {
    if (!providedPassword || !storedHash) {
      console.error("Provided password or stored hash is empty");
      return false;
    }
    // Concatenate the provided password with the pepper
    const passwordWithPepper = providedPassword + config.serverPepper;

    // Verify the password against the stored hash
    const match = await argon2.verify(storedHash, passwordWithPepper);
    return match;
  } catch (err) {
    console.error("Error verifying password", err);
    return false;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  generateResetToken,
  verifyResetToken,
  verifyPassword,
};
