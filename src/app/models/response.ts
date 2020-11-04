export interface Response {

  /**
   * Params that all response contains.
   */

  success: boolean;

  message: string;

  /**
   * Use when you're fetching data from API.
   */

  data?: any;

  /**
   * Session params, only used when you're loging
   */

  token?: string;

  /**
   * Required by Mat-Table.
   * This is paginated response, yo can change the number of pages, the sort direction or add
   * search param on the request.
   */

  // Total of rows
  total?: number;

  // Total of rows on this page.
  pageSize?: number;

  // Current page.
  page?: number;

}
