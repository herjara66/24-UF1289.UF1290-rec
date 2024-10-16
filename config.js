const mysql = require("mysql");
require("dotenv").config();

class Person {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

class Student extends Person {
  constructor(id, name, email, score) {
    super(id, name, email);
    this.score = score;
  }
}

class Professor extends Person {
  constructor(id, name, email) {
    super(id, name, email);
  }
}

class Administrator extends Person {
  constructor(id, name, email) {
    super(id, name, email);
  }
}

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
      }
      console.log("Connected to MySQL!");
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.connection.state === "disconnected") {
        return resolve();
      }
      this.connection.end((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  insertPerson(name, email, role, score) {
    const sql =
      "INSERT INTO persons (name, email, role, score) VALUES (?, ?, ?, ?)";
    return this.query(sql, [name, email, role, score]);
  }
}

const db = new Database();
db.connect();

db.insertPerson("Alice Smith", "alice.smith@example.com", "student", 85)
  .then(() =>
    db.insertPerson("Bob Johnson", "bob.johnson@example.com", "student", 92)
  )
  .then(() =>
    db.insertPerson("Charlie Brown", "charlie.brown@example.com", "student", 78)
  )
  .then(() =>
    db.insertPerson(
      "Dr. Emily Green",
      "emily.green@example.com",
      "professor",
      null
    )
  )
  .then(() =>
    db.insertPerson(
      "Dr. John Black",
      "john.black@example.com",
      "professor",
      null
    )
  )
  .then(() =>
    db.insertPerson("Admin Jane Doe", "jane.doe@example.com", "admin", null)
  )
  .then(() => {
    console.log("All persons inserted successfully.");
  })
  .catch((err) => {
    console.error("Error inserting persons:", err);
  })
  .finally(() => {
    db.close();
  });

module.exports = { db, Student, Professor, Administrator };
