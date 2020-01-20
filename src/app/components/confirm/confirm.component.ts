import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

/*EN ESTE COMPONENTE ES SUMAMENTE IMPORTANTE HACER LA IMPORTACIÓN DE
MAT_DIALOG_DATA, CON ESTO PODEMOS INYECTARLE AL COMPONENTES LOS DATOS
ENVIADOS DESDE OTRO COMPONENTE, ASI PODEMOS USAR UN SOLO CONFIRMDIALOG
EN TODO EL PROYECTO, EL TITULO Y EL MENSAJE SERAN SETEADOS DESDE EL MODULO
QUE LE MANDA LA DATA A ESTE MODULO.*/

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any /*EN ESTA LINEA LE INYECTAMOS LOS DATOS PROCEDENTES DEL OTRO COMPONENTE*/
    ) { }
}
