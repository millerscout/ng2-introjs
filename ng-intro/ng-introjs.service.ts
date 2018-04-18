
//Uses https://introjs.com
import { Injectable } from '@angular/core';
import { IntroJs } from 'intro.js';

export enum introStatus {
  open,
  closed
}

export interface IIntrojsService {
  intro: IntroJs;
  addListener(name: introStatus, callback: () => void): void;
  removeListener(name: introStatus): void;
  setOptions(options: IntroJs.Options): IntroJs;
  start(stepId?: number): IntroJs;
  exit(): IntroJs;
  clear(callback: () => void): IntroJs;

  addHints(): IntroJs;
  showHint(hintIdx: number): IntroJs;
  showHints(): IntroJs;
  hideHint(hintIdx: number): IntroJs;
  hideHints(): IntroJs;

  previous(): IntroJs;
  next(): IntroJs;

  refresh(): IntroJs;

  onComplete(callback: () => void): void;
  onExit(callback: () => void): void;
  onBeforeChange(callback: (element: HTMLElement) => void): void;
  onAfterChange(callback: (element: HTMLElement) => void): void;
  onChange(callback: (element: HTMLElement) => void): void;
  onHintClick(callback: (element: HTMLElement) => void): void;
  onHintClose(callback: (stepId: number) => void): void;
  onHintsAdded(callback: () => void): void;
}
@Injectable()
export class IntrojsService implements IIntrojsService {
  public intro: IntroJs;
  private notifyList: {[index: number]: (status: introStatus) => void} = [];

  constructor() {
    this.intro = introJs();
  }

  //adds into notifyList, if there's a valid callback.
  public addListener(name: introStatus, cb: () => void): void {
    if (this.isFunction(cb)) {
      this.notifyList[name] = cb;
    }
  }

  //remove from this.notifyList.
  public removeListener(name: introStatus): void {
    delete this.notifyList[name];
  }

  public setOptions(options: IntroJs.Options): IntroJs {
    return this.intro.setOptions(options);
  }

  public start(step?: number): IntroJs {
    if (typeof (step) === 'number') {
      this.intro.start().goToStep(step);
    } else {
      this.intro.start();
    }
    this.notifyListeners(introStatus.open);

    return this.intro;
  }

  public exit(): IntroJs {
    this.notifyListeners(introStatus.closed);
    return this.intro.exit();
  }

  public clear(cb: () => void): IntroJs {
    if (typeof this.intro !== 'undefined') {
      this.intro.exit();
    }
    this.intro = introJs();
    this.notifyListeners(introStatus.closed);
    if (this.isFunction(cb)) { cb(); }
    return this.intro;
  }

  public addHints(): IntroJs {
    return this.intro.addHints();
  }
  public showHint(hintIndex: number): IntroJs {
    return this.intro.showHint(hintIndex);
  }
  public showHints(): IntroJs {
    return this.intro.showHints();
  }

  public hideHint(hintIndex: number): IntroJs {
    return this.intro.hideHint(hintIndex);
  }

  public hideHints(): IntroJs {
    return this.intro.hideHints();
  }

  public previous(): IntroJs {
    this.notifyListeners(introStatus.open);
    return this.intro.previousStep();
  }
  public next(): IntroJs {
    this.notifyListeners(introStatus.open);
    return this.intro.nextStep();
  }

  public refresh(): IntroJs {
    return this.intro.refresh();
  }

  public onComplete(cb: () => void): IntroJs {
    return this.intro.oncomplete(() => {
      if (this.isFunction(cb)) { cb(); }
      this.notifyListeners(introStatus.closed);
    });
  }
  public onExit(cb: () => void): IntroJs {
    return this.intro.onexit(() => {
      this.notifyListeners(introStatus.closed);
      if (this.isFunction(cb)) { cb(); }
    });
  }
  public onBeforeChange(cb: (element: HTMLElement) => void): IntroJs {
    return this.intro.onbeforechange((element: HTMLElement) => {
      if (this.isFunction(cb)) { cb(element); }
    });
  }
  public onChange(cb: (element: HTMLElement) => void): IntroJs {
    return this.intro.onchange((element: HTMLElement) => {
      if (this.isFunction(cb)) { cb(element); }
    });
  }
  public onAfterChange(cb: (element: HTMLElement) => void): IntroJs {
    return this.intro.onafterchange((element: HTMLElement) => {
      if (this.isFunction(cb)) { cb(element); }
    });
  }

  public onHintClick(cb: (element: HTMLElement) => void): IntroJs {
    return this.intro.onhintclick((element: HTMLElement) => {
      if (this.isFunction(cb)) { cb(element); }
    });
  }

  public onHintClose(cb: (stepId: number) => void): IntroJs {
    return this.intro.onhintclose((stepId: number) => {
      if (this.isFunction(cb)) { cb(stepId); }
    });
  }
  public onHintsAdded(cb: () => void): IntroJs {
    return this.intro.onhintsadded(() => {
      if (this.isFunction(cb)) { cb(); }
    });
  }

  // tslint:disable-next-line:no-any  --  This rule is ok to disable here because we need to allow anything in to determine the type
  private isFunction(func: any): boolean {
    return typeof func === 'function';
  }

  //iterate through this.notifyList and call each callback.
  private notifyListeners(status: introStatus): void {
    for (const key in this.notifyList) {
      if (this.notifyList.hasOwnProperty(key)) {
        if (this.isFunction(this.notifyList[key])) {
          this.notifyList[key](status);
        }
      }
    }
  }

}
