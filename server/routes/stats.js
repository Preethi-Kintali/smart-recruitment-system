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
            hired: 0
        };

        stats.forEach(s => {
            const status = (s._id || '').toLowerCase();
            formattedStats.total += s.count;
            
            if (['shortlisted', 'screening'].includes(status)) {
                formattedStats.shortlisted += s.count;
            } else if (status === 'rejected') {
                formattedStats.rejected += s.count;
            } else if (['interview', 'offlineinterview'].includes(status)) {
                formattedStats.pending += s.count;
            } else if (status === 'applied') {
                // Count Applied as Pending if that's what user expects
                formattedStats.shortlisted += s.count; 
            } else if (status === 'hired' || status === 'selected') {
                formattedStats.hired += s.count;
            }
        });

        res.json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
