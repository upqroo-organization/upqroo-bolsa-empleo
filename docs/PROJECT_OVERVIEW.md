# UPQROO Bolsa de Trabajo Universitaria - Project Overview

## 🎯 Project Purpose

The **UPQROO Bolsa de Trabajo Universitaria** is a comprehensive job board platform designed specifically for the Universidad Politécnica de Quintana Roo (UPQROO). This platform serves as a bridge connecting students, graduates, and companies through professional opportunities, internships, and career development programs.

The system facilitates talent attraction and employment opportunities within the university community, providing a centralized hub for job postings, applications, and professional networking.

## 🏗️ System Architecture

### Technology Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MySQL with Prisma 6 ORM
- **Authentication**: NextAuth.js with dual providers:
  - Google OAuth (for students and external users)
  - Credentials provider (for companies)
- **UI Framework**: Custom components built with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Hooks and Context API

### Core Libraries & Tools

| Category              | Technology              | Purpose                            |
| --------------------- | ----------------------- | ---------------------------------- |
| **UI Components**     | Radix UI (@radix-ui/\*) | Accessible, unstyled UI primitives |
| **Icons**             | Lucide React            | Modern icon library                |
| **Date Handling**     | date-fns, dayjs         | Date manipulation and formatting   |
| **Notifications**     | Sonner                  | Toast notifications                |
| **Email Service**     | nodemailer              | Email communication                |
| **Security**          | bcryptjs                | Password hashing                   |
| **API Documentation** | TO DO                   | API documentation and testing      |

### Application Structure

```
upqroo-bolsa-empleo/
├── app/                    # Next.js App Router
│   ├── api/               # API routes organized by role
│   ├── admin/             # Admin dashboard
│   ├── client/            # Student/external user pages
│   ├── coordinador/       # Coordinator management
│   ├── empresa/           # Company portal
│   ├── auth/              # Authentication pages
│   └── ...
├── components/            # Reusable React components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
├── utils/                # Helper functions
└── public/               # Static assets
```

## 👥 User Roles & Permissions

### 1. **Student** 👨‍🎓

- **Identification**: @upqroo.edu.mx email domain
- **Authentication**: Google OAuth
- **Capabilities**:
  - Browse and apply to job postings
  - Upload and manage CV (PDF, max 5MB)
  - Track application status
  - Access career resources

### 2. **External User** 🌐

- **Identification**: Non-UPQROO email addresses
- **Authentication**: Google OAuth
- **Capabilities**:
  - Limited access to job postings
  - Basic application functionality
  - CV management

### 3. **Company** 🏢

- **Authentication**: Email/password credentials
- **Approval Process**: Must be validated by coordinators
- **Capabilities**:
  - Post and manage job vacancies
  - Review applications
  - Access candidate profiles
  - Participate in performance surveys

### 4. **Coordinator** 👨‍💼

- **Role**: University staff members
- **Responsibilities**:
  - Approve company registrations
  - Create and manage performance surveys
  - Monitor platform activity
  - Manage email campaigns

### 5. **Administrator** ⚙️ (Isn't working yet)

- **Role**: System administrators
- **Capabilities**:
  - Full system access
  - User management
  - System configuration
  - Data analytics

## 🔄 Core Business Processes

### Company Onboarding Workflow

1. **Registration**: Company creates account with credentials
2. **Validation**: Coordinator reviews and approves company
3. **Activation**: Approved companies can post job vacancies
4. **Monitoring**: Ongoing oversight by coordinators

### Job Application Process

1. **Job Discovery**: Students browse available positions
2. **Application**: Submit application with CV
3. **Review**: Companies evaluate candidates
4. **Hiring**: Selection and hiring process
5. **Survey**: Post-hiring performance evaluation

### Survey System

- **Creation**: Coordinators design performance surveys
- **Distribution**: Surveys sent to companies after hiring
- **Collection**: Feedback gathered for continuous improvement
- **Analysis**: Data used for program enhancement

## 🔐 Security & Authentication

### Authentication Methods

- **Google OAuth**: Seamless login for students and external users
- **Credentials**: Secure email/password for companies
- **Session Management**: NextAuth.js handles session security

### Data Protection

- **File Security**: CV uploads with size and type validation
- **Role-based Access**: Strict permission controls
- **Data Encryption**: Secure password hashing with bcryptjs

## 📊 Key Features

### For Students & External Users (graduated students)

- **Job Search**: Advanced filtering and search capabilities
- **Application Tracking**: Real-time status updates
- **CV Management**: Secure document upload and storage
- **Profile Management**: Comprehensive user profiles

### For Companies

- **Vacancy Management**: Create, edit, and manage job postings
- **Candidate Review**: Access to applicant profiles and CVs
- **Application Tracking**: Monitor hiring pipeline
- **Survey Participation**: Provide feedback on hired candidates

### For Coordinators

- **Company Approval**: Validate and approve company registrations
- **Survey Creation**: Design performance evaluation surveys
- **Email Campaigns**: Communicate with platform users
- **Analytics**: Monitor platform usage and effectiveness

### For Administrators (TBA)

- **User Management**: Complete user lifecycle management
- **System Configuration**: Platform settings and customization
- **Data Analytics**: Comprehensive reporting and insights
- **Security Management**: Monitor and maintain system security

## 🚀 Development Environment

### Prerequisites

- Node.js v18+
- MySQL database (local or remote)
- npm package manager

### Quick Start

```bash
# Clone repository
git clone [repository-url]
cd upqroo-bolsa-empleo

# Install dependencies
npm install

# Setup environment variables
cp .example.env .env
# Configure your .env file with actual values

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:reset` - Reset database (caution: deletes data)

## 🌐 API Architecture

### RESTful Design

- **Organized by Role**: `/api/[role]/[resource]`
- **HTTP Methods**: Standard CRUD operations (GET, POST, PUT, DELETE)
- **Dynamic Routes**: Square bracket notation for parameters
- **Documentation**: TO DO

### Example API Endpoints

```
/api/client/vacantes          # Job listings for students
/api/empresa/vacantes         # Company job management
/api/coordinador/companies    # Company approval management
/api/admin/users             # User management
```

## 📈 Future Roadmap

### Planned Enhancements

- **Mobile Application**: Native mobile app development
- **Advanced Analytics**: Enhanced reporting and insights
- **Integration APIs**: Third-party service integrations
- **AI-Powered Matching**: Intelligent job-candidate matching
- **Multi-language Support**: Internationalization capabilities

## 🤝 Contributing

This project follows standard development practices:

- **Code Style**: TypeScript with ESLint configuration
- **Git Workflow**: Feature branches with pull requests
- **Testing**: Comprehensive testing strategy
- **Documentation**: Maintained technical documentation

## 📞 Support & Contact

For technical support, feature requests, or general inquiries about the UPQROO Bolsa de Trabajo platform, please contact the development team or university administration.

---

_This documentation serves as a comprehensive overview of the UPQROO Bolsa de Trabajo Universitaria platform. For detailed technical documentation, API references, and specific feature guides, please refer to the additional documentation files in this wiki._
