const sqlite3 = require('sqlite3').verbose();

// Open (or create) the SQLite database
const db = new sqlite3.Database('health.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS diseases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      symptoms TEXT NOT NULL,
      warning_signs TEXT NOT NULL,
      management TEXT NOT NULL,
      diet TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      is_bot BOOLEAN NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Function to insert diseases if they don’t exist
const insertDisease = (name, symptoms, warning_signs, management, diet) => {
  const query = `
    INSERT INTO diseases (name, symptoms, warning_signs, management, diet)
    SELECT ?, ?, ?, ?, ?
    WHERE NOT EXISTS (SELECT 1 FROM diseases WHERE name = ?)
  `;
  db.run(query, [name, symptoms, warning_signs, management, diet, name]);
};

// Insert predefined diseases
const diseases = [
  ['Diabetes', 'Increased thirst, extreme hunger, fatigue, blurred vision, slow healing sores',
   'Blood sugar > 240 mg/dL, ketones in urine, rapid breathing, fruity breath odor, confusion',
   'Regular blood sugar monitoring, take medications as prescribed, regular exercise, foot care, regular check-ups',
   'Low glycemic index foods, high-fiber vegetables, lean proteins, whole grains, avoid sugary drinks and desserts'],
  
  ['Hypertension', 'Headaches, shortness of breath, nosebleeds, chest pain, vision problems',
   'BP > 180/120 mmHg, severe headache, chest pain, vision problems, difficulty speaking',
   'Regular BP monitoring, take medications as prescribed, stress management, regular exercise, maintain healthy weight',
   'Low sodium foods, DASH diet, potassium-rich foods, limit alcohol, reduce caffeine, leafy greens, berries, citrus fruits'],
  
  ['Asthma', 'Wheezing, shortness of breath, chest tightness, coughing, difficulty sleeping',
   'Severe shortness of breath, rapid breathing, cannot speak in full sentences, blue lips or fingers, peak flow < 50% of best',
   'Use inhalers correctly, avoid triggers, follow action plan, regular check-ups, keep rescue inhaler handy',
   'Anti-inflammatory foods, vitamin D rich foods, omega-3 fatty acids, avoid sulfites, include ginger and turmeric, fresh fruits and vegetables']
];

// Insert diseases into the database
diseases.forEach((d) => insertDisease(...d));

// Fetch disease information
const getDiseaseInfo = (name, callback) => {
  db.get('SELECT * FROM diseases WHERE name LIKE ?', [`%${name}%`], (err, row) => {
    if (err) {
      console.error('Error getting disease info:', err);
      callback(null);
    } else {
      callback(row);
    }
  });
};

// Fetch all diseases
const getAllDiseases = (callback) => {
  db.all('SELECT name FROM diseases', [], (err, rows) => {
    if (err) {
      console.error('Error getting all diseases:', err);
      callback([]);
    } else {
      callback(rows);
    }
  });
};

// Save chat message
const saveChatMessage = (message, isBot) => {
  db.run('INSERT INTO chat_history (message, is_bot) VALUES (?, ?)', [message, isBot], (err) => {
    if (err) {
      console.error('Error saving chat message:', err);
    }
  });
};

// Fetch chat history
const getChatHistory = (callback) => {
  db.all('SELECT * FROM chat_history ORDER BY created_at DESC LIMIT 50', [], (err, rows) => {
    if (err) {
      console.error('Error getting chat history:', err);
      callback([]);
    } else {
      callback(rows);
    }
  });
};

// Cleanup function when the app stops
const cleanup = () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
  });
};

// Handle cleanup on process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Export functions for use in your website
module.exports = {
  getDiseaseInfo,
  getAllDiseases,
  saveChatMessage,
  getChatHistory
};
