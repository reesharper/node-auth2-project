const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken')
const router = require("express").Router();
const { jwtSecret } = require('../../config/secrets.js')
const Users = require("../users/users_model");
// const { isValid } = require("../users/users-service.js");

router.post("/register", (req, res) => {
  const credentials = req.body;
  if (Users.isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 11;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
    Users.add(credentials)
      .then(user => {
        res.status(201).json({ data: user });
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({message: "username and password needed"});
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (Users.isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = generateToken(user)
          res.status(200).json({ message: "Welcome Back!", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({message: "username and password needed"});
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  }
  const options = {
    expiresIn: 5000,
  }
  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;