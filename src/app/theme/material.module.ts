import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatCheckboxModule,
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        MatToolbarModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatIconModule,
        MatDialogModule,
        MatSelectModule,
        MatOptionModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatListModule,
        MatMenuModule,
        MatCheckboxModule
    ],
    declarations: []
})
export class AppMaterialModule { }