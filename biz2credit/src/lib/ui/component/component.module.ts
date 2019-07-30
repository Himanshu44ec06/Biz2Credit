import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressSpinnerComponent } from './progress-spinner/progressSpinner.component';
import { ProgressSpinnerModule } from 'primeng/primeng';

@NgModule({

  declarations : [
      ProgressSpinnerComponent
  ],
   imports : [
      CommonModule,
      ProgressSpinnerModule
   ],
   exports : [
    ProgressSpinnerComponent
   ],
   providers : [],

})
export class  ComponentModule {

}

