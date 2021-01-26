const db = require("../../data/connection.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  isValid
};

function find() {
  return db("users").select("id", "username", "department").orderBy("id");
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id");
}

async function add(user) {
  const [id] = await db("users").insert(user, "id");
  return findById(id);
}

function findById(id) {
  return db("users").where({ id }).first();
}

function isValid(user) {
  return Boolean(user.username && user.password && typeof user.password === "string");
}