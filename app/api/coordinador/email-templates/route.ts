import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Email templates for coordinators
const EMAIL_TEMPLATES = {
  jobFair: {
    id: 'jobFair',
    name: 'Feria de Empleo',
    subject: 'Invitación a Feria de Empleo UPQROO',
    description: 'Invitación para participar en la feria de empleo universitaria',
    variables: ['eventDate', 'eventLocation', 'registrationDeadline', 'contactEmail'],
    content: `Nos complace invitarle a participar en nuestra próxima Feria de Empleo que se realizará el {{eventDate}} en {{eventLocation}}.

Esta es una excelente oportunidad para:
• Conocer a estudiantes y egresados talentosos de UPQROO
• Presentar las oportunidades laborales de su empresa
• Fortalecer vínculos con la universidad
• Ampliar su red de contactos profesionales

Para confirmar su participación, favor de responder antes del {{registrationDeadline}}.

Para más información, puede contactarnos en {{contactEmail}}.`
  },

  surveyRequest: {
    id: 'surveyRequest',
    name: 'Solicitud de Encuesta',
    subject: 'Evaluación de Desempeño - Estudiante UPQROO',
    description: 'Solicitud para evaluar el desempeño de estudiantes contratados',
    variables: ['studentName', 'position', 'hireDate', 'surveyLink'],
    content: `Esperamos que {{studentName}} esté cumpliendo con las expectativas en el puesto de {{position}} desde su contratación el {{hireDate}}.

Como parte de nuestro programa de seguimiento, le solicitamos completar una breve evaluación sobre el desempeño del estudiante.

La encuesta toma aproximadamente 5 minutos y nos ayuda a:
• Mejorar la calidad de nuestros egresados
• Ajustar nuestros programas académicos
• Fortalecer la relación universidad-empresa

Puede acceder a la encuesta en el siguiente enlace: {{surveyLink}}

Su retroalimentación es muy valiosa para nosotros.`
  },

  partnership: {
    id: 'partnership',
    name: 'Propuesta de Colaboración',
    subject: 'Oportunidades de Colaboración UPQROO',
    description: 'Propuesta para establecer convenios de colaboración',
    variables: ['partnershipType', 'benefits', 'nextSteps'],
    content: `Nos dirigimos a ustedes para proponer una colaboración estratégica entre su empresa y la Universidad Politécnica de Quintana Roo.

Tipo de colaboración propuesta: {{partnershipType}}

Beneficios para su empresa:
{{benefits}}

Próximos pasos:
{{nextSteps}}

Estamos seguros de que esta alianza será mutuamente beneficiosa y contribuirá al desarrollo profesional de nuestros estudiantes.`
  },

  newsletter: {
    id: 'newsletter',
    name: 'Boletín Informativo',
    subject: 'Boletín UPQROO - Bolsa de Trabajo',
    description: 'Boletín mensual con noticias y actualizaciones',
    variables: ['month', 'highlights', 'statistics', 'upcomingEvents'],
    content: `Boletín correspondiente al mes de {{month}}.

DESTACADOS DEL MES:
{{highlights}}

ESTADÍSTICAS:
{{statistics}}

PRÓXIMOS EVENTOS:
{{upcomingEvents}}

Gracias por ser parte de nuestra red de empresas colaboradoras.`
  },

  reminder: {
    id: 'reminder',
    name: 'Recordatorio',
    subject: 'Recordatorio - {{reminderType}}',
    description: 'Recordatorio general para empresas',
    variables: ['reminderType', 'details', 'deadline', 'action'],
    content: `Le recordamos sobre: {{reminderType}}

Detalles:
{{details}}

Fecha límite: {{deadline}}

Acción requerida: {{action}}

No dude en contactarnos si tiene alguna pregunta.`
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: Object.values(EMAIL_TEMPLATES)
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}