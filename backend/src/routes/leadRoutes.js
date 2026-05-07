const express = require('express');
const {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
    .get(getLeads)
    .post(
        [
            body('name').notEmpty().withMessage('Name is required'),
            body('email').isEmail().withMessage('Please enter a valid email'),
            body('phone').isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
            body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost', 'Closed']),
        ],
        createLead
    );

router.route('/:id')
    .get(getLead)
    .put(
        [
            body('name').optional().notEmpty(),
            body('email').optional().isEmail(),
            body('phone').optional().isLength({ min: 10, max: 10 }),
            body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost', 'Closed']),
        ],
        updateLead
    )
    .delete(deleteLead);

module.exports = router;