const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    reg_full_name: { type: String, required: true },
    reg_date_of_birth: { type: String, required: true },
    reg_gender: { type: String, required: true },
    reg_qualification: { type: String },
    reg_mobile_number: { type: String, required: true },
    reg_email: { type: String, required: true, unique: true },
    reg_guardian_name: { type: String },
    reg_guardian_occupation: { type: String },
    reg_guardians_mobile: { type: String },
    reg_course: { type: String, required: true },
    reg_training_mode: { type: String },
    reg_training_location: { type: String },
    reg_preferred_timings: [{ type: String }],
    reg_address: { type: String },
    reg_course: [{ type: String, required: true }],
    reg_state: { type: String },
    reg_city: { type: String },
    reg_zip: { type: String },
    otp: { type: String },
    otpExpires: { type: Number },
    password: { type: String },
    profileImage: { type: Buffer },
    profileImageType: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema);