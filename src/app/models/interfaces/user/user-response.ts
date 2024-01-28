export interface UserResponse {
  success: boolean;
  result: Result;
}

export interface Result {
  accessToken: string;
  expiresIn: string;
  userToken: UserToken;
}

export interface UserToken {
  id: string;
  email: string;
  claims: Claim[];
}

export interface Claim {
  value: string;
  type: string;
}
