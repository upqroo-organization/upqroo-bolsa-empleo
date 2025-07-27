/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";

interface EmailRequest {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  template?: string;
  templateData?: Record<string, any>;
}

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

// Email templates
const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  welcome: {
    subject: "Bienvenido a UPQROO Bolsa de Trabajo",
    text: "Bienvenido {{userName}} a la plataforma de empleos de UPQROO. Tu cuenta ha sido creada exitosamente.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bienvenido a UPQROO Bolsa de Trabajo</h2>
        <p>Hola <strong>{{userName}}</strong>,</p>
        <p>Tu cuenta ha sido creada exitosamente en nuestra plataforma de empleos.</p>
        <p>Puedes acceder a tu cuenta en: <a href="{{appUrl}}/login">{{appUrl}}/login</a></p>
        <p>Saludos,<br>Equipo UPQROO</p>
      </div>
    `
  },
  passwordReset: {
    subject: "Restablecer contraseña - UPQROO Bolsa de Trabajo",
    text: "Hola {{userName}}, haz clic en el siguiente enlace para restablecer tu contraseña: {{resetUrl}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Restablecer Contraseña</h2>
        <p>Hola <strong>{{userName}}</strong>,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>
          <a href="{{resetUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Saludos,<br>Equipo UPQROO</p>
      </div>
    `
  },
  companyApproval: {
    subject: "¡Empresa aprobada! - UPQROO Bolsa de Trabajo",
    text: "Felicidades {{contactName}}, tu empresa {{companyName}} ha sido aprobada. Ya puedes publicar vacantes en nuestra plataforma. {{comments}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #16a34a; margin: 0; font-size: 28px;">¡Felicidades!</h1>
            <h2 style="color: #374151; margin: 10px 0 0 0; font-size: 20px;">Tu empresa ha sido aprobada</h2>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Estimado(a) <strong>{{contactName}}</strong>,
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Nos complace informarte que tu empresa <strong style="color: #16a34a;">{{companyName}}</strong> ha sido aprobada para usar la Bolsa de Trabajo de la Universidad Politécnica de Quintana Roo.
          </p>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin: 0 0 10px 0; font-size: 18px;">Ya puedes:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Publicar vacantes de trabajo</li>
              <li style="margin-bottom: 8px;">Revisar aplicaciones de estudiantes y egresados</li>
              <li style="margin-bottom: 8px;">Gestionar tu perfil empresarial</li>
              <li style="margin-bottom: 8px;">Acceder a nuestro talento universitario</li>
            </ul>
          </div>
          
          {{#if comments}}
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
            <h4 style="color: #2563eb; margin: 0 0 8px 0;">Comentarios del coordinador:</h4>
            <p style="color: #374151; margin: 0; font-style: italic;">{{comments}}</p>
          </div>
          {{/if}}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{appUrl}}/empresa" style="background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
              Acceder a tu Panel Empresarial
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos a 
              <a href="mailto:gestionempresarial@upqroo.edu.mx" style="color: #2563eb;">gestionempresarial@upqroo.edu.mx</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #374151; margin: 0; font-size: 16px;">
              Saludos cordiales,<br>
              <strong>Equipo de Coordinación</strong><br>
              <span style="color: #6b7280;">Universidad Politécnica de Quintana Roo</span>
            </p>
          </div>
        </div>
      </div>
    `
  },
  
  companyRejection: {
    subject: "Actualización sobre tu solicitud - UPQROO Bolsa de Trabajo",
    text: "Hola {{contactName}}, hemos revisado la información de tu empresa {{companyName}} y no podemos aprobar tu solicitud en este momento. {{comments}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin: 0; font-size: 24px;">Actualización sobre tu solicitud</h1>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Estimado(a) <strong>{{contactName}}</strong>,
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hemos revisado cuidadosamente la información de tu empresa <strong>{{companyName}}</strong> y lamentamos informarte que no podemos aprobar tu solicitud en este momento.
          </p>
          
          {{#if comments}}
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
            <h4 style="color: #dc2626; margin: 0 0 8px 0;">Motivo de la decisión:</h4>
            <p style="color: #374151; margin: 0;">{{comments}}</p>
          </div>
          {{/if}}
          
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
            <h4 style="color: #2563eb; margin: 0 0 8px 0;">¿Qué puedes hacer ahora?</h4>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Revisar y actualizar la información de tu empresa</li>
              <li style="margin-bottom: 8px;">Contactarnos para obtener más detalles sobre los requisitos</li>
              <li style="margin-bottom: 8px;">Volver a enviar tu solicitud una vez realizadas las correcciones</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:gestionempresarial@upqroo.edu.mx" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
              Contactar Coordinación
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
              Agradecemos tu interés en formar parte de nuestra red de empresas colaboradoras. 
              Estamos aquí para ayudarte en el proceso.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #374151; margin: 0; font-size: 16px;">
              Saludos cordiales,<br>
              <strong>Equipo de Coordinación</strong><br>
              <span style="color: #6b7280;">Universidad Politécnica de Quintana Roo</span>
            </p>
          </div>
        </div>
      </div>
    `
  },
  
  jobApplication: {
    subject: "Nueva aplicación recibida - {{jobTitle}}",
    text: "Has recibido una nueva aplicación de {{applicantName}} para la vacante {{jobTitle}}.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nueva Aplicación Recibida</h2>
        <p>Has recibido una nueva aplicación para la vacante:</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0;">{{jobTitle}}</h3>
          <p style="margin: 0;"><strong>Aplicante:</strong> {{applicantName}}</p>
          <p style="margin: 0;"><strong>Email:</strong> {{applicantEmail}}</p>
        </div>
        <p>
          <a href="{{appUrl}}/empresa/aplicaciones" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Ver Aplicación
          </a>
        </p>
        <p>Saludos,<br>Equipo UPQROO</p>
      </div>
    `
  }
};

function replaceTemplateVariables(template: string, data: Record<string, any>): string {
  // Handle conditional blocks like {{#if comments}}...{{/if}}
  const processedTemplate = template.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    return data[condition] ? content : '';
  });
  
  // Replace regular variables
  return processedTemplate.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || '';
  });
}

export async function sendEmailDirect(options: EmailRequest): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { to, subject, text, html, template, templateData } = options;

    if (!to) {
      throw new Error("Missing 'to' email address");
    }

    // Get host information from environment
    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const fromName = process.env.SMTP_FROM_NAME || 'UPQROO Bolsa de Trabajo';
    const fromEmail = process.env.SMTP_USER!;

    // Prepare email content
    let emailSubject = subject;
    let emailText = text;
    let emailHtml = html;

    // Use template if specified
    if (template && EMAIL_TEMPLATES[template]) {
      const emailTemplate = EMAIL_TEMPLATES[template];
      const data = {
        appUrl,
        ...templateData
      };

      emailSubject = replaceTemplateVariables(emailTemplate.subject, data);
      emailText = replaceTemplateVariables(emailTemplate.text, data);
      emailHtml = replaceTemplateVariables(emailTemplate.html, data);
    }

    // Validate that we have content to send
    if (!emailSubject || (!emailText && !emailHtml)) {
      throw new Error("Missing email content (subject, text, or html)");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: emailSubject,
      ...(emailText && { text: emailText }),
      ...(emailHtml && { html: emailHtml }),
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}