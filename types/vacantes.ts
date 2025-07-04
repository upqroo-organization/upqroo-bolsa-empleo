export interface VacanteInterface {
  id: string
  title: string
  summary: string
  description: string
  responsibilities: string
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  department: string | null
  type: string | null
  modality: string | null
  experienceLevel: string | null
  numberOfPositions: number | null
  companyId: string
  isMock: boolean
  applicationProcess: string | null
  deadline: string | null // o Date si la parseas
  createdAt: string // o Date si la parseas
  updatedAt: string // o Date si la parseas
  company: {
    name: string
    logoUrl: string | null
  }
}
