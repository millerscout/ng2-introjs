import { Injectable } from '@angular/core';
import { IntroJs } from 'intro.js';

export enum introStatus {
  open,
  closed
}

export interface IIntrojsService {
  intro: IntroJs.IntroJs,
  addListener(name: introStatus, callback: Function): void
  removeListener(name: introStatus): void
  setOptions(options: IntroJs.Options): IntroJs,
  start(stepId?: number): IntroJs.IntroJs,
  exit(): IntroJs.IntroJs,
  clear(callback: Function): IntroJs.IntroJs,

  addHints(): IntroJs.IntroJs,
  showHint(hintIdx: number): IntroJs.IntroJs,
  showHints(): IntroJs.IntroJs,
  hideHint(hintIdx: number): IntroJs.IntroJs,
  hideHints(): IntroJs.IntroJs

  previous(): IntroJs.IntroJs,
  next(): IntroJs.IntroJs,

  refresh(): IntroJs.IntroJs,

  onComplete(callback: Function): void
  onExit(callback: Function): void
  onBeforeChange(callback: Function): void
  onAfterChange(callback: Function): void
  onChange(callback: Function): void
  onHintClick(callback: Function): void
  onHintClose(callback: Function): void
  onHintsAdded(callback: Function): void
}
@Injectable()
export class IntrojsService implements IIntrojsService {

  private notifyList = [];
  public intro: IntroJs.IntroJs;

  private isFunction(func) {
    return typeof func === "function"
  }
  constructor() {
    this.intro = introJs();
  }

  ///adds into notifyList, if there's a valid callback.
  addListener(name: introStatus, cb: Function) {

    if (this.isFunction(cb))
      this.notifyList[name] = cb;
  }
  //remove from this.notifyList.
  removeListener(name: introStatus) {
    delete this.notifyList[name];
  }

  ///iterate through this.notifyList and call each callback.
  private notifyListeners(status: introStatus) {
    for (var key in this.notifyList) {
      if (this.notifyList.hasOwnProperty(key)) {
        if (this.isFunction(this.notifyList[key]))
          this.notifyList[key](status);
      }
    }
  }

  setOptions(options: IntroJs.Options) {
    return this.intro.setOptions(options);
  }

  start(step?: number) {
    if (typeof (step) === 'number') {
      this.intro.start().goToStep(step);
    } else {
      this.intro.start();
    }
    this.notifyListeners(introStatus.open);

    return this.intro;
  }

  exit() {
    this.notifyListeners(introStatus.closed);
    return this.intro.exit();
  }

  clear(cb: Function) {
    if (typeof (this.intro) !== 'undefined')
      this.intro.exit();

    this.intro = introJs();

    this.notifyListeners(introStatus.closed);

    if (this.isFunction(cb)) cb();

    return this.intro;
  }

  addHints() {
    return this.intro.addHints();
  }
  showHint(hintIndex: number) {
    return this.intro.showHint(hintIndex);
  }
  showHints() {
    return this.intro.showHints();
  }

  hideHint(hintIndex: number) {
    return this.intro.hideHint(hintIndex);
  }

  hideHints() {
    return this.intro.hideHints();
  }

  previous() {
    this.notifyListeners(introStatus.open);
    return this.intro.previousStep();
  }
  next() {
    this.notifyListeners(introStatus.open);
    return this.intro.nextStep();

  }

  refresh() {
    return this.intro.refresh();
  }

  onComplete(cb: Function) {
    return this.intro.oncomplete(() => {
      if (this.isFunction(cb)) cb();
      this.notifyListeners(introStatus.closed);
    });
  }
  onExit(cb: Function) {
    return this.intro.onexit(() => {
      this.notifyListeners(introStatus.closed);
      if (this.isFunction(cb)) cb();
    });
  }
  onBeforeChange(cb: Function) {
    return this.intro.onbeforechange(() => {
      if (this.isFunction(cb)) cb();
    });
  }
  onChange(cb: Function) {
    return this.intro.onchange(() => {
      if (this.isFunction(cb)) cb();
    });
  }
  onAfterChange(cb: Function) {
    return this.intro.onafterchange(() => {
      if (this.isFunction(cb)) cb();
    });
  }

  onHintClick(cb: Function) {
    return this.intro.onhintclick(() => {
      if (this.isFunction(cb)) cb();
    });
  }

  onHintClose(cb: Function) {
    return this.intro.onhintclose(() => {
      if (this.isFunction(cb)) cb();
    });
  }
  onHintsAdded(cb: Function) {
    return this.intro.onhintclose(() => {
      if (this.isFunction(cb)) cb();
    });
  }

}
