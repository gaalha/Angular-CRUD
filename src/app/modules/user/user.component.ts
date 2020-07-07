import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '~models/user';
import { UserService } from '~services/user.service';
import { AuthService } from '~services/auth.service';
import { ConfirmComponent } from '~components/confirm/confirm.component';
import { UserFormComponent } from '~modules/user/user-form/user-form.component';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements AfterViewInit, OnInit {
  public readonly displayedColumns = ['id', 'user_name', 'email', 'created_at', 'userid'];
  public readonly pageSizeOptions = [5, 10, 20, 40, 100];
  public pageSize = 20;
  public dataSource = new MatTableDataSource();
  public pageEvent: PageEvent;
  public resultsLength = 0;
  public page = 1;
  public isLoading = false;
  public isTotalReached = false;
  public totalItems = 0;
  public search = '';
  value: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    // ANTES QUE LA VISTA CARGUE INICIA LA CARGA DE DATOS EN EL GRID
    this.getData();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  private openSnack(data: any): void {
    this.snack.openFromComponent(SnackbarComponent, {
      data: { data: data },
      duration: 3000
    });
  }

  public onPaginateChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getData();
  }

  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.search = filterValue;
    this.getData();
  }

  private getData(): any {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.userService.getList(
            this.sort.active,
            this.sort.direction,
            this.pageSize,
            this.page,
            this.search
          );
        }),
        map(data => {
          this.isLoading = false;
          this.isTotalReached = false;
          this.totalItems = data.total;
          return data.data;
        }),
        catchError(() => {
          this.isLoading = false;
          this.isTotalReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  public edit(row: User): void {
    this.userService.getOne(row.id).subscribe((data: any) => {
      if (data.success) {
        const dialogRef = this.dialog.open(UserFormComponent, {
          // height: '450px',
          width: '400px',
          data: { title: 'Update user', action: 'edit', data: data.data }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.paginator._changePageSize(this.paginator.pageSize);
          }
        });
      }
    });
  }

  public save(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { title: 'Add person', action: 'save' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paginator._changePageSize(this.paginator.pageSize);
      }
    });
  }

  public delete(row: User) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {
        title: 'Delete record',
        message: 'Are you sure you want to delete this record?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.delete(row.id).subscribe((data: any) => {
          this.openSnack(data);

          if (data.success) {
            this.paginator._changePageSize(this.paginator.pageSize);
          }
        });
      }
    });
  }
}
