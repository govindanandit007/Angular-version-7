import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[enable-edit]'
})
export class EnableEditDirective implements OnInit {
  // enableEdit:boolean = false;
  @Input() defaultEnableEdit: string;
@Input('enable-edit') enableEdit: string;
  constructor(private el: ElementRef) {

    this.el.nativeElement.style.backgroundColor= 'red';
   }
  ngOnInit() {
  }
}
