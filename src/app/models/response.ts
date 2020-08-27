export interface Response {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  total?: number;
  pageSize?: number;
  page?: number;
}
