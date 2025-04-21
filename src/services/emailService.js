// This service uses EmailJS to send real emails
// You'll need to sign up for a free account at https://www.emailjs.com/

// Import EmailJS
import emailjs from '@emailjs/browser';
import emailConfig from '../config/emailConfig';

// Initialize EmailJS with the configuration
emailjs.init(emailConfig.USER_ID);

// Check if EmailJS is configured
const isEmailJSConfigured = () => {
  return emailConfig.USER_ID && emailConfig.SERVICE_ID && emailConfig.TEMPLATE_ID;
};

const sendEmail = async (to, subject, templateData, isTeamMember = false) => {
  try {
    // Check if EmailJS is configured
    if (!isEmailJSConfigured()) {
      console.log('EmailJS not configured. Storing email in localStorage only.');
      
      // Store in localStorage for the notifications page
      const emails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
      emails.push({
        to,
        subject,
        body: templateData.message,
        timestamp: new Date().toISOString(),
        status: 'stored_only'
      });
      localStorage.setItem('sent_emails', JSON.stringify(emails));
      
      return false;
    }
    
    // Send email using EmailJS with template variables
    const response = await emailjs.send(
      emailConfig.SERVICE_ID,
      isTeamMember ? emailConfig.MEMBER_TEMPLATE_ID : emailConfig.TEMPLATE_ID,
      {
        to_email: to,
        ...templateData  // Spread the template data directly
      }
    );
    
    console.log('Email sent successfully:', response);
    
    // Store in localStorage for the notifications page
    const emails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
    emails.push({
      to,
      subject,
      body: templateData.message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('sent_emails', JSON.stringify(emails));
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Store failed email in localStorage
    const emails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
    emails.push({
      to,
      subject,
      body: templateData.message,
      timestamp: new Date().toISOString(),
      status: 'failed',
      error: error.message
    });
    localStorage.setItem('sent_emails', JSON.stringify(emails));
    
    return false;
  }
};

const sendTeamLeaderNotification = async (teamName, leaderName, leaderEmail) => {
  const subject = `You've been assigned as Team Leader for ${teamName}`;
  const body = `
    Dear ${leaderName},

    You have been assigned as the team leader for the team "${teamName}".

    As a team leader, you will be responsible for:
    - Managing team members
    - Coordinating team activities
    - Ensuring project milestones are met
    - Facilitating team communication

    Please log in to your account to view team details and start managing your team.

    Best regards,
    Project Management System
  `;

  return sendEmail(leaderEmail, subject, { message: body });
};

// Function to configure EmailJS
const configureEmailJS = (userId, serviceId, templateId) => {
  localStorage.setItem('emailjs_user_id', userId);
  localStorage.setItem('emailjs_service_id', serviceId);
  localStorage.setItem('emailjs_template_id', templateId);
  
  // Initialize EmailJS with the new user ID
  emailjs.init(userId);
  
  return true;
};

export { sendEmail, sendTeamLeaderNotification, configureEmailJS, isEmailJSConfigured }; 