const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const Course = require('./courseschema');
const Registration = require('./registerschema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/courses', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

app.post('/api/register', async (req, res) => {

    try {
        await Registration.create(req.body);
    }   catch (dbErr) {
        return res.status(500).send({ message: 'Database save failed', error: dbErr });
    }

    const { reg_email, reg_full_name } = req.body;

  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });

  let mailOptions = {
      from: process.env.EMAIL_USER,
      to: reg_email,
      subject: 'Registration Successful',
      text: `Hello ${reg_full_name},\n\nThank you for registering at SCOPE INDIA!`
  };

   try {
      await transporter.sendMail(mailOptions);
      res.status(200).send({ message: 'Email sent' });
  } catch (err) {
      res.status(500).send({ message: 'Email failed', error: err });
  }
});

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await Registration.findOne({ reg_email: email });
  if (!user) {
    return res.status(404).json({ message: 'Email not registered. Complete your registration.' });
  }
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await Registration.findOne({ reg_email: email });
  if (!user || !user.otp || !user.otpExpires) {
    return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
  }
  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP.' });
  }
  if (Date.now() > user.otpExpires) {
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ message: 'OTP verified successfully!' });
});

app.post('/api/set-password', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  const user = await Registration.findOne({ reg_email: email });
  if (!user)
    return res.status(404).json({ message: 'User not found.' });

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  user.password = hashedPassword;
  await user.save();

  res.json({ message: 'Password set successfully.' });
});

app.post('/api/check-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  try {
    const user = await Registration.findOne({ reg_email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.', hasPassword: false });
    }
    const hasPassword = !!user.password;
    return res.json({ hasPassword });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password, keepMeSignedIn } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const user = await Registration.findOne({ reg_email: email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const payload = {
      userId: user._id,
      email: user.reg_email,
      name: user.reg_full_name
    };
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = keepMeSignedIn ? '30d' : '1d'; // 30 days or 1 day

    const token = jwt.sign(payload, jwtSecret, { expiresIn });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: keepMeSignedIn ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    });

    let profileImageUrl = null;
    if (user.profileImage && user.profileImageType) {
      const base64 = user.profileImage.toString('base64');
      profileImageUrl = `data:${user.profileImageType};base64,${base64}`;
    }

    res.json({
      message: 'Login successful.',
      profileImageUrl,
      name: user.reg_full_name,
      email: user.reg_email
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

app.post('/api/logout', (req, res) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully.' });
});

const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.auth_token || req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing.' });
  }
  const jwtSecret = process.env.JWT_SECRET;
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
};

app.get('/api/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await Registration.findOne({ reg_email: req.user.email }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    delete user.password;
    delete user.otp;
    delete user.otpExpires;

    let profileImageUrl = null;
    if (user.profileImage && user.profileImageType) {
      const base64 = user.profileImage.toString('base64');
      profileImageUrl = `data:${user.profileImageType};base64,${base64}`;
    }
    user.profileImageUrl = profileImageUrl;

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

app.post('/api/profile/upload-image', authenticateJWT, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const user = await Registration.findOne({ reg_email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.profileImage = req.file.buffer;
    user.profileImageType = req.file.mimetype;
    await user.save();
    res.json({ message: 'Profile image uploaded successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed.', error: err.message });
  }
});

app.get('/api/profile/image', authenticateJWT, async (req, res) => {
  try {
    const user = await Registration.findOne({ reg_email: req.user.email });
    if (!user || !user.profileImage) {
      return res.status(404).json({ message: 'No profile image found.' });
    }
    const base64 = user.profileImage.toString('base64');
    const dataUrl = `data:${user.profileImageType};base64,${base64}`;
    res.json({ profileImage: dataUrl });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch image.', error: err.message });
  }
});

app.delete('/api/profile/remove-image', authenticateJWT, async (req, res) => {
  try {
    const user = await Registration.findOne({ reg_email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.profileImage = undefined;
    user.profileImageType = undefined;
    await user.save();
    res.json({ message: 'Profile image removed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove profile image.', error: err.message });
  }
});

app.put('/api/profile/update', authenticateJWT, async (req, res) => {
  try {
    const user = await Registration.findOne({ reg_email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatableFields = [
      'reg_date_of_birth',
      'reg_gender',
      'reg_qualification',
      'reg_mobile_number',
      'reg_email',
      'reg_guardian_name',
      'reg_guardian_occupation',
      'reg_guardians_mobile',
      'reg_course',
      'reg_training_mode',
      'reg_training_location',
      'reg_preferred_timings',
      'reg_address',
      'reg_country',
      'reg_state',
      'reg_city',
      'reg_zip'
    ];

    updatableFields.forEach(field => {
      if (typeof req.body[field] !== 'undefined') {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.', error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));