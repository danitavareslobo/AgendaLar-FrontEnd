export interface DefaultListResponse<T> {
    success: boolean;
    result: T[];
}

export interface DefaultResponse<T> {
  success: boolean;
  result: T;
}
