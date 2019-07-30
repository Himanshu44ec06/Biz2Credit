import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';


@Component({
    // tslint:disable-next-line: component-selector
    selector : 'progress-spinner',
    templateUrl : './progressSpinner.component.html',
    styleUrls : ['./progressSpinner.component.css'],
   // changeDetection: ChangeDetectionStrategy.OnPush
})
export class  ProgressSpinnerComponent implements OnChanges {
      @Input()
      show  =  false;

      @Input()
      overlay =  false;

      constructor() {
      }

      ngOnChanges(changes: SimpleChanges): void {
              if (changes) {
                  console.log('I am change');
              }
      }
}

