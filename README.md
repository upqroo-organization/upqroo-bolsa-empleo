# 🧠 Plataforma Bolsa de Trabajo Universitaria

Este proyecto es una plataforma web construida con Next.js 15, Prisma y MySQL. Permite a estudiantes, egresados y empresas interactuar mediante vacantes, postulaciones y prácticas profesionales. Incluye autenticación por Google OAuth.

---

## 🚀 Requisitos

- Node.js v18+
- MySQL instalado (local o remoto)
- Yarn o npm

---

## 🧪 Variables de entorno

Crea un archivo `.env` en la raíz con lo siguiente:

```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/bolsa_trabajo"

GOOGLE_CLIENT_ID="TU_CLIENT_ID"
GOOGLE_CLIENT_SECRET="TU_CLIENT_SECRET"

NEXTAUTH_SECRET="clave_segura_generada"
NEXTAUTH_URL="http://localhost:3000"
```
## Instalación del proyecto
```
git clone https://github.com/tu_usuario/bolsa-trabajo.git
cd bolsa-trabajo
npm install
```

# Prisma migración del clienet

# Crear las tablas en la base de datos
`npx prisma migrate dev --name init`

# Generar el cliente de Prisma
`npx prisma generate`

# Autenticación Google OAuth

El proyecto utiliza google OAuth para el login y obtención de datos.