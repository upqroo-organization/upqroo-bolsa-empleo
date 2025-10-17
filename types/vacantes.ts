export interface VacanteInterface {
  id: string
  title: string
  summary: string
  career: string
  description: string
  responsibilities: string
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  department: string | null // e.g., Engineering, Marketing, Sales
  type: string | null // e.g., Full-time, Part-time, Internship
  modality: string | null // e.g., Remote, On-site, Hybrid
  numberOfPositions: number | null // Number of positions available
  companyId: string
  isMock: boolean
  applicationProcess: string | null
  deadline: string | null // o Date si la parseas
  imageUrl: string | null // URL to the job offer image
  createdAt: string // o Date si la parseas
  updatedAt: string // o Date si la parseas
  state: {
    id: string | number,
    name: string | null
  } | null,
  company: {
    name: string
    logoUrl: string | null
  }
}

export enum VacanteTypeEnum {
  fullTime = "Tiempo completo",
  partTime = "Tiempo parcial",
  intership = "Becario"
}

export enum VacanteModalityEnum {
  remote = "Remoto",
  onSite = "Presencial",
  Hybrid = "Híbrido"
}

export enum VacanteDepartamentEnum {
  engineer = "Ingenieria",
  sales = "Ventas",
  customerService = "Servicio al cliente",
}

export enum Careers {
  todos = "Sin especificar",
  software = "Licenciatura en Ingeniería en Software",
  tics = "Licenciatura en Ingeniería en Tecnologías de la Información e Innovación Digital",
  biotecnologie = "Licenciatura en Ingeniería en Biotecnología",
  biomedic = "Licenciatura en Ingeniería en Biomédica",
  finance = "Licenciatura en Ingeniería Financiera",
  civil = "Licenciatura en Ingenieria Civil",
  administation = "Licenciatura en Administración y Gestión Empresarial",
  therapy = "Licenciatura en Terapia Física",
}