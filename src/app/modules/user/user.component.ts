import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Controller } from '../../base/controller';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '~app/models/client';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements AfterViewInit, OnInit, Controller {
  // public dataSource = new MatTableDataSource();

  public displayedColumns: string[];
  public pageSizeOptions: number[];
  public pageSize: number;
  public dataSource = new MatTableDataSource();
  public pageEvent: PageEvent;
  public resultsLength: number;
  public page: number;
  public isLoading: boolean;
  public isTotalReached: boolean;
  public totalItems: number;
  public search: string;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor() { }

  getData(): void {
    throw new Error("Method not implemented.");
  }
  edit(client: Client): void {
    throw new Error("Method not implemented.");
  }
  save(): void {
    throw new Error("Method not implemented.");
  }
  delete(client: Client): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngAfterViewChecked() { }

}
