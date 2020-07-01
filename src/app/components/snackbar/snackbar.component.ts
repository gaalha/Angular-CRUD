import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

/*COMO CON EL CONFIRMDIALOG AL SNACKBAR ES NECESARIO IMPORTAR MAT_SNACK_BAR_DATA
PARA PODER INYECTARLE LOS DATOS PROCEDENTES DEL COMPONENTE QU ELO ESTA 'INVOCANDO'.*/
@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any
    ) { }

    ngOnInit() {
    }
}
