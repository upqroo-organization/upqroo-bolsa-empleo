# UPQROO Bolsa de Trabajo Universitaria

## Product Overview

This is a university job board platform for the Universidad Politécnica de Quintana Roo (UPQROO). The platform connects students, graduates, and companies through job postings, applications, and professional internships.

## Key Features

- **Multi-role System**: Supports students, external users, companies, coordinators, and administrators
- **Job Management**: Companies can post, manage, and track job vacancies
- **Application System**: Students can apply to jobs and track their applications
- **CV Upload**: Students can upload and manage their CVs in PDF format
- **Company Validation**: Coordinators approve companies before they can post jobs
- **Survey System**: Performance evaluation surveys for students hired by companies created by coordinators and answered by companies
- **Authentication**: Google OAuth for students and email/password for companies

## User Roles

- **Student**: UPQROO students (identified by @upqroo.edu.mx email)
- **External**: Non-UPQROO users
- **Company**: Employers who can post job vacancies
- **Coordinator**: University staff who manage companies and surveys
- **Admin**: System administrators

## Business Rules

- Companies must be approved before posting jobs
- Coordinators must approve companies before can use the platform
- Students can upload only one CV (PDF format, max 5MB)
- Surveys become available to companies after a configured period post-hiring
- Each user role has specific access permissions to different sections
