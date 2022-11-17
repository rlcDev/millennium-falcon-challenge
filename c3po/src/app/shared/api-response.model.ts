export enum ApiCode {
  OK,KO
}

export interface ApiResponse {
  status: ApiCode;
  value: number;
  message: string;
}
