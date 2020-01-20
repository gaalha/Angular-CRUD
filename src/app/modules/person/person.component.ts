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
export class PersonComponent implements AfterViewInit {
    displayedColumns = ['id', 'first_name', 'age', 'gender', 'created', 'personid'];
    dataSource = new MatTableDataSource();
    resultsLength = 0;
    pageEvent: PageEvent;
    pageSizeOptions = [5, 10, 25, 100]; /*CANTIDADES DE DATOS QUE SE PUEDEN MOSTRAR EN LA TABLA*/
    pageSize = 5; /*CANTIDAD DE DATOS QUE SE MUESTRAN AL CARGAR EL GRID */
    page = 1; /*PAGINA QUE SE MOSTRARA AL CARGAR EL GRID*/
    isLoading = false;
    isTotalReached = false;
    totalItems = 0;
    search = '';

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

    // IMPORTANTE: VERIFICAR SI EL TOKEN EXISTE.
    ngOnInit() {
        // VERIFICA QUE LA SESIÓN EXISTA EN AUTH.SERVICE.TS
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

    openSnack(data) {
        this.snack.openFromComponent(SnackbarComponent, {
            data: { data: data },
            duration: 3000
        });
    }

    onPaginateChange(event) {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getData();
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.search = filterValue;
        this.getData();
    }

    // GET PERSONS
    getData() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoading = true;
                    return this.personService!
                        .getList(
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

    // EDIT PERSONS
    edit(row: Person): void {
        // Getting data from back
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

    // SAVE PERSONS
    save(): void {
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

    // DELETE PERSONS
    delete(row: Person) {
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
                    if (data.success) {
                        this.paginator._changePageSize(this.paginator.pageSize);
                        this.openSnack(data);
                    } else {
                        this.openSnack(data);
                    }
                });
            }
        });
    }

}