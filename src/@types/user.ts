export type UserRole = 'STUDENT' | 'CONTENT_CREATOR' | 'ADMIN';

export type User = {
  username: string;
  name?: string;
  role: UserRole;
  email: string;
  avatar?: string;
  background?: string;
  level?: number;
  xp?: number;
  maxXp?: number;
  soundEnabled?: boolean;
  requiresPasswordReset?: boolean;
  requiresProfileSetup?: boolean; 
  isActive?: boolean;
  lastLoginAt?: string;
};
