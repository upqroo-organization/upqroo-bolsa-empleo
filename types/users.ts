export interface UserRole {
  id: string;
  name: string;
}

export interface UserJobExperience {
  id: string;
  title: string;
  description: string;
  initialDate: string;
  endDate: string;
  companyName: string;
  jobRole: string;
}

export interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  cvUrl: string | null;
  career: string | null;
  period: number | null;
  role: UserRole | null;
  jobExperience?: UserJobExperience[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface UserErrorResponse {
  error: string;
}

export interface UpdateUserData {
  name: string;
  username: string;
  career?: string | null;
  period?: number | null;
  jobExperience?: Array<{
    id?: string;
    title: string;
    description: string;
    initialDate: string;
    endDate: string;
    companyName: string;
    jobRole: string;
  }>;
}

export interface CVUploadResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface CVErrorResponse {
  error: string;
}