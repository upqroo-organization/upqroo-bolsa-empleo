import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const states = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Coahuila",
  "Colima",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "México",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas"
];

async function main() {
  const roles = [
    'student',
    'graduate',
    'external',
    'coordinator',
    'admin',
    'company',
  ]

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  for (const name of states) {
    await prisma.state.create({ data: { name } });
  }

  // Create default survey
  const defaultSurvey = await prisma.survey.upsert({
    where: { id: 'default-survey-id' },
    update: {},
    create: {
      id: 'default-survey-id',
      title: 'Cuestionario para medir la satisfacción de los empleadores que cuentan con egresados del nivel licenciatura e ingeniería laborando en sus instalaciones',
      description: 'Con el propósito de conocer el nivel de satisfacción de los servicios que los alumnos y/o egresados de la Universidad Politécnica de Quintana Roo, presentan en su empresa y de esta manera poder retroalimentar a la institución e implementar medidas correctivas en el proceso de enseñanza/aprendizajes de alumnos.',
      isActive: true,
      daysAfterHiring: 30,
      surveyDuration: 30,
    }
  });

  // Survey questions for student performance evaluation
  const surveyQuestions = [
    {
      question: '¿Cómo considera los conocimientos con los que cuenta el egresado Licenciatura e Ingeniería para proponer alternativas de solución a los problemas que se le consultan de acuerdo a la carrera que cursó, función que desempeña y/o puesto?',
      order: 1,
      isRequired: true
    },
    {
      question: '¿El conocimiento y habilidad por parte del egresado de la Licenciatura e Ingeniería, en el manejo del equipo, maquinaria y herramientas de trabajo para desempeñar sus actividades lo considera?',
      order: 2,
      isRequired: true
    },
    {
      question: '¿Cómo valora usted el trabajo desempeñado por el egresado de Licenciatura e Ingeniería en cuanto a calidad y rapidez en los proyectos asignados?',
      order: 3,
      isRequired: true
    },
    {
      question: 'La creatividad e innovación para proponer mejoras a los procesos de la empresa por parte del egresado de Licenciatura e Ingeniería los considera:',
      order: 4,
      isRequired: true
    },
    {
      question: 'La capacidad y disposición con que cuenta el egresado de Licenciatura e Ingeniería para trabajar en equipo, los valora:',
      order: 5,
      isRequired: true
    },
    {
      question: '¿El grado del egresado de Licenciatura e Ingeniería para poder alcanzar un mejor puesto en su empresa de acuerdo a su nivel académico?',
      order: 6,
      isRequired: true
    },
    {
      question: '¿Considera usted que este profesionista cumple con los requerimientos del sector productivo y social?',
      order: 7,
      isRequired: true
    },
    {
      question: 'En general ¿Cómo califica el trabajo que desempeña el egresado de Licenciatura e Ingeniería, en su empresa?',
      order: 8,
      isRequired: true
    }
  ];

  // Create survey questions
  for (const questionData of surveyQuestions) {
    await prisma.surveyQuestion.upsert({
      where: { 
        id: `question-${defaultSurvey.id}-${questionData.order}` 
      },
      update: {},
      create: {
        id: `question-${defaultSurvey.id}-${questionData.order}`,
        surveyId: defaultSurvey.id,
        question: questionData.question,
        order: questionData.order,
        isRequired: questionData.isRequired
      }
    });
  }

  console.log('Roles and states seeded successfully.');
  console.log('Default survey created with', surveyQuestions.length, 'questions.');
}

main()
  .catch((e) => {
    console.error('Error seeding roles:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })