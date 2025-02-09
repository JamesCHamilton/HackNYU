// routes/api.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/search', async (req, res) => {
  const { food, lat, lng } = req.query;
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          key: API_KEY,
          location: `${lat},${lng}`,
          radius: 1500, // Search within 1.5km
          keyword: food,
          rankby: 'distance',
        },
      }
    );

    const results = response.data.results.map((place) => ({
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      open_now: place.opening_hours?.open_now,
    }));

    res.status(200).json({ results });
  } catch (error) {
    console.error('Google API error:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

export { router };
 