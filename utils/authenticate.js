const query = require("./db");
const crypto = require("crypto");

// Function to create a new user
const createUser = async (username, password) => {
  // Generate the hashed password using the salt and provided password
  const { hashedPassword, salt } = await hashPassword(password);

  // Generate a unique UID for the user
  const uid = generateUserId();

  // Define the SQL query to insert the user into the table
  const sql =
    "INSERT INTO users (uid, username, password, salt) VALUES (?, ?, ?, ?)";

  // Execute the query with the provided values
  query(sql, [uid, username, hashedPassword, salt])
    .then((result) => {})
    .catch((err) => {
      console.log(err);
    });
};

// Function to update the password for the logged-in user
const updatePassword = async (oldPassword, newPassword, uid) => {
  // Define the SQL query to retrieve the salt and hashed password for the logged-in user
  const selectQuery = "SELECT salt, password FROM users WHERE uid = ?";

  // Execute the select query with the provided UID
  const selectResults = await query(selectQuery, [uid]);

  const user = selectResults[0];
  const salt = user.salt;
  const dbHashedPassword = user.password;

  // Validate the old password
  const { hashedPassword: oldPasswordHash } = await hashPassword(
    oldPassword,
    salt
  );
  if (dbHashedPassword != oldPasswordHash) {
    // If password is incorrect return 0.
    return 0;
  }

  // Generate the hashed password using the new salt and provided new password
  const { hashedPassword: newHashedPassword, salt: newSalt } =
    await hashPassword(newPassword);

  // Define the SQL query to update the password in the table
  const updateQuery = "UPDATE users SET password = ?, salt = ? WHERE uid = ?";

  // Exeute query
  query(updateQuery, [newHashedPassword, newSalt, uid])
    .then()
    .catch((err) => {
      console.log(err);
    });
};

// Function to hash a password
const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    // Generate a random salt if not provided
    if (!salt) {
      salt = crypto.randomBytes(16).toString("hex");
    }

    // Hash the password with SHA-256
    crypto.pbkdf2(password, salt, 10000, 64, "sha256", (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        // Convert the derived key to hexadecimal string
        const hashedPassword = derivedKey.toString("hex");
        // Resolve with the hashed password and salt
        resolve({ hashedPassword, salt });
      }
    });
  });
};

// Function to generate a hexadecimal user ID
const generateUserId = () => {
  return crypto.randomBytes(8).toString("hex");
};

// Helper function to generate a random salt
const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

module.exports = { createUser, updatePassword, hashPassword };
