const router = require("express").Router();
const Users = require("./users_model");
const restricted = require("../auth/auth-middleware.js");

router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;