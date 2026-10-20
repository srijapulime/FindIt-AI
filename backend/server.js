
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('FindIt AI backend is running!');
});

app.get('/api/items', (req, res) => {
  const items = db.prepare('SELECT * FROM items ORDER BY createdAt DESC').all();
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const item = req.body;

  const requiredFields = [
    'id', 'type', 'name', 'category', 'location',
    'date', 'description', 'createdAt'
  ];

  const missingField = requiredFields.some(
    (field) => item[field] === undefined || item[field] === ''
  );

  if (missingField) {
    return res.status(400).json({ error: 'Required item details are missing.' });
  }

  if (!['lost', 'found'].includes(item.type)) {
    return res.status(400).json({ error: 'Item type must be lost or found.' });
  }

  try {
    db.prepare(`
      INSERT INTO items (
        id, type, name, category, location, date,
        description, photoName, photoData, createdAt
      ) VALUES (
        @id, @type, @name, @category, @location, @date,
        @description, @photoName, @photoData, @createdAt
      )
    `).run({
      ...item,
      photoName: item.photoName || '',
      photoData: item.photoData || ''
    });

    res.status(201).json({ message: 'Item saved successfully!' });
  } catch (error) {
  console.error('Database save error:', error);
  res.status(500).json({
    error: error.message || 'Unable to save item.'
  });
}
});

app.listen(PORT, () => {
  console.log(`FindIt AI backend running at http://localhost:${PORT}`);
});
