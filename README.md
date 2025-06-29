# 🧠 UPQROO Bolsa de Trabajo Universitaria

This project is a web platform built with Next.js 15, Prisma, and MySQL. It enables students, graduates, and companies to interact through job postings, applications, and professional internships. Google OAuth authentication is included.

---

## 🚀 Requirements

- Node.js v18+
- MySQL instalado (local o remoto)
- Yarn o npm

---

## 🧪 Eviroment variables

Create a `.env` file on the project root with the following information (ask to project administator for the actual variables):

```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/bolsa_trabajo"

GOOGLE_CLIENT_ID="TU_CLIENT_ID"
GOOGLE_CLIENT_SECRET="TU_CLIENT_SECRET"

NEXTAUTH_SECRET="clave_segura_generada"
NEXTAUTH_URL="http://localhost:3000"
```

## Project installation

```
git clone https://github.com/tu_usuario/bolsa-trabajo.git
cd bolsa-trabajo
npm install
```

# Google OAuth Auth

This project is using the Google OAuth auth provided by Google Cloud Service

# 📘 Prisma Command Reference

This project uses [Prisma](https://www.prisma.io/) as the ORM for MySQL. Below are the most useful commands for managing the database schema, generating the client, and working with seed data.

- Note: Please check the available commands written on `package.json` file.

---

## ⚙️ Initialization & Setup (Needed to setup the project on your local machine)

```bash
npx prisma init
npx prisma generate
```

## 🔄 Migrations & Schema Changes

```bash
npx prisma migrate dev --name your_migration_name
npx prisma migrate reset
npx prisma migrate deploy
npx prisma db push
npx prisma db pull
```

## 🔍 Database Visualization

```bash
npx prisma studio
```

## 🌱 Seeding the Database

```bash
npx prisma db seed
```
