export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  cvUrl: string | null;
  role: UserRole | null;
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
}

export interface CVUploadResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface CVErrorResponse {
  error: string;
}