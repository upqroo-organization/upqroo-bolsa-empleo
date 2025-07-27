import { sendEmailDirect } from './emailService';

interface SendEmailOptions {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  template?: string;
  templateData?: Record<string, unknown>;
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    const result = await sendEmailDirect(options);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Helper functions for common email types
export const emailHelpers = {
  sendWelcomeEmail: (to: string, userName: string) =>
    sendEmail({
      to,
      template: 'welcome',
      templateData: { userName }
    }),

  sendPasswordResetEmail: (to: string, userName: string, resetUrl: string) =>
    sendEmail({
      to,
      template: 'passwordReset',
      templateData: { userName, resetUrl }
    }),

  sendCompanyApprovalEmail: (to: string, companyName: string, contactName?: string, comments?: string) =>
    sendEmail({
      to,
      template: 'companyApproval',
      templateData: { companyName, contactName: contactName || companyName, comments }
    }),

  sendCompanyRejectionEmail: (to: string, companyName: string, contactName?: string, comments?: string) =>
    sendEmail({
      to,
      template: 'companyRejection',
      templateData: { companyName, contactName: contactName || companyName, comments }
    }),

  sendJobApplicationEmail: (
    to: string,
    jobTitle: string,
    applicantName: string,
    applicantEmail: string
  ) =>
    sendEmail({
      to,
      template: 'jobApplication',
      templateData: { jobTitle, applicantName, applicantEmail }
    }),
};