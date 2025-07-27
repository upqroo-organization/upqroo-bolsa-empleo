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
  software = "Ingeniería en Software",
  tics = "Ingeniería en tecnologías de la información e innovación digital",
  biotecnologie = "Ingeniería en Biotecnología",
  biomedic = "Ingeniería en Biomédica",
  finance = "Ingeniería Financiera",
  civil = "Ingenieria Civil",
  administation = "Licenciatura en Administración",
  therapy = "Licenciatura en Terapia física",
}