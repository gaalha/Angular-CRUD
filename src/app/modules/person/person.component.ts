import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Person } from '~models/Person';
import { PersonService } from '~services/person.service';
import { AuthService } from '~services/auth.service';
import { ConfirmComponent } from '~components/confirm/confirm.component';
import { FormsComponent } from '~modules/person/forms/forms.component';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

@Component({
    selector: 'app-person',
    templateUrl: './person.component.html',
    styleUrls: ['./person.component.css'],
    providers: [PersonService]
})
export class PersonComponent implements AfterViewInit, OnInit {
    public readonly displayedColumns = ['id', 'first_name', 'age', 'gender', 'created', 'personid'];
    public readonly pageSizeOptions = [5, 10, 25, 100];
    public pageSize = 5;
    public dataSource = new MatTableDataSource();
    public pageEvent: PageEvent;
    public resultsLength = 0;
    public page = 1;
    public isLoading = false;
    public isTotalReached = false;
    public totalItems = 0;
    public search = '';

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(
        private cdr: ChangeDetectorRef,
        private personService: PersonService,
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
                    return this.personService.getList(
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

    public edit(row: Person): void {
        this.personService.getOne(row.id).subscribe((data: any) => {
            if (data.success) {
                const dialogRef = this.dialog.open(FormsComponent, {
                    // height: '450px',
                    width: '400px',
                    data: { title: 'Update person', action: 'edit', data: data.data }
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
        const dialogRef = this.dialog.open(FormsComponent, {
            //height: '350px',
            width: '400px',
            data: { title: 'Add person', action: 'save' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.paginator._changePageSize(this.paginator.pageSize);
            }
        });
    }

    public delete(row: Person) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '250px',
            data: {
                title: 'Confirme la acción',
                message: '¿Seguro que desea eliminar este registro?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.personService.delete(row.id).subscribe((data: any) => {
                    this.openSnack(data);

                    if (data.success) {
                        this.paginator._changePageSize(this.paginator.pageSize);
                    }
                });
            }
        });
    }

}