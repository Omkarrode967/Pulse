# Email Setup Guide

To send real emails from the application, you need to set up EmailJS. Follow these steps:

## 1. Sign up for EmailJS

1. Go to [EmailJS](https://www.emailjs.com/) and sign up for a free account.
2. After signing up, you'll get a User ID. Copy this ID.

## 2. Create an Email Service

1. In the EmailJS dashboard, go to "Email Services" and click "Add New Service".
2. Choose your email provider (Gmail, Outlook, etc.) and follow the setup instructions.
3. After setting up, you'll get a Service ID. Copy this ID.

## 3. Create an Email Template

1. In the EmailJS dashboard, go to "Email Templates" and click "Create New Template".
2. Design your template with variables like `{{to_email}}`, `{{subject}}`, and `{{message}}`.
3. After creating, you'll get a Template ID. Copy this ID.

## 4. Update the Email Service in the Code

1. Open `src/services/emailService.js`.
2. Replace `'YOUR_USER_ID'` with your actual EmailJS User ID.
3. Replace `'YOUR_SERVICE_ID'` with your actual EmailJS Service ID.
4. Replace `'YOUR_TEMPLATE_ID'` with your actual EmailJS Template ID.

## 5. Test the Email Functionality

1. Create a new team and assign a team leader.
2. The team leader should receive a real email notification.
3. You can also check the "Email Notifications" page to see the sent emails.

## Troubleshooting

- If emails are not being sent, check the browser console for errors.
- Make sure your EmailJS account has enough credits (free tier has a limit).
- Verify that your email service is properly connected in the EmailJS dashboard. 