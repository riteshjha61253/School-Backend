const connection = require('../config/db');
const { distanceHaversine } = require('../utils/distanceHaversineFunction');

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }
  if (!address || typeof address !== 'string' || address.trim() === '') {
    return res.status(400).json({ error: 'Address is required and must be a non-empty string' });
  }
  if (typeof latitude !== 'number' || isNaN(latitude) || latitude < -90 || latitude > 90) {
    return res.status(400).json({ error: 'Latitude must be a number between -90 and 90' });
  }
  if (typeof longitude !== 'number' || isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Longitude must be a number between -180 and 180' });
  }


  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  connection.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Error inserting school:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
};
exports.listSchools = (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || userLat < -90 || userLat > 90) {
    return res.status(400).json({ error: 'Invalid latitude (must be between -90 and 90)' });
  }
  if (isNaN(userLon) || userLon < -180 || userLon > 180) {
    return res.status(400).json({ error: 'Invalid longitude (must be between -180 and 180)' });
  }


  connection.query('SELECT * FROM schools', (err, results) => {
    if (err) {
      console.error('Error fetching schools:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const schoolsWithDistance = results.map(school => ({
      ...school,
      distance: distanceHaversine(userLat, userLon, school.latitude, school.longitude)
    }));

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  });
};

