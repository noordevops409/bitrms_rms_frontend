import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';

@Component({
  selector: 'app-sd-remote',
  templateUrl: './sd-remote.component.html',
  styleUrls: ['./sd-remote.component.scss']
})
export class SdRemoteComponent implements OnInit, OnDestroy {

  @Input() type: any = null;
  
  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    
  }

  init() {

  }

}
