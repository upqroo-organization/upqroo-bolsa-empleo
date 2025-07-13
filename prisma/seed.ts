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

  console.log('Roles seeded successfully.')
}

main()
  .catch((e) => {
    console.error('Error seeding roles:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })