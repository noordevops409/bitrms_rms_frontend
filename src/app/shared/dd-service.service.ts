import { Injectable } from '@angular/core';

import { BroadcastService } from './broadcast.service';
import { AppConstant } from './app-constant.enum';

@Injectable({
  providedIn: 'root'
})
export class DdServiceService {

  private openScope: any = null;
  private dockScope: any = null;

  constructor(
    private broadcast: BroadcastService
  ) { }

  open(dropdownScope?: any, element?: any) {
    if (!this.openScope && this.dockScope) {
      this.openScope = this.dockScope;
    }

    if (this.openScope && this.openScope !== dropdownScope && (dropdownScope.isDockable || !this.openScope.isDock)) {
      this.openScope.isOpen = false;
      if (this.dockScope && this.dockScope.isDock) {
        this.dockScope.isDock = false;
        // tslint:disable-next-line: max-line-length
        this.broadcast.broadcast(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CHANGED, { name: this.dockScope.name, visible: this.dockScope.isOpen, event: 'visibility' });
      }
    }

    let isDock: any = null;
    try {
      isDock = localStorage.getItem('dock');
      if (isDock === 'true') {
        isDock = true;
      } else if (isDock === 'false') {
        isDock = false;
      }
    } catch (e) { }

    if (dropdownScope.isDockable) {
      dropdownScope.isDock = isDock;
      if (isDock) {
        this.dockScope = dropdownScope;
        window.scrollTo(0, 0);
      }
    }

    this.openScope = dropdownScope;
  }

  close(dropdownScope?: any, element?: any) {
    if (this.openScope === dropdownScope) {
      if (this.dockScope === this.openScope) {
        this.dockScope = null;
      }
      this.openScope = null;
    }
  }

  dock(dropdownScope?: any, element?: any) {
    if (this.dockScope && this.dockScope !== dropdownScope) {
      this.dockScope.isOpen = false;
    }
    this.dockScope = dropdownScope;
    setTimeout(() => {
      if (!this.dockScope.isDock && this.dockScope.isOpen) {
        this.openScope = dropdownScope;
      }
    }, 0);
    if (dropdownScope.isDock) {
      window.scrollTo(0, 0);
    }
  }

  closeDropdown(evt?: any) {
    if (!this.openScope || this.openScope.isDock || this.openScope.isExpanded) {
      return;
    }

    if (evt && this.openScope.getAutoClose() === 'disabled') {
      return;
    }

    if (evt && evt.which === 3) {
      return;
    }

    const toggleElement = this.openScope.getToggleElem();
    if (evt && toggleElement && toggleElement.contains(evt.target)) {
      return;
    }

    const dropdownElement = this.openScope.getDropdownElem();
    if (evt && this.openScope.getAutoClose() === 'outsideClick' && dropdownElement && dropdownElement.contains(evt.target)) {
      return;
    }

    this.openScope.isOpen = false;
    this.openScope.isExpanded = false;
    this.openScope.focusToggleElement();

    // tslint:disable-next-line: max-line-length
    this.broadcast.broadcast(AppConstant.DROPDOWN_BROADCAST_STRING.DD_CHANGED, { name: this.openScope.name, visible: this.openScope.isOpen, event: 'visibility' });
    this.openScope = null;

  }

  keybindFilter(evt?: any) {
    if (!this.openScope || this.openScope.isDock) {
      return;
    } else if (evt.which === 27) {
      evt.stopPropagation();
      this.openScope.focusToggleElement();
      this.closeDropdown();
    } else if (this.openScope.isKeynavEnabled() && [38, 40].indexOf(evt.which) !== -1 && this.openScope.isOpen && !this.openScope.isDock) {
      evt.preventDefault();
      evt.stopPropagation();
      // tslint:disable-next-line: no-unused-expression
      this.openScope.focusDropdownEntry && this.openScope.focusDropdownEntry(evt.which);
    }
  }
  
}
