import express from 'express';
import axios from 'axios';
import { verifyToken } from '../jwtMiddleware.js';
import Client from '../schemas/Client.js';
import Session from '../schemas/Session.js';
import Trainer from '../schemas/Trainer.js';

const router = express.Router();

// Google Maps search (food-related)
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

// /api/clients - Get all clients (for the trainer)
router.get('/clients', verifyToken, async (req, res) => {
  try {
    // Only trainers should be able to access this route
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Fetch all clients associated with the trainer
    const clients = await Client.find({ trainerId: trainer._id });
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /api/clients/:clientId - Get a specific client's details
router.get('/clients/:clientId', verifyToken, async (req, res) => {
  const { clientId } = req.params;

  try {
    // Ensure the trainer has access to the client
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (client.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({ error: 'You can only access your own clients' });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error('Error fetching client details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /api/sessions - Create a session (trainer creates a session for a client)
router.post('/sessions', verifyToken, async (req, res) => {
  const { clientId, sessionDetails } = req.body;

  try {
    // Ensure the trainer is authenticated
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Ensure the client exists and belongs to the trainer
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (client.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({ error: 'You can only create sessions for your clients' });
    }

    // Create the session
    const session = new Session({
      trainerId: trainer._id,
      clientId: client._id,
      ...sessionDetails,
    });

    await session.save();

    res.status(201).json({ message: 'Session created successfully', session });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /api/sessions/:sessionId - Get details of a specific session
router.get('/sessions/:sessionId', verifyToken, async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Ensure the trainer is authenticated
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Find the session by ID
    const session = await Session.findById(sessionId)
      .populate('trainerId', 'name email') // Populating trainer details
      .populate('clientId', 'name email'); // Populating client details

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Ensure the trainer is authorized to view the session
    if (session.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({ error: 'You can only view your own sessions' });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /api/sessions/:sessionId - Update a session (trainer updates session details)
router.put('/sessions/:sessionId', verifyToken, async (req, res) => {
  const { sessionId } = req.params;
  const { sessionDetails } = req.body; // New session details

  try {
    // Ensure the trainer is authenticated
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Find the session by ID
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Ensure the trainer is authorized to update the session
    if (session.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own sessions' });
    }

    // Update session details
    Object.assign(session, sessionDetails);
    await session.save();

    res.status(200).json({ message: 'Session updated successfully', session });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /api/sessions/:sessionId - Delete a session (trainer deletes session)
router.delete('/sessions/:sessionId', verifyToken, async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Ensure the trainer is authenticated
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Find the session by ID
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Ensure the trainer is authorized to delete the session
    if (session.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own sessions' });
    }

    // Delete the session
    await session.remove();

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router };
