/**
 * @swagger
 * /api/auth/[...nextauth]:
 *   get:
 *     tags: [Authentication]
 *     summary: NextAuth.js authentication endpoint
 *     description: Handles authentication with Google OAuth and credentials
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Authentication failed
 *   post:
 *     tags: [Authentication]
 *     summary: NextAuth.js authentication endpoint
 *     description: Handles authentication with Google OAuth and credentials
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Authentication failed
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Request password reset
 *     description: Send password reset email to user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid email or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset user password
 *     description: Reset password using token from email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid token or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/vacantes:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job vacancies with filters
 *     description: Retrieve paginated list of job vacancies with optional filters
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by job title (partial match)
 *       - in: query
 *         name: type[]
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [full-time, part-time, internship, contract]
 *         description: Filter by job type
 *       - in: query
 *         name: modality[]
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [remote, on-site, hybrid]
 *         description: Filter by work modality
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: career
 *         schema:
 *           type: string
 *         description: Filter by career
 *       - in: query
 *         name: state
 *         schema:
 *           type: integer
 *         description: Filter by state ID
 *       - in: query
 *         name: isMock
 *         schema:
 *           type: boolean
 *         description: Filter mock jobs
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of job vacancies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of vacancies
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Vacante'
 *                       - type: object
 *                         properties:
 *                           company:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               logoUrl:
 *                                 type: string
 *                           state:
 *                             $ref: '#/components/schemas/State'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Jobs]
 *     summary: Create new job vacancy
 *     description: Create a new job vacancy (admin/coordinator only)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - description
 *               - responsibilities
 *               - companyId
 *               - state
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *               summary:
 *                 type: string
 *                 description: Brief job summary
 *               description:
 *                 type: string
 *                 description: Detailed job description
 *               responsibilities:
 *                 type: string
 *                 description: Job responsibilities
 *               requirements:
 *                 type: string
 *                 description: Job requirements
 *               benefits:
 *                 type: string
 *                 description: Job benefits
 *               location:
 *                 type: string
 *                 description: Job location
 *               salaryMin:
 *                 type: integer
 *                 description: Minimum salary
 *               salaryMax:
 *                 type: integer
 *                 description: Maximum salary
 *               career:
 *                 type: string
 *                 description: Target career
 *               department:
 *                 type: string
 *                 description: Department
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, internship, contract]
 *                 description: Job type
 *               modality:
 *                 type: string
 *                 enum: [remote, on-site, hybrid]
 *                 description: Work modality
 *               numberOfPositions:
 *                 type: integer
 *                 description: Number of available positions
 *               companyId:
 *                 type: string
 *                 description: Company ID
 *               isMock:
 *                 type: boolean
 *                 description: Is this a mock job
 *               applicationProcess:
 *                 type: string
 *                 description: Application process description
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Application deadline
 *               state:
 *                 type: integer
 *                 description: State ID
 *     responses:
 *       201:
 *         description: Job vacancy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Vacante'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/vacantes/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job vacancy by ID
 *     description: Retrieve detailed information about a specific job vacancy
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job vacancy ID
 *     responses:
 *       200:
 *         description: Job vacancy details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Vacante'
 *                 - type: object
 *                   properties:
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *                     state:
 *                       $ref: '#/components/schemas/State'
 *       404:
 *         description: Job vacancy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Jobs]
 *     summary: Update job vacancy
 *     description: Update an existing job vacancy (company owner or admin only)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job vacancy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vacante'
 *     responses:
 *       200:
 *         description: Job vacancy updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Job vacancy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete job vacancy
 *     description: Delete a job vacancy (company owner or admin only)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job vacancy ID
 *     responses:
 *       200:
 *         description: Job vacancy deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Job vacancy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/applications:
 *   get:
 *     tags: [Applications]
 *     summary: Get user applications or check application status
 *     description: Get all applications for authenticated user or check if user applied to specific job
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: vacanteId
 *         schema:
 *           type: string
 *         description: Job vacancy ID to check application status
 *     responses:
 *       200:
 *         description: Applications list or application status
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     data:
 *                       type: object
 *                       properties:
 *                         hasApplied:
 *                           type: boolean
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     data:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Application'
 *                           - type: object
 *                             properties:
 *                               vacante:
 *                                 allOf:
 *                                   - $ref: '#/components/schemas/Vacante'
 *                                   - type: object
 *                                     properties:
 *                                       company:
 *                                         type: object
 *                                         properties:
 *                                           name:
 *                                             type: string
 *                                           logoUrl:
 *                                             type: string
 *                                       state:
 *                                         $ref: '#/components/schemas/State'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Applications]
 *     summary: Apply to job vacancy
 *     description: Submit application to a job vacancy
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vacanteId
 *             properties:
 *               vacanteId:
 *                 type: string
 *                 description: Job vacancy ID to apply to
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Application'
 *                         - type: object
 *                           properties:
 *                             user:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 email:
 *                                   type: string
 *                                 cvUrl:
 *                                   type: string
 *                             vacante:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 title:
 *                                   type: string
 *                                 company:
 *                                   type: object
 *                                   properties:
 *                                     name:
 *                                       type: string
 *       400:
 *         description: Invalid request or already applied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Job vacancy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/company/register:
 *   post:
 *     tags: [Companies]
 *     summary: Register new company
 *     description: Register a new company account with optional fiscal document upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - state
 *               - size
 *               - companyType
 *             properties:
 *               name:
 *                 type: string
 *                 description: Company name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Company email
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Company password
 *               state:
 *                 type: string
 *                 description: State ID
 *               phone:
 *                 type: string
 *                 description: Company phone number
 *               rfc:
 *                 type: string
 *                 description: Company RFC (tax ID)
 *               sector:
 *                 type: string
 *                 description: Company industry sector
 *               size:
 *                 type: string
 *                 enum: ['1-10', '11-50', '51-200', '201-500', '500+']
 *                 description: Company size
 *               website:
 *                 type: string
 *                 description: Company website URL
 *               direccion:
 *                 type: string
 *                 description: Company address
 *               description:
 *                 type: string
 *                 description: Company description
 *               contactName:
 *                 type: string
 *                 description: Contact person name
 *               contactPosition:
 *                 type: string
 *                 description: Contact person position
 *               companyType:
 *                 type: string
 *                 description: Type of company (legal structure)
 *               fiscalDocument:
 *                 type: string
 *                 format: binary
 *                 description: Fiscal document file (PDF, JPG, PNG, WEBP, max 10MB)
 *     responses:
 *       200:
 *         description: Company registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     company:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         isApprove:
 *                           type: boolean
 *                         fiscalDocumentUploaded:
 *                           type: boolean
 *       400:
 *         description: Invalid data or company already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/company/me:
 *   get:
 *     tags: [Companies]
 *     summary: Get company profile
 *     description: Get authenticated company's profile information
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Company profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Companies]
 *     summary: Update company profile
 *     description: Update authenticated company's profile information
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/empresa/vacantes:
 *   get:
 *     tags: [Companies]
 *     summary: Get company's job vacancies
 *     description: Get all job vacancies posted by the authenticated company
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, expired]
 *         description: Filter by job status
 *     responses:
 *       200:
 *         description: Company's job vacancies
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Vacante'
 *                           - type: object
 *                             properties:
 *                               applications:
 *                                 type: array
 *                                 items:
 *                                   allOf:
 *                                     - $ref: '#/components/schemas/Application'
 *                                     - type: object
 *                                       properties:
 *                                         user:
 *                                           type: object
 *                                           properties:
 *                                             id:
 *                                               type: string
 *                                             name:
 *                                               type: string
 *                                             email:
 *                                               type: string
 *                                             cvUrl:
 *                                               type: string
 *                               state:
 *                                 $ref: '#/components/schemas/State'
 *                               applicationsCount:
 *                                 type: integer
 *                               status:
 *                                 type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Companies]
 *     summary: Create job vacancy
 *     description: Create a new job vacancy for the authenticated company
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               description:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               requirements:
 *                 type: string
 *               benefits:
 *                 type: string
 *               location:
 *                 type: string
 *               salaryMin:
 *                 type: integer
 *               salaryMax:
 *                 type: integer
 *               career:
 *                 type: string
 *               department:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, internship, contract]
 *               modality:
 *                 type: string
 *                 enum: [remote, on-site, hybrid]
 *               numberOfPositions:
 *                 type: integer
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               applicationProcess:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job vacancy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Vacante'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/coordinador/companies:
 *   get:
 *     tags: [Coordinators]
 *     summary: Get companies for coordinator review
 *     description: Get list of companies with filtering options (coordinator only)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, approved, rejected]
 *         description: Filter by approval status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for company name, industry, description, or email
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         description: Filter by industry sector
 *     responses:
 *       200:
 *         description: Companies list with statistics
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         companies:
 *                           type: array
 *                           items:
 *                             allOf:
 *                               - $ref: '#/components/schemas/Company'
 *                               - type: object
 *                                 properties:
 *                                   state:
 *                                     $ref: '#/components/schemas/State'
 *                                   vacantes:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: string
 *                                         title:
 *                                           type: string
 *                                         createdAt:
 *                                           type: string
 *                                           format: date-time
 *                         statistics:
 *                           type: object
 *                           properties:
 *                             pending:
 *                               type: integer
 *                             approved:
 *                               type: integer
 *                             rejected:
 *                               type: integer
 *                             total:
 *                               type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/uploads/cvs/{filename}:
 *   get:
 *     tags: [Uploads]
 *     summary: Download CV file
 *     description: Download CV file with proper authorization checks
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: CV filename (format: cv_userId_timestamp.pdf)
 *     responses:
 *       200:
 *         description: CV file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             description: Inline display with filename
 *           Cache-Control:
 *             schema:
 *               type: string
 *             description: Private, no-cache headers
 *       400:
 *         description: Invalid filename format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - No permission to access this file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Get list of all users (admin/coordinator only)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Users]
 *     summary: Create new user
 *     description: Create a new user account (admin only)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/usuarios/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     description: Get authenticated user's profile information
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     description: Update authenticated user's profile information
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/states:
 *   get:
 *     tags: [Utilities]
 *     summary: Get all states
 *     description: Get list of all Mexican states
 *     responses:
 *       200:
 *         description: List of states
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/State'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Utilities]
 *     summary: Health check
 *     description: Check API health status
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
/**

 * @swagger
 * /api/empresa/dashboard:
 *   get:
 *     tags: [Companies]
 *     summary: Get company dashboard data
 *     description: Get dashboard statistics and data for authenticated company
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Company dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVacantes:
 *                   type: integer
 *                   description: Total number of job postings
 *                 activeVacantes:
 *                   type: integer
 *                   description: Number of active job postings
 *                 totalApplications:
 *                   type: integer
 *                   description: Total applications received
 *                 pendingApplications:
 *                   type: integer
 *                   description: Pending applications count
 *                 recentApplications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *                   description: Recent applications
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/empresa/applications/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Get application details
 *     description: Get detailed information about a specific application
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Application'
 *                 - type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     vacante:
 *                       $ref: '#/components/schemas/Vacante'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Companies]
 *     summary: Update application status
 *     description: Update the status of a job application
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, accepted, rejected]
 *                 description: New application status
 *               notes:
 *                 type: string
 *                 description: Optional notes about the decision
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/coordinador/companies/{id}:
 *   get:
 *     tags: [Coordinators]
 *     summary: Get company details
 *     description: Get detailed information about a specific company (coordinator only)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Company'
 *                 - type: object
 *                   properties:
 *                     state:
 *                       $ref: '#/components/schemas/State'
 *                     vacantes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vacante'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Coordinators]
 *     summary: Update company approval status
 *     description: Approve or reject a company registration (coordinator only)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approvalStatus
 *             properties:
 *               approvalStatus:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: New approval status
 *               rejectionReason:
 *                 type: string
 *                 description: Reason for rejection (required if status is rejected)
 *     responses:
 *       200:
 *         description: Company status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/coordinador/surveys:
 *   get:
 *     tags: [Surveys]
 *     summary: Get all surveys
 *     description: Get list of all surveys (coordinator only)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of surveys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Survey'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Surveys]
 *     summary: Create new survey
 *     description: Create a new performance evaluation survey (coordinator only)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Survey title
 *               description:
 *                 type: string
 *                 description: Survey description
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     question:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [text, number, rating, multiple-choice, yes-no]
 *                     required:
 *                       type: boolean
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                 description: Survey questions
 *               isActive:
 *                 type: boolean
 *                 description: Whether the survey is active
 *     responses:
 *       201:
 *         description: Survey created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Survey'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/coordinador/surveys/{id}:
 *   get:
 *     tags: [Surveys]
 *     summary: Get survey details
 *     description: Get detailed information about a specific survey (coordinator only)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey ID
 *     responses:
 *       200:
 *         description: Survey details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Survey'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Survey not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Surveys]
 *     summary: Update survey
 *     description: Update an existing survey (coordinator only)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       200:
 *         description: Survey updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Survey not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Surveys]
 *     summary: Delete survey
 *     description: Delete a survey (coordinator only)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey ID
 *     responses:
 *       200:
 *         description: Survey deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Survey not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/empresa/surveys:
 *   get:
 *     tags: [Surveys]
 *     summary: Get available surveys for company
 *     description: Get list of surveys available for the authenticated company to complete
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of available surveys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Survey'
 *                   - type: object
 *                     properties:
 *                       isCompleted:
 *                         type: boolean
 *                         description: Whether the company has completed this survey
 *                       studentName:
 *                         type: string
 *                         description: Name of the student being evaluated
 *                       applicationId:
 *                         type: string
 *                         description: Related application ID
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/empresa/surveys/{id}:
 *   post:
 *     tags: [Surveys]
 *     summary: Submit survey response
 *     description: Submit responses to a survey for a hired student
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - responses
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: ID of the application/student being evaluated
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       description: Question ID
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       description: Answer to the question
 *                 description: Survey responses
 *     responses:
 *       200:
 *         description: Survey response submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid survey data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Survey not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/uploads/logos:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload company logo
 *     description: Upload a logo image for the authenticated company
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - logo
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Logo image file (JPG, PNG, WEBP, max 5MB)
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         logoUrl:
 *                           type: string
 *                           description: URL of the uploaded logo
 *       400:
 *         description: Invalid file type or size
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/usuarios/me/cv:
 *   post:
 *     tags: [Users]
 *     summary: Upload user CV
 *     description: Upload a CV file for the authenticated user
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cv
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: CV file in PDF format (max 5MB)
 *     responses:
 *       200:
 *         description: CV uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         cvUrl:
 *                           type: string
 *                           description: URL of the uploaded CV
 *       400:
 *         description: Invalid file type or size
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Users]
 *     summary: Delete user CV
 *     description: Delete the CV file for the authenticated user
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: CV deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: CV not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/coordinador/dashboard:
 *   get:
 *     tags: [Coordinators]
 *     summary: Get coordinator dashboard data
 *     description: Get dashboard statistics and data for coordinators
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Coordinator dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCompanies:
 *                   type: integer
 *                   description: Total number of registered companies
 *                 pendingCompanies:
 *                   type: integer
 *                   description: Companies pending approval
 *                 approvedCompanies:
 *                   type: integer
 *                   description: Approved companies
 *                 totalVacantes:
 *                   type: integer
 *                   description: Total job postings
 *                 activeVacantes:
 *                   type: integer
 *                   description: Active job postings
 *                 totalApplications:
 *                   type: integer
 *                   description: Total applications
 *                 totalStudents:
 *                   type: integer
 *                   description: Total registered students
 *                 recentCompanies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *                   description: Recently registered companies
 *                 recentApplications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *                   description: Recent applications
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/client/dashboard:
 *   get:
 *     tags: [Users]
 *     summary: Get client dashboard data
 *     description: Get dashboard data for authenticated student/external user
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Client dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalApplications:
 *                   type: integer
 *                   description: Total applications submitted
 *                 pendingApplications:
 *                   type: integer
 *                   description: Pending applications
 *                 acceptedApplications:
 *                   type: integer
 *                   description: Accepted applications
 *                 rejectedApplications:
 *                   type: integer
 *                   description: Rejected applications
 *                 recentApplications:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Application'
 *                       - type: object
 *                         properties:
 *                           vacante:
 *                             allOf:
 *                               - $ref: '#/components/schemas/Vacante'
 *                               - type: object
 *                                 properties:
 *                                   company:
 *                                     type: object
 *                                     properties:
 *                                       name:
 *                                         type: string
 *                                       logoUrl:
 *                                         type: string
 *                   description: Recent applications
 *                 recommendedJobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vacante'
 *                   description: Recommended job postings
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/mail:
 *   post:
 *     tags: [Utilities]
 *     summary: Send email
 *     description: Send email notification (admin/coordinator only)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - html
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               html:
 *                 type: string
 *                 description: Email HTML content
 *               from:
 *                 type: string
 *                 format: email
 *                 description: Sender email (optional)
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid email data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */