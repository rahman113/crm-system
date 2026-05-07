

const Lead = require('../models/Lead');
const { validationResult } = require('express-validator');

exports.getLeads = async (req, res, next) => {
    try {
        let query = { user: req.user.id };
        if (req.query.status) {
            query.status = req.query.status;
        }

        const leads = await Lead.find(query).sort('-createdAt');
        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads,
        });
    } catch (error) {
        next(error);
    }
};
exports.getLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found',
            });
        }
        if (lead.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        next(error);
    }
};

exports.createLead = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Add user to req.body
        req.body.user = req.user.id;

        const lead = await Lead.create(req.body);
        console.log("lead", lead)

        console.log("lead", lead)

        res.status(201).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateLead = async (req, res, next) => {
    try {
        let lead = await Lead.findById(req.params.id);


        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found',
            });
        }
        if (lead.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found',
            });
        }
        if (lead.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        await lead.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};