import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterContentChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BroadcastService } from '../../shared/broadcast.service';
import { DdServiceService } from '../../shared/dd-service.service';
import { DdChildService } from '../../shared/dd-child.service';

import { AppConstant } from '../../shared/app-constant.enum';

@Component({
  selector: 'app-custom-common-dropdown',
  templateUrl: './custom-common-dropdown.component.html',
  styleUrls: ['./custom-common-dropdown.component.scss']
})
export class CustomCommonDropdownComponent implements OnInit, AfterContentChecked, OnDestroy {

  @ViewChild('mainElem', { static: false }) $mainElem: any;
  @ViewChild('toggleElem', { static: false }) $toggleElem: any;

  @Input() isDisabled: boolean = false;
  // tslint:disable-next-line: no-inferrable-types
  @Input() parentHeight: string = '';

  // tslint:disable-next-line: no-inferrable-types
  @Input() isOpenInput: boolean = false;
  // tslint:disable-next-line: no-inferrable-types
  @Input() isDockInput: boolean = false;
  // tslint:disable-next-line: no-inferrable-types
  @Input() isDockable: boolean = false;
  // tslint:disable-next-line: no-inferrable-types
  @Input() isDraggable: boolean = false;
  // tslint:disable-next-line: no-inferrable-types
  @Input() isExpandable: boolean = false;

  // tslint:disable-next-line: no-inferrable-types
  @Input() isDialog: boolean = false;

  // tslint:disable-next-line: no-inferrable-types
  @Input() keynavEnabled: boolean = false;


  @Input() ddName: string = "";
  @Input() ddTitle: string = '';
  @Input() btnId: string = "";
  @Input() btnText: string = "";
  @Input() btnTitle: string = "";
  @Input() btnIcon: string = "";
  @Input() autoClose: string = "";
  @Input() targetBtn: string = "";
  @Input() appendTo: string = "";
  @Input() placement: string = "";

  public isOpen: boolean = false;
  public isDock: boolean = false;
  public isExpanded: boolean = false;
  public name: string = '';

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  private ddClose!: Subscription;
  private ddOpen!: Subscription;
  private ddDestroy!: Subscription;
  private $dialog: any = null;

  constructor(
    private broadcast: BroadcastService,
    private ddService: DdServiceService,
    private ddChild: DdChildService
  ) { }

  listen() {
    this.ddClose = this.broadcast.on<string>(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CLOSE).subscribe((data: any) => {
      if (this.isOpen && ((data && data.force && data.name && data.name === this.ddName) || !this.isDock)) {
        this.btnToggle();
        this.triggerChange(data, 'visibility');
      }
    });

    this.ddOpen = this.broadcast.on<string>(AppConstant.DROPDOWN_BROADCAST_STRING.DD_OPEN).subscribe((data: any) => {
      if (data.name !== this.ddName) {
        return;
      }
      if (!this.isOpen) {
        setTimeout(() => {
          this.btnToggle(data);
        }, 0);
      } else {
        this.triggerChange(data, 'visibility');
      }
    });

    this.ddDestroy = this.broadcast.on<string>(AppConstant.DROPDOWN_BROADCAST_STRING.DD_DESTROY).subscribe((data: any) => {
      const mainElem = this.$mainElem.nativeElement;
      const parentDOM = mainElem.parentNode;
      parentDOM.removeChild(mainElem);
    });
  }

  ngOnInit(): void {
    this.init();
    if (this.isOpen) {
      this.layout();
    }

    if (this.appendTo) {
      setTimeout(() => {
        const parentElem: any = document.getElementById(this.appendTo);
        parentElem.appendChild(this.$mainElem.nativeElement);
      }, 100);
    }

    this.listen();
  }

  ngAfterContentChecked() {

  }

  init() {
    this.name = this.ddName;
    this.isOpen = this.isOpenInput;
    this.isDock = this.isDockInput;
  }

  layout() {
    this.setPosition();
    setTimeout(() => {
      if (this.isOpen) {
        this.setPosition();
      }
    }, 1000);
  }

  setPosition() {
    const targetElem = this.targetBtn ? document.getElementById(this.targetBtn) : this.$toggleElem.nativeElement;
    const offsetPos = targetElem.getBoundingClientRect();
    const positionObj = {
      left: offsetPos.left,
      top: offsetPos.top,
      right: offsetPos.right,
      bottom: offsetPos.bottom,
      width: targetElem.clientWidth,
      height: targetElem.clientHeight
    };
    const boxContent = this.$mainElem.nativeElement.querySelector('.ibox-content');
    if (boxContent.length) {
      boxContent.style.maxHeight = (window.innerHeight - positionObj.bottom - 45) + 'px';
    }

    if (!this.appendTo) {
      return;
    }

    const mainElemChild = this.$mainElem.nativeElement.children[0];
    // mainElemChild.style.top = (positionObj.top + positionObj.height) + 'px';
    if (this.placement === 'left') {
      mainElemChild.style.left = positionObj.left + 'px';
    } else {
      mainElemChild.style.right = (document.body.clientWidth - positionObj.right) + 'px';
    }
  }

  applyDraggable() {
    if (!this.isDraggable) {
      return;
    }

    setTimeout(() => {
      this.$dialog = this.$mainElem.nativeElement.querySelector('> div.dropdown-menu');
      if (this.$dialog.length) {
        const title = this.$dialog.querySelector('.ibox-title');
        const handler = title.length ? title : this.$dialog;
        // initalize draggable instance via third party plugin
      }
    }, 0);
  }

  getToggleElem() {
    return this.$toggleElem.nativeElement;
  }

  getDropdownElem() {
    return this.$mainElem.nativeElement;
  }

  getAutoClose() {
    return this.autoClose;
  }

  isKeynavEnabled() {
    return this.keynavEnabled || true;
  }

  focusToggleElement() {

  }

  btnToggle(data?: any) {
    if(this.isDisabled) {
      return;
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.layout();
      this.ddService.open(this);
      setTimeout(() => {
        this.$mainElem.nativeElement.querySelector('.close-link').focus();
      }, 500);
    } else {
      // tslint:disable-next-line: no-unused-expression
      this.isExpanded && this.expandCollapse(true);
      this.ddService.close(this);
    }

    this.triggerChange(data, 'visibility');
  }

  expandCollapse(isFlag?: boolean) {
    if (isFlag) {
      this.isExpanded = false;
    } else {
      this.isExpanded = !this.isExpanded;
    }
    this.addClassToBody();
    this.triggerChange(null, 'size');
  }

  applyDock(evt?: any) {
    this.isDock = !this.isDock;
    this.ddService.dock(this);
    if (!this.isDock) {
      this.layout();
    }
    this.triggerChange(null, 'dock');
  }

  triggerChange(data: any, type: any) {
    // const expanded = this.isExpanded;
    if (data && data.hasOwnProperty('isExpanded')) {
      this.isExpanded = data.isExpanded;
      this.addClassToBody();
    }
    let dd = { name: this.name, visible: this.isOpen, isExpanded: this.isExpanded, event: type };
    if (typeof data === 'object') {
      dd = Object.assign({}, dd, data);
    }

    this.broadcast.broadcast(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CHANGED, dd);
    if (!this.ddChild.isLoaded(this.name)) {
      this.ddChild.onLoad(this.name, () => {
        this.broadcast.broadcast(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CHANGED, dd);
      });
    }
  }

  addClassToBody() {
    if (this.isExpanded) {
      document.body.classList.add('dd-expanded');
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.body.classList.remove('dd-expanded');
      document.body.style.overflow = '';
      document.body.style.height = '';

      if (this.isOpen && !this.isDock) {
        this.layout();
      }
    }

  }

  ngOnDestroy() {
    this.ddDestroy.unsubscribe();
    this.ddClose.unsubscribe();
    this.ddOpen.unsubscribe();
  }

}
