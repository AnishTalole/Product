    const QRCode = require('qrcode');
    const path = require('path');
    const Doctor = require('../models/Doctor');

    exports.createDoctor = async (req, res) => {
        try {
            // 1. Generate Slug from Name (e.g., "Dr. Anish Talole" -> "dr-anish-talole")
            const name = req.body.name;
            const slug = name.toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '');
            
            // 2. Parse JSON strings back into Arrays (since FormData sends them as strings)
            const branches = req.body.branches ? JSON.parse(req.body.branches) : [];
            const socialMedia = req.body.socialMedia ? JSON.parse(req.body.socialMedia) : [];

            // 3. Define Paths for QR Code
            // BASE_URL will be your domain (e.g., http://localhost:5000 or your Virtualmin domain)
            const url = `${process.env.BASE_URL}/card/${slug}`;
            const qrFileName = `qr-${slug}.png`;
            const qrLocalPath = path.join(__dirname, '../public/uploads/qrcodes/', qrFileName);

            // 4. Generate and Save QR Code locally
            await QRCode.toFile(qrLocalPath, url, {
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                margin: 2,
                width: 500
            });

            // 5. Create Database Entry
            const newDoctor = new Doctor({
                ...req.body, // Spread the rest of the text fields
                slug: slug,
                branches: branches,
                socialMedia: socialMedia,
                // Access files using the names defined in your upload middleware
                profileImage: req.files['profileImage'] ? req.files['profileImage'][0].filename : null,
                qrLogo: req.files['qrLogo'] ? req.files['qrLogo'][0].filename : null,
                qrCodePath: qrFileName
            });

            // 6. Save to MongoDB
            await newDoctor.save();

            res.status(201).json({ 
                message: "Doctor Created Successfully!", 
                data: newDoctor,
                cardUrl: url 
            });

        } catch (error) {
            console.error("Controller Error:", error);
            res.status(500).json({ error: "Server Error", details: error.message });
        }
    };