import { PageEvent } from '@angular/material/paginator';

export abstract class Controller {

  constructor() { }

  /**
   * String listo of columns to display in mat-table.
   */
  public displayedColumns: string[];

  /**
   * Numbers of rows per page show on page size select at the bottom of mat-table.
  */
  public pageSizeOptions: number[] = [5, 10, 20, 40, 100];

  /**
   * Save the selected value of the pageSizeOptions.
   */
  public pageSize: number;

  /**
   * Contains the fetched data, used to fill mat-table.
   */
  public dataSource: any;

  public pageEvent: PageEvent;

  public resultsLength: number;

  /**
   * Current page number
   */
  public page: number;

  /**
   * Is mat-table loading the data?
   */
  public isLoading: boolean;

  public isTotalReached: boolean;

  public totalItems: number;

  public search: string;

  /**
   * Get paginated data from api for mat-table
   */
  abstract getData(): void;

  abstract edit(data: any): void;

  abstract save(): void;

  abstract delete(data: any): void;

  abstract onPaginateChange(event: any): void;

  abstract applyFilter(filterValue: string): void;

}
