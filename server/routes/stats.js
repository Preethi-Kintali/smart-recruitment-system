const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

router.get('/', async (req, res) => {
    try {
        const stats = await Application.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = {
            total: 0,
            shortlisted: 0,
            rejected: 0,
            pending: 0,
            selected: 0
        };

        stats.forEach(s => {
            formattedStats.total += s.count;
            if (s._id === 'Screening' || s._id === 'Interview') formattedStats.shortlisted += s.count;
            if (s._id === 'Rejected') formattedStats.rejected += s.count;
            if (s._id === 'Applied') formattedStats.pending += s.count;
            if (s._id === 'Selected') formattedStats.selected += s.count;
        });

        res.json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
