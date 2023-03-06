const validator = require("validator");

const cleanUpAndValidate = ({ name, email, password, username }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !name || !password)
      reject("Missing credentials!");
    if (typeof email !== "string") reject("Invalid email!");
    if (typeof username !== "string") reject("Invalid username!");
    if (typeof password !== "string") reject("Invalid password!");

    if (!validator.isEmail(email)) reject("Invalid email format!");

    if (username.length <= 2 || username.length > 50)
      reject("Username should be between 3 to 50 chars!");

    if (password.length <= 2 || password.length > 25)
      reject("Password should be between 3 to 25 chars!");

    resolve();
  });
};

module.exports = { cleanUpAndValidate };
