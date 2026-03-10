const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const doctorController = require('../controllers/doctorController');
const Doctor = require('../models/Doctor');

// 1. CREATE
router.post('/create', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'qrLogo', maxCount: 1 }
]), doctorController.createDoctor);

// 2. READ ALL
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch doctors list" });
    }
});

// --- CRITICAL CHANGE: MOVE SLUG ABOVE ID ---

// 3. READ ONE (by Slug): For the Public Digital Card view
// We put this first so it doesn't get confused with the /:id route
router.get('/slug/:slug', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ slug: req.params.slug });
        if (!doctor) {
            return res.status(404).json({ message: "Public profile not found" });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ error: "Server error fetching slug" });
    }
});

// 4. READ ONE (by ID): To pre-fill the Edit Form
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ error: "Error fetching doctor details" });
    }
});

// 5. UPDATE
router.put('/:id', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'qrLogo', maxCount: 1 }
]), async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.body.branches) updateData.branches = JSON.parse(req.body.branches);
        if (req.body.socialMedia) updateData.socialMedia = JSON.parse(req.body.socialMedia);

        if (req.files['profileImage']) updateData.profileImage = req.files['profileImage'][0].filename;
        if (req.files['qrLogo']) updateData.qrLogo = req.files['qrLogo'][0].filename;

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );

        res.json({ message: "Update Successful", data: updatedDoctor });
    } catch (err) {
        res.status(500).json({ error: "Update failed", details: err.message });
    }
});

// 6. DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.json({ message: "Doctor deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete operation failed" });
    }
});

// 7. DELETE img from CreateProfile and Edit Profile 
const fs = require('fs');

// Route to delete a specific file from the server
router.post('/delete-file', (req, res) => {
    const { filePath } = req.body; // e.g., "public/uploads/profiles/image.jpg"
    const fullPath = path.join(__dirname, '../', filePath);

    fs.unlink(fullPath, (err) => {
        if (err) return res.status(500).json({ error: "File not found or already deleted" });
        res.json({ message: "File deleted successfully from server" });
    });
});

module.exports = router;