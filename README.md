# 🧠 UPQROO Bolsa de Trabajo Universitaria

This project is a web platform built with Next.js 15, Prisma, and MySQL. It enables students, graduates, and companies to interact through job postings, applications, and professional internships. Google OAuth authentication is included.

---

## 🚀 Requirements

- Node.js v18+
- MySQL instalado (local or remote)
- npm

---

## 🧪 Eviroment variables

Create a `.env` file on the project root with the same information on the `.env.example` file (ask to project administator for the actual variables).

If you have access to the server, you can check the enviroment variables on the apache2 folder for this project.

## Project installation

```
git clone https://github.com/upqroo-organization/upqroo-bolsa-empleo.git
cd bolsa-trabajo
npm install
# This commands are require if you will use your own database.
npm run prisma:generate
npm run prisma:seed
```

## Google OAuth Auth & Email Credentials (Managed with Next Auth)

This project is using the Google OAuth auth provided by Google Cloud Service for general users, and Email base login for comanies.

## Commits & Contribution convention:

The Main branch are locked to push changes from your local, so please create a new branch to upload changes and merge the changes from a Pull Request with 1 reviewer at least, a approval is required to merge the Pull Request.

Please, name the new branches according of the type of change you are working and small description, (ex: feature/profile_page):

- feature/
- release/
- fix/
- hotfix/

## 📘 Prisma ORM & Database

This project uses [Prisma](https://www.prisma.io/) as the ORM for MySQL. Below are the most useful commands for managing the database schema, generating the client, and working with seed data.

- Note: Please check the available commands written on `package.json` file.

---

### ⚙️ Initialization & Setup (Needed to setup the project on your local machine)

```bash
npx prisma generate
```

### 🔄 Migrations & Schema Changes

For new change on prisma:

```bash
npx prisma migrate dev --name your_migration_name
```

For update your database:

```bash
npx prisma db push
npx prisma db pull
```

### Database Visualization

```bash
npx prisma studio
```

### 🌱 Seeding the Database (To add default data on the tables)

If run this command twice, the data on some tables may duplicate.

```bash
npx prisma db seed
```
