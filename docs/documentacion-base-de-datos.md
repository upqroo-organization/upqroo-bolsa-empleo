# Documentación de Base de Datos - UPQROO Bolsa de Trabajo Universitaria

## Tabla de Contenidos

1. [Información General](#información-general)
2. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Modelos de Datos](#modelos-de-datos)
5. [Relaciones entre Modelos](#relaciones-entre-modelos)
6. [Índices y Optimizaciones](#índices-y-optimizaciones)
7. [Restricciones y Validaciones](#restricciones-y-validaciones)
8. [Migraciones](#migraciones)
9. [Consultas Comunes](#consultas-comunes)
10. [Consideraciones de Rendimiento](#consideraciones-de-rendimiento)

---

## Información General

### Tecnologías Utilizadas
- **ORM**: Prisma 6
- **Base de Datos**: MySQL
- **Lenguaje**: TypeScript
- **Arquitectura**: Esquemas divididos por dominio

### Características Principales
- **Esquemas modulares**: Modelos organizados en archivos separados
- **Relaciones complejas**: Sistema de roles, aplicaciones y encuestas
- **Autenticación integrada**: Soporte para NextAuth.js
- **Auditoría**: Campos de creación y actualización automáticos
- **Integridad referencial**: Restricciones de clave foránea y cascadas

---

## Configuración de la Base de Datos

### Datasource
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Generator
```prisma
generator client {
  provider = "prisma-client-js"
}
```

### Variables de Entorno Requeridas
- `DATABASE_URL`: Cadena de conexión a MySQL

---

## Arquitectura del Sistema

### Dominios Principales

1. **Autenticación y Usuarios**
   - Gestión de usuarios y roles
   - Autenticación con NextAuth.js
   - Soporte para WebAuthn

2. **Gestión Empresarial**
   - Registro y validación de empresas
   - Información corporativa y fiscal

3. **Gestión de Vacantes**
   - Publicación de ofertas laborales
   - Aplicaciones y seguimiento

4. **Sistema de Encuestas**
   - Evaluación de empleabilidad
   - Seguimiento post-contratación

5. **Eventos y Ubicaciones**
   - Gestión de eventos corporativos
   - Información geográfica

---

## Modelos de Datos

### 1. User (Usuarios)

**Descripción**: Modelo principal para estudiantes, egresados y usuarios externos.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `name` | String? | Nombre completo | Opcional |
| `username` | String? | Nombre de usuario | Único, Opcional |
| `email` | String? | Correo electrónico | Único, Opcional |
| `emailVerified` | DateTime? | Fecha de verificación de email | Opcional |
| `image` | String? | URL de imagen de perfil | Opcional |
| `cvUrl` | String? | URL del CV en PDF | Opcional |
| `career` | String? | Carrera académica | Opcional |
| `period` | Int? | Período/semestre actual | Opcional |
| `roleId` | String? | ID del rol asignado | FK a role |
| `createdAt` | DateTime | Fecha de creación | Auto |
| `updatedAt` | DateTime | Fecha de actualización | Auto |

**Relaciones**:
- `role`: Muchos a uno con `role`
- `accounts`: Uno a muchos con `Account`
- `sessions`: Uno a muchos con `Session`
- `vacantes`: Muchos a muchos con `Vacante` (aplicaciones)
- `applications`: Uno a muchos con `Application`
- `surveyResponses`: Uno a muchos con `SurveyResponse`
- `jobExperience`: Uno a muchos con `UserJobExperience`
- `Authenticator`: Uno a muchos con `Authenticator`

### 2. UserJobExperience (Experiencia Laboral)

**Descripción**: Historial laboral de los usuarios.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `userId` | String | ID del usuario | FK a User |
| `title` | String | Título del puesto | Requerido |
| `description` | String | Descripción del trabajo | Requerido |
| `initialDate` | DateTime | Fecha de inicio | Requerido |
| `endDate` | DateTime | Fecha de fin | Requerido |
| `companyName` | String | Nombre de la empresa | Requerido |
| `jobRole` | String | Rol desempeñado | Requerido |

### 3. Account (Cuentas de Autenticación)

**Descripción**: Cuentas de proveedores de autenticación (NextAuth.js).

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `userId` | String | ID del usuario | FK a User, Único |
| `type` | String | Tipo de cuenta | Requerido |
| `provider` | String | Proveedor (Google, etc.) | Requerido |
| `providerAccountId` | String | ID en el proveedor | Requerido |
| `refresh_token` | String? | Token de actualización | TEXT, Opcional |
| `access_token` | String? | Token de acceso | TEXT, Opcional |
| `expires_at` | Int? | Expiración del token | Opcional |
| `token_type` | String? | Tipo de token | Opcional |
| `scope` | String? | Alcance del token | Opcional |
| `id_token` | String? | Token de identidad | TEXT, Opcional |
| `session_state` | String? | Estado de sesión | Opcional |
| `refresh_token_expires_in` | Int? | Expiración del refresh token | Opcional |

**Índices**:
- Único: `[provider, providerAccountId]`
- Índice: `[userId]`

### 4. Session (Sesiones)

**Descripción**: Sesiones activas de usuarios.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `sessionToken` | String | Token de sesión | Único |
| `userId` | String | ID del usuario | FK a User |
| `expires` | DateTime | Fecha de expiración | Requerido |

### 5. role (Roles)

**Descripción**: Roles del sistema (estudiante, empresa, coordinador, admin).

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `name` | String | Nombre del rol | Único |

**Relaciones**:
- `users`: Uno a muchos con `User`
- `company`: Uno a muchos con `company`

### 6. company (Empresas)

**Descripción**: Información de empresas registradas en la plataforma.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `name` | String | Razón social | Requerido |
| `email` | String | Email corporativo | Único |
| `password` | String | Contraseña (hash) | Requerido |
| `description` | String? | Descripción de la empresa | Opcional |
| `logoUrl` | String? | URL del logo | Opcional |
| `websiteUrl` | String? | Sitio web corporativo | Opcional |
| `rfc` | String? | RFC fiscal | Único, Opcional |
| `roleId` | String | ID del rol | FK a role |
| `city` | String? | Ciudad | Opcional |
| `country` | String? | País | Opcional |
| `address` | String? | Dirección | Opcional |
| `zipCode` | String? | Código postal | Opcional |
| `phone` | String? | Teléfono | Opcional |
| `fundationDate` | DateTime? | Fecha de fundación | Opcional |
| `industry` | String? | Sector industrial | Opcional |
| `organizationCulture` | String? | Cultura organizacional | Opcional |
| `size` | String? | Tamaño de empresa | Opcional |
| `isApprove` | Boolean | Estado de aprobación | Default: false |
| `approvalStatus` | String | Estado de validación | Default: "pending" |
| `contactName` | String? | Nombre del contacto | Opcional |
| `contactEmail` | String? | Email del contacto | Opcional |
| `contactPhone` | String? | Teléfono del contacto | Opcional |
| `contactPosition` | String? | Posición del contacto | Opcional |
| `companyRole` | String? | Rol en la empresa | Opcional |
| `companyType` | String? | Tipo de empresa | Opcional |
| `fiscalDocumentUrl` | String? | URL documento fiscal | Opcional |
| `stateId` | Int? | ID del estado | FK a State |

**Relaciones**:
- `role`: Muchos a uno con `role`
- `state`: Muchos a uno con `State`
- `vacantes`: Uno a muchos con `Vacante`
- `surveyResponses`: Uno a muchos con `SurveyResponse`
- `events`: Uno a muchos con `Event`

### 7. Vacante (Ofertas Laborales)

**Descripción**: Vacantes publicadas por las empresas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `title` | String | Título del puesto | Requerido |
| `summary` | String | Resumen de la vacante | TEXT |
| `description` | String | Descripción detallada | TEXT |
| `responsibilities` | String | Responsabilidades | TEXT |
| `location` | String? | Ubicación del trabajo | Opcional |
| `salaryMin` | Int? | Salario mínimo | Opcional |
| `salaryMax` | Int? | Salario máximo | Opcional |
| `career` | String? | Carrera específica | Opcional |
| `department` | String? | Departamento | Opcional |
| `type` | String? | Tipo de empleo | Opcional |
| `modality` | String? | Modalidad de trabajo | Opcional |
| `numberOfPositions` | Int? | Número de posiciones | Opcional |
| `companyId` | String | ID de la empresa | FK a company |
| `isMock` | Boolean | Es vacante de prueba | Default: false |
| `stateId` | Int? | ID del estado | FK a State |
| `applicationProcess` | String? | Proceso de aplicación | TEXT, Opcional |
| `deadline` | DateTime? | Fecha límite | Opcional |
| `originalDeadline` | DateTime? | Fecha límite original | Opcional |
| `status` | String | Estado de la vacante | Default: "active" |
| `requirements` | String? | Requisitos del puesto | TEXT, Opcional |
| `benefits` | String? | Beneficios ofrecidos | TEXT, Opcional |
| `imageUrl` | String? | URL de imagen | Opcional |

**Relaciones**:
- `company`: Muchos a uno con `company`
- `state`: Muchos a uno con `State`
- `aplicants`: Muchos a muchos con `User`
- `applications`: Uno a muchos con `Application`

### 8. Application (Aplicaciones)

**Descripción**: Aplicaciones de usuarios a vacantes específicas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `userId` | String | ID del usuario | FK a User |
| `vacanteId` | String | ID de la vacante | FK a Vacante |
| `status` | String | Estado de la aplicación | Default: "pending" |
| `appliedAt` | DateTime | Fecha de aplicación | Default: now() |
| `cvViewed` | Boolean | CV visto por empresa | Default: false |
| `hiredAt` | DateTime? | Fecha de contratación | Opcional |

**Restricciones**:
- Único: `[userId, vacanteId]` (previene aplicaciones duplicadas)

**Índices**:
- `[userId]`
- `[vacanteId]`

### 9. Survey (Encuestas)

**Descripción**: Encuestas de evaluación de empleabilidad.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `title` | String | Título de la encuesta | VARCHAR(200) |
| `description` | String? | Descripción | TEXT, Opcional |
| `isActive` | Boolean | Estado activo | Default: true |
| `daysAfterHiring` | Int | Días después de contratación | Default: 30 |
| `surveyDuration` | Int | Duración disponible (días) | Default: 30 |

**Relaciones**:
- `questions`: Uno a muchos con `SurveyQuestion`
- `responses`: Uno a muchos con `SurveyResponse`

### 10. SurveyQuestion (Preguntas de Encuesta)

**Descripción**: Preguntas individuales de las encuestas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `surveyId` | String | ID de la encuesta | FK a Survey |
| `question` | String | Texto de la pregunta | TEXT |
| `order` | Int | Orden en la encuesta | Requerido |
| `isRequired` | Boolean | Pregunta obligatoria | Default: true |

**Relaciones**:
- `survey`: Muchos a uno con `Survey`
- `answers`: Uno a muchos con `SurveyAnswer`

**Índices**:
- `[surveyId]`

### 11. SurveyResponse (Respuestas de Encuesta)

**Descripción**: Respuestas completas a encuestas por empresa sobre estudiantes.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `surveyId` | String | ID de la encuesta | FK a Survey |
| `companyId` | String | ID de la empresa | FK a company |
| `studentId` | String | ID del estudiante evaluado | FK a User |
| `isCompleted` | Boolean | Encuesta completada | Default: false |
| `comments` | String? | Comentarios adicionales | TEXT, Opcional |

**Restricciones**:
- Único: `[surveyId, companyId, studentId]` (una respuesta por combinación)

**Índices**:
- `[surveyId]`
- `[companyId]`
- `[studentId]`

**Relaciones**:
- `survey`: Muchos a uno con `Survey`
- `company`: Muchos a uno con `company`
- `student`: Muchos a uno con `User`
- `answers`: Uno a muchos con `SurveyAnswer`

### 12. SurveyAnswer (Respuestas Individuales)

**Descripción**: Respuestas individuales a preguntas específicas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `responseId` | String | ID de la respuesta | FK a SurveyResponse |
| `questionId` | String | ID de la pregunta | FK a SurveyQuestion |
| `rating` | Int | Calificación (0-5) | Requerido |

**Sistema de Calificación**:
- `5`: Muy Bien
- `4`: Bien
- `3`: Regular
- `2`: Mal
- `1`: Pésimo
- `0`: No aplica

**Restricciones**:
- Único: `[responseId, questionId]` (una respuesta por pregunta)

**Índices**:
- `[responseId]`
- `[questionId]`

### 13. Event (Eventos)

**Descripción**: Eventos corporativos, ferias de empleo, talleres, etc.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `title` | String | Título del evento | Requerido |
| `description` | String | Descripción detallada | TEXT |
| `imageUrl` | String? | URL de imagen | Opcional |
| `eventType` | String | Tipo de evento | Requerido |
| `startDate` | DateTime | Fecha de inicio | Requerido |
| `endDate` | DateTime? | Fecha de fin | Opcional |
| `location` | String? | Ubicación física | Opcional |
| `isOnline` | Boolean | Es evento en línea | Default: false |
| `maxAttendees` | Int? | Máximo de asistentes | Opcional |
| `registrationUrl` | String? | URL de registro | Opcional |
| `isActive` | Boolean | Estado activo | Default: true |
| `companyId` | String | ID de la empresa | FK a company |
| `stateId` | Int? | ID del estado | FK a State |

**Tipos de Eventos**:
- `bootcamp`: Bootcamp
- `job_fair`: Feria de empleo
- `course`: Curso
- `workshop`: Taller

**Índices**:
- `[companyId]`
- `[startDate]`
- `[eventType]`

### 14. State (Estados/Ubicaciones)

**Descripción**: Catálogo de estados para ubicaciones geográficas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | Int | Identificador único | PK, Auto-increment |
| `name` | String | Nombre del estado | Requerido |

**Relaciones**:
- `companies`: Uno a muchos con `company`
- `vacante`: Uno a muchos con `Vacante`
- `events`: Uno a muchos con `Event`

### 15. PasswordResetToken (Tokens de Restablecimiento)

**Descripción**: Tokens para restablecimiento de contraseñas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String | Identificador único | PK, CUID |
| `token` | String | Token único | Único |
| `email` | String | Email del usuario | Requerido |
| `expiresAt` | DateTime | Fecha de expiración | Requerido |
| `used` | Boolean | Token utilizado | Default: false |
| `createdAt` | DateTime | Fecha de creación | Auto |

### 16. VerificationToken (Tokens de Verificación)

**Descripción**: Tokens para verificación de email (NextAuth.js).

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `identifier` | String | Identificador (email) | Requerido |
| `token` | String | Token de verificación | Requerido |
| `expires` | DateTime | Fecha de expiración | Requerido |

**Restricciones**:
- Único: `[identifier, token]`

### 17. Authenticator (Autenticadores WebAuthn)

**Descripción**: Soporte para autenticación WebAuthn (opcional).

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `credentialID` | String | ID de credencial | Único |
| `userId` | String | ID del usuario | FK a User |
| `providerAccountId` | String | ID de cuenta del proveedor | Requerido |
| `credentialPublicKey` | String | Clave pública | Requerido |
| `counter` | Int | Contador de uso | Requerido |
| `credentialDeviceType` | String | Tipo de dispositivo | Requerido |
| `credentialBackedUp` | Boolean | Respaldado | Requerido |
| `transports` | String? | Transportes soportados | Opcional |

**Clave Primaria Compuesta**: `[userId, credentialID]`

---

## Relaciones entre Modelos

### Diagrama de Relaciones Principales

```
User (1) ←→ (N) Application (N) ←→ (1) Vacante (N) ←→ (1) company
 ↓                                                        ↓
(N) UserJobExperience                                   (N) Event
 ↓                                                        ↓
(N) SurveyResponse ←→ (1) Survey ←→ (N) SurveyQuestion   State
 ↓                     ↓
(N) SurveyAnswer      (1) company
```

### Relaciones Detalladas

#### 1. Usuario - Aplicaciones - Vacantes
- Un **Usuario** puede tener múltiples **Aplicaciones**
- Una **Aplicación** pertenece a un **Usuario** y una **Vacante**
- Una **Vacante** puede tener múltiples **Aplicaciones**
- Restricción única: Un usuario no puede aplicar dos veces a la misma vacante

#### 2. Empresa - Vacantes - Eventos
- Una **Empresa** puede publicar múltiples **Vacantes**
- Una **Empresa** puede organizar múltiples **Eventos**
- Cada **Vacante** y **Evento** pertenece a una **Empresa**

#### 3. Sistema de Encuestas
- Una **Encuesta** tiene múltiples **Preguntas**
- Una **Respuesta de Encuesta** conecta: Encuesta + Empresa + Estudiante
- Cada **Respuesta Individual** conecta: Respuesta de Encuesta + Pregunta + Calificación

#### 4. Autenticación (NextAuth.js)
- Un **Usuario** puede tener múltiples **Cuentas** (Google, etc.)
- Un **Usuario** puede tener múltiples **Sesiones** activas
- Soporte opcional para **WebAuthn** con múltiples autenticadores

#### 5. Ubicaciones Geográficas
- **Estados** se relacionan con **Empresas**, **Vacantes** y **Eventos**
- Permite filtrado y búsqueda geográfica

---

## Índices y Optimizaciones

### Índices Principales

#### User
- `email` (único)
- `username` (único)

#### Account
- `[provider, providerAccountId]` (único)
- `[userId]` (índice)

#### Session
- `sessionToken` (único)
- `[userId]` (índice)

#### Application
- `[userId, vacanteId]` (único - previene duplicados)
- `[userId]` (índice)
- `[vacanteId]` (índice)

#### SurveyResponse
- `[surveyId, companyId, studentId]` (único)
- `[surveyId]` (índice)
- `[companyId]` (índice)
- `[studentId]` (índice)

#### SurveyAnswer
- `[responseId, questionId]` (único)
- `[responseId]` (índice)
- `[questionId]` (índice)

#### SurveyQuestion
- `[surveyId]` (índice)

#### Event
- `[companyId]` (índice)
- `[startDate]` (índice)
- `[eventType]` (índice)

### Optimizaciones de Rendimiento

1. **Índices compuestos** para consultas frecuentes
2. **Campos TEXT** para contenido largo (descripciones, comentarios)
3. **Campos VARCHAR** con límites apropiados
4. **Índices en campos de filtrado** común (fechas, estados, tipos)

---

## Restricciones y Validaciones

### Restricciones de Integridad

#### Unicidad
- `User.email` y `User.username`
- `company.email` y `company.rfc`
- `role.name`
- `[userId, vacanteId]` en Application
- `[surveyId, companyId, studentId]` en SurveyResponse

#### Cascadas de Eliminación
- `Application` → `User` y `Vacante` (CASCADE)
- `SurveyResponse` → `Survey`, `company`, `User` (CASCADE)
- `SurveyAnswer` → `SurveyResponse` y `SurveyQuestion` (CASCADE)
- `Event` → `company` (CASCADE)
- `Authenticator` → `User` (CASCADE)

#### Valores por Defecto
- `Application.status` = "pending"
- `Application.appliedAt` = now()
- `Application.cvViewed` = false
- `company.isApprove` = false
- `company.approvalStatus` = "pending"
- `Vacante.isMock` = false
- `Vacante.status` = "active"
- `Survey.isActive` = true
- `Survey.daysAfterHiring` = 30
- `Survey.surveyDuration` = 30

### Validaciones de Negocio

#### Estados de Application
- `pending`: Aplicación enviada
- `interview`: Seleccionado para entrevista
- `rejected`: Rechazado
- `hired`: Contratado

#### Estados de company.approvalStatus
- `pending`: Pendiente de validación
- `approved`: Empresa aprobada
- `rejected`: Empresa rechazada

#### Estados de Vacante.status
- `active`: Vacante activa
- `paused`: Vacante pausada
- `expired`: Vacante expirada

#### Sistema de Calificación en Encuestas
- Rango: 0-5
- 0: No aplica
- 1: Pésimo
- 2: Mal
- 3: Regular
- 4: Bien
- 5: Muy Bien

---

## Migraciones

### Estructura de Migraciones
Las migraciones se almacenan en `prisma/migrations/` y son generadas automáticamente por Prisma.

### Comandos Principales
```bash
# Generar migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
npx prisma migrate deploy

# Reset de base de datos (desarrollo)
npx prisma migrate reset

# Generar cliente Prisma
npx prisma generate
```

### Consideraciones para Producción
1. **Backup antes de migraciones**
2. **Pruebas en ambiente de staging**
3. **Migraciones incrementales**
4. **Rollback plan**

---

## Consultas Comunes

### Consultas de Usuario

#### Obtener usuario con rol
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { role: true }
})
```

#### Aplicaciones de un usuario
```typescript
const applications = await prisma.application.findMany({
  where: { userId },
  include: {
    vacante: {
      include: { company: true }
    }
  },
  orderBy: { appliedAt: 'desc' }
})
```

### Consultas de Empresa

#### Vacantes de una empresa con aplicaciones
```typescript
const vacantes = await prisma.vacante.findMany({
  where: { companyId },
  include: {
    applications: {
      include: { user: true }
    },
    _count: { select: { applications: true } }
  }
})
```

#### Empresas pendientes de aprobación
```typescript
const pendingCompanies = await prisma.company.findMany({
  where: { approvalStatus: 'pending' },
  orderBy: { createdAt: 'asc' }
})
```

### Consultas de Vacantes

#### Vacantes activas con filtros
```typescript
const vacantes = await prisma.vacante.findMany({
  where: {
    status: 'active',
    deadline: { gte: new Date() },
    career: { contains: career },
    type: type,
    modality: modality
  },
  include: {
    company: true,
    state: true,
    _count: { select: { applications: true } }
  },
  orderBy: { createdAt: 'desc' }
})
```

### Consultas de Encuestas

#### Encuestas disponibles para una empresa
```typescript
const availableSurveys = await prisma.survey.findMany({
  where: {
    isActive: true,
    responses: {
      none: {
        companyId: companyId,
        studentId: studentId
      }
    }
  },
  include: { questions: true }
})
```

#### Estadísticas de respuestas
```typescript
const surveyStats = await prisma.surveyResponse.groupBy({
  by: ['surveyId'],
  _count: { id: true },
  _avg: {
    answers: {
      rating: true
    }
  }
})
```

### Consultas de Estadísticas

#### Colocaciones exitosas por carrera
```typescript
const placements = await prisma.application.findMany({
  where: {
    status: 'hired',
    hiredAt: {
      gte: startDate,
      lte: endDate
    }
  },
  include: {
    user: { select: { career: true } },
    vacante: {
      include: { company: true }
    }
  }
})
```

#### Métricas de empleabilidad
```typescript
const metrics = await prisma.user.findMany({
  where: { career: career },
  include: {
    applications: {
      where: { status: 'hired' }
    },
    _count: {
      select: {
        applications: true
      }
    }
  }
})
```

---

## Consideraciones de Rendimiento

### Optimizaciones Implementadas

#### 1. Índices Estratégicos
- Campos de búsqueda frecuente
- Claves foráneas
- Campos de filtrado

#### 2. Paginación
```typescript
const vacantes = await prisma.vacante.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  where: filters,
  include: relations
})
```

#### 3. Selección de Campos
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    career: true
  }
})
```

#### 4. Agregaciones Eficientes
```typescript
const stats = await prisma.vacante.aggregate({
  _count: { id: true },
  _avg: { salaryMin: true, salaryMax: true },
  where: { status: 'active' }
})
```

### Recomendaciones de Rendimiento

#### 1. Consultas
- Usar `select` para campos específicos
- Implementar paginación en listas grandes
- Evitar N+1 queries con `include` apropiado
- Usar `_count` para conteos sin cargar datos

#### 2. Índices
- Monitorear consultas lentas
- Agregar índices compuestos para filtros complejos
- Revisar planes de ejecución regularmente

#### 3. Conexiones
- Pool de conexiones configurado apropiadamente
- Timeout de conexión adecuado
- Monitoreo de conexiones activas

#### 4. Caché
- Implementar caché para consultas frecuentes
- Caché de resultados de agregaciones
- Invalidación de caché en actualizaciones

---

## Seguridad y Mejores Prácticas

### Seguridad de Datos

#### 1. Autenticación
- Integración con NextAuth.js
- Soporte para múltiples proveedores
- Tokens seguros y expiración

#### 2. Autorización
- Sistema de roles granular
- Validación de permisos en cada operación
- Restricciones a nivel de base de datos

#### 3. Validación de Datos
- Validación en el cliente Prisma
- Restricciones de base de datos
- Sanitización de inputs

### Mejores Prácticas

#### 1. Transacciones
```typescript
await prisma.$transaction(async (tx) => {
  await tx.application.create({ data: applicationData })
  await tx.user.update({
    where: { id: userId },
    data: { updatedAt: new Date() }
  })
})
```

#### 2. Manejo de Errores
```typescript
try {
  const result = await prisma.user.create({ data })
} catch (error) {
  if (error.code === 'P2002') {
    // Violación de restricción única
    throw new Error('Email ya existe')
  }
  throw error
}
```

#### 3. Logging y Monitoreo
- Log de consultas lentas
- Monitoreo de errores
- Métricas de rendimiento
- Auditoría de cambios críticos

---

*Documentación de Base de Datos - UPQROO Bolsa de Trabajo Universitaria*  
*Versión 1.0 - Noviembre 2024*  
*Generada automáticamente desde esquemas Prisma*