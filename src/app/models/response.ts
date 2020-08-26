export interface Response {
  success: boolean;
  message: string;
  data?: any;
  total?: number;
  pageSize?: number;
  page?: number;
}
