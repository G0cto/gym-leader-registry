const express = require('express');
const mongoose = require('mongoose');
const GymLeader = require('../models/GymLeader');

const router = express.Router();

// Reject bad ids early so Mongoose doesn't throw a CastError
function validateId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid leader id' });
    }
    next();
}

// GET /api/leaders - list all (optional ?region=Kanto&specialty=Water)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.region) filter.region = req.query.region;
        if (req.query.specialty) filter.specialty = req.query.specialty;

        const leaders = await GymLeader.find(filter).sort({ name: 1 });
        res.json(leaders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/leaders/:id - get one
router.get('/:id', validateId, async (req, res) => {
    try {
        const leader = await GymLeader.findById(req.params.id);
        if (!leader) return res.status(404).json({ error: 'Leader not found' });
        res.json(leader);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/leaders - create
router.post('/', async (req, res) => {
    try {
        const leader = await GymLeader.create(req.body);
        res.status(201).json(leader);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/leaders/:id - update
router.put('/:id', validateId, async (req, res) => {
    try {
        const leader = await GymLeader.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!leader) return res.status(404).json({ error: 'Leader not found' });
        res.json(leader);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/leaders/:id - delete
router.delete('/:id', validateId, async (req, res) => {
    try {
        const leader = await GymLeader.findByIdAndDelete(req.params.id);
        if (!leader) return res.status(404).json({ error: 'Leader not found' });
        res.json({ message: 'Leader deleted', leader });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;