const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '../../database/insight_hunter.db');
    this.db = null;
    this.init();
  }

  init() {
    // Ensure database directory exists
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Connect to database
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    this.db.exec(schema, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Database tables initialized');
        this.seedData();
      }
    });
  }

  seedData() {
    // Check if we already have data
    this.db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (err) {
        console.error('Error checking user count:', err);
        return;
      }
      
      if (row.count === 0) {
        console.log('Seeding initial data...');
        this.insertSeedData();
      }
    });
  }

  insertSeedData() {
    const bcrypt = require('bcryptjs');
    const password = bcrypt.hashSync('demo123', 10);
    
    // Insert demo user
    this.db.run(`
      INSERT INTO users (email, password_hash, first_name, last_name, company_name, onboarding_completed)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['demo@insighthunter.com', password, 'Demo', 'User', 'Demo Company', true], function(err) {
      if (err) {
        console.error('Error inserting demo user:', err);
        return;
      }
      
      const userId = this.lastID;
      console.log('Created demo user with ID:', userId);
      
      // Insert demo account
      const db = this.db || require('../services/database').getInstance().db;
      db.run(`
        INSERT INTO accounts (user_id, name, type, subtype, balance, institution_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, 'Demo Checking', 'depository', 'checking', 5000.00, 'Demo Bank'], function(err) {
        if (err) {
          console.error('Error inserting demo account:', err);
          return;
        }
        
        const accountId = this.lastID;
        console.log('Created demo account with ID:', accountId);
        
        // Insert demo transactions
        const transactions = [
          [userId, accountId, 3500.00, 'income', 'Salary Payment', 'Salary', 'Payroll', '2024-09-01'],
          [userId, accountId, 1200.00, 'expense', 'Rent Payment', 'Housing', 'Rent', '2024-09-02'],
          [userId, accountId, 89.50, 'expense', 'Grocery Store', 'Food & Dining', 'Groceries', '2024-09-03'],
          [userId, accountId, 45.00, 'expense', 'Gas Station', 'Transportation', 'Gas', '2024-09-03'],
          [userId, accountId, 120.00, 'expense', 'Electric Bill', 'Bills & Utilities', 'Electricity', '2024-09-04'],
          [userId, accountId, 2500.00, 'income', 'Client Payment', 'Business Income', 'Consulting', '2024-09-05'],
          [userId, accountId, 67.89, 'expense', 'Restaurant', 'Food & Dining', 'Restaurants', '2024-09-06'],
          [userId, accountId, 200.00, 'expense', 'Office Supplies', 'Business Expenses', 'Supplies', '2024-09-07'],
          [userId, accountId, 1500.00, 'income', 'Freelance Project', 'Business Income', 'Freelancing', '2024-09-08'],
          [userId, accountId, 85.00, 'expense', 'Internet Bill', 'Bills & Utilities', 'Internet', '2024-09-09']
        ];
        
        const stmt = db.prepare(`
          INSERT INTO transactions (user_id, account_id, amount, type, description, category, subcategory, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        transactions.forEach(transaction => {
          stmt.run(transaction, (err) => {
            if (err) console.error('Error inserting transaction:', err);
          });
        });
        
        stmt.finalize();
        console.log('Inserted demo transactions');
      });
    });
  }

  // Helper methods for database operations
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Singleton pattern
let instance = null;

module.exports = {
  getInstance: () => {
    if (!instance) {
      instance = new DatabaseService();
    }
    return instance;
  }
};
EOF# Create database service
cat > backend/src/services/database.js << 'EOF'
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '../../database/insight_hunter.db');
    this.db = null;
    this.init();
  }

  init() {
    // Ensure database directory exists
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Connect to database
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    this.db.exec(schema, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Database tables initialized');
        this.seedData();
      }
    });
  }

  seedData() {
    // Check if we already have data
    this.db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (err) {
        console.error('Error checking user count:', err);
        return;
      }
      
      if (row.count === 0) {
        console.log('Seeding initial data...');
        this.insertSeedData();
      }
    });
  }

  insertSeedData() {
    const bcrypt = require('bcryptjs');
    const password = bcrypt.hashSync('demo123', 10);
    
    // Insert demo user
    this.db.run(`
      INSERT INTO users (email, password_hash, first_name, last_name, company_name, onboarding_completed)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['demo@insighthunter.com', password, 'Demo', 'User', 'Demo Company', true], function(err) {
      if (err) {
        console.error('Error inserting demo user:', err);
        return;
      }
      
      const userId = this.lastID;
      console.log('Created demo user with ID:', userId);
      
      // Insert demo account
      const db = this.db || require('../services/database').getInstance().db;
      db.run(`
        INSERT INTO accounts (user_id, name, type, subtype, balance, institution_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, 'Demo Checking', 'depository', 'checking', 5000.00, 'Demo Bank'], function(err) {
        if (err) {
          console.error('Error inserting demo account:', err);
          return;
        }
        
        const accountId = this.lastID;
        console.log('Created demo account with ID:', accountId);
        
        // Insert demo transactions
        const transactions = [
          [userId, accountId, 3500.00, 'income', 'Salary Payment', 'Salary', 'Payroll', '2024-09-01'],
          [userId, accountId, 1200.00, 'expense', 'Rent Payment', 'Housing', 'Rent', '2024-09-02'],
          [userId, accountId, 89.50, 'expense', 'Grocery Store', 'Food & Dining', 'Groceries', '2024-09-03'],
          [userId, accountId, 45.00, 'expense', 'Gas Station', 'Transportation', 'Gas', '2024-09-03'],
          [userId, accountId, 120.00, 'expense', 'Electric Bill', 'Bills & Utilities', 'Electricity', '2024-09-04'],
          [userId, accountId, 2500.00, 'income', 'Client Payment', 'Business Income', 'Consulting', '2024-09-05'],
          [userId, accountId, 67.89, 'expense', 'Restaurant', 'Food & Dining', 'Restaurants', '2024-09-06'],
          [userId, accountId, 200.00, 'expense', 'Office Supplies', 'Business Expenses', 'Supplies', '2024-09-07'],
          [userId, accountId, 1500.00, 'income', 'Freelance Project', 'Business Income', 'Freelancing', '2024-09-08'],
          [userId, accountId, 85.00, 'expense', 'Internet Bill', 'Bills & Utilities', 'Internet', '2024-09-09']
        ];
        
        const stmt = db.prepare(`
          INSERT INTO transactions (user_id, account_id, amount, type, description, category, subcategory, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        transactions.forEach(transaction => {
          stmt.run(transaction, (err) => {
            if (err) console.error('Error inserting transaction:', err);
          });
        });
        
        stmt.finalize();
        console.log('Inserted demo transactions');
      });
    });
  }

  // Helper methods for database operations
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Singleton pattern
let instance = null;

module.exports = {
  getInstance: () => {
    if (!instance) {
      instance = new DatabaseService();
    }
    return instance;
  }
};
