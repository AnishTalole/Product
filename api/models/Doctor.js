    const mongoose = require('mongoose');

    const BranchSchema = new mongoose.Schema({
        branchName: String,
        branchEmail: String,
        branchMobile: String,
        branchWhatsapp: String,
        branchGoogleProfile: String,
        branchRatingLink: String,
        branchLocation: String,
        branchTiming: String,
        branchWebsite: String,
        branchAddress: String
    });

    const DoctorSchema = new mongoose.Schema({
        name: { type: String, required: true },
        companyName: String,
        profileImage: String, // Path to local file
        qrLogo: String,       // Path to center logo file
        subtitle: String,
        details: String,      // Rich text/HTML
        email: String,
        mobile: String,
        whatsapp: String,
        googleProfile: String,
        googleRating: String,
        locationLink: String,
        website: String,
        appointmentLink: String,
        branchTitle: { type: String, default: "Our Branches" },
        branches: [BranchSchema], // Dynamic array for "Add Branch"
        socialMedia: [{ platform: String, url: String }],
        slug: { type: String, unique: true }, // For the URL: /card/dr-anish
        qrCodePath: String    // Path to the generated QR image
    }, { timestamps: true });

    module.exports = mongoose.model('Doctor', DoctorSchema);