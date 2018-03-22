/*CONTIENE LOS MODULOS DE ANGULAR QUE SON IMPORTADOS EN TODOS LOS MODULOS
CREADOS POR EL USUARIO*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialComponentsModule } from './material.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MaterialComponentsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MaterialComponentsModule
    ]
})
export class SharedModule {
}