const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'pos.db');
const db = new Database(dbPath);

// Create tables if not exists

// db.prepare(`DROP TABLE IF EXISTS customers`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT
  )
`).run();

db.prepare(`DROP TABLE IF EXISTS items`).run();


db.prepare(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    image TEXT
  )
`).run();

// In database.js
// db.prepare(`DROP TABLE IF EXISTS transactions`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    total REAL,
    date TEXT
  )
`).run();


// db.prepare(`
//   CREATE TABLE IF NOT EXISTS transactions (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     customer_id INTEGER,
//     total REAL,
//     date TEXT
//   )
// `).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS transaction_line (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER,
    item_id INTEGER,
    qty INTEGER,
    total_price REAL
  )
`).run();

// Insert dummy data if empty
const customersCount = db.prepare(`SELECT COUNT(*) AS count FROM customers`).get().count;
if(customersCount === 0){
  const insertCustomer = db.prepare(`INSERT INTO customers (name, phone) VALUES (?, ?)`);
  const pakistaniCustomers = [
    ["Ali Khan", "03001234567"],
    ["Sara Ahmed", "03211234567"],
    ["Hassan Raza", "03331234567"],
    ["Fatima Qureshi", "03451234567"],
    ["Bilal Shah", "03061234567"]
  ];
  pakistaniCustomers.forEach(c => insertCustomer.run(c[0], c[1]));
}

const itemsCount = db.prepare(`SELECT COUNT(*) AS count FROM items`).get().count;
if(itemsCount === 0){
  const insertItem = db.prepare(`INSERT INTO items (name, price, image) VALUES (?, ?, ?)`);
  const items = [
    ["Pasta", 300, "/items/food1.jpg"],
    ["Burger", 500, "/items/food2.jpg"],
    ["Pizza", 800, "/items/food3.jpg"],
    ["Soda", 200, "/items/food4.jpg"],
    ["Cola Next", 100, "/items/food5.jpg"]
  ];
  items.forEach(i => insertItem.run(i[0], i[1], i[2]));
}

// Functions to fetch data
function getCustomers() {
  return db.prepare(`SELECT * FROM customers`).all();
}

function getItems() {
  return db.prepare(`SELECT * FROM items`).all();
}

// Save transaction & transaction lines
function saveTransaction(customerId, cart) {
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const date = new Date().toISOString();

  const insertTransaction = db.prepare(`INSERT INTO transactions (customer_id, total, date) VALUES (?, ?, ?)`);
  const result = insertTransaction.run(customerId, total, date);
  const transactionId = result.lastInsertRowid;

  const insertLine = db.prepare(`INSERT INTO transaction_line (transaction_id, item_id, qty, total_price) VALUES (?, ?, ?, ?)`);
  const insertMany = db.transaction((cartItems) => {
    for (const item of cartItems) {
      insertLine.run(transactionId, item.id, item.qty, item.price * item.qty);
    }
  });

  insertMany(cart);

  return { transactionId, total, date };
}

module.exports = { getCustomers, getItems, saveTransaction };
