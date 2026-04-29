import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Contact from '../models/Contact.js';

dotenv.config();

const router = express.Router();

const getIpAddress = (req) => {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
};

router.post('/', async (req, res) => {
  console.log('=== Contact Form Submission ===');
  console.log('Request body:', req.body);
  
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    console.log('Validation failed');
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address' 
    });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration missing in .env');
    return res.status(500).json({ 
      success: false, 
      message: 'Server configuration error. Please contact support.' 
    });
  }

  try {
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      status: 'pending',
      ipAddress: getIpAddress(req),
      userAgent: req.headers['user-agent']
    });

    const savedContact = await newContact.save();
    console.log('Contact saved to database with ID:', savedContact._id);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const adminInfo = await transporter.sendMail({
      from: `"HealthMate" <${process.env.EMAIL_USER}>`,
      to: 'ayufer9@gmail.com',
      subject: `Contact Form: ${subject} (ID: ${savedContact._id})`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\nInquiry ID: ${savedContact._id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 10px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .inquiry-id { background: #e8f5e9; padding: 10px; border-left: 4px solid #4CAF50; margin: 15px 0; }
            .footer { background: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 New Contact Inquiry</h2>
            </div>
            <div class="content">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
              <div class="inquiry-id">
                <strong>📌 Inquiry ID:</strong> ${savedContact._id}<br>
                <strong>📅 Submitted:</strong> ${new Date().toLocaleString()}
              </div>
            </div>
            <div class="footer">
              <p>Sent from HealthMate App | Chitkara University, Baddi</p>
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/contacts">View in Admin Panel</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('Admin email sent:', adminInfo.messageId);

    const userInfo = await transporter.sendMail({
      from: `"HealthMate Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✓ Acknowledgment: We received your message - HealthMate`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 10px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .ack-box { background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center; }
            .inquiry-details { background: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0; }
            .footer { background: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
            .button { background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✓ We received your message</h2>
            </div>
            <div class="content">
              <div class="ack-box">
                <h3>Dear ${name},</h3>
                <p><strong>Thank you for contacting HealthMate!</strong></p>
              </div>
              
              <p>We have received your message and our support team will get back to you within <strong>24 hours</strong>.</p>
              
              <div class="inquiry-details">
                <p><strong>📝 Your Message Details:</strong></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small><strong>Inquiry Reference ID:</strong> ${savedContact._id}</small></p>
                <p><small><strong>Submitted on:</strong> ${new Date().toLocaleString()}</small></p>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ol>
                <li>Our team will review your inquiry</li>
                <li>You'll receive a response within 24 hours</li>
                <li>For urgent matters, please call us at (01795) 555-0132</li>
              </ol>
              
              <p>Please save this email for your records. Your inquiry reference ID is: <strong>${savedContact._id}</strong></p>
              
              <p style="margin-top: 20px;">Best regards,<br>
              <strong>HealthMate Customer Support Team</strong><br>
              Chitkara University, Baddi, Himachal Pradesh</p>
            </div>
            <div class="footer">
              <p>© 2024 HealthMate - Your Health, Our Priority</p>
              <p>This is an automated acknowledgment. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('Acknowledgment email sent to user:', userInfo.messageId);

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you within 24 hours.',
      inquiryId: savedContact._id,
      acknowledgmentSent: true
    });
    
  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    let userMessage = 'Failed to send message. ';
    if (error.code === 'EAUTH') {
      userMessage += 'Email authentication failed. Please contact support.';
    } else if (error.code === 'ESOCKET') {
      userMessage += 'Network error. Please try again.';
    } else {
      userMessage += 'Please try again later.';
    }
    
    res.status(500).json({ 
      success: false, 
      message: userMessage
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const updateData = { status };
  
  if (status === 'read') updateData.readAt = new Date();
  if (status === 'replied') updateData.repliedAt = new Date();
  
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/notes', async (req, res) => {
  const { notes } = req.body;
  
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { adminNotes: notes },
      { new: true }
    );
    
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;