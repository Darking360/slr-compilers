import { Component, Input } from '@angular/core';
import { State } from './goto';
import {Rule} from '../gramatic/rule/rule';

@Component({
  selector: 'app-goto',
  templateUrl: 'goto.component.html'
})
export class GotoComponent {

@Input() rules: Rule[];

  goToList: State[];

  constructor(){ 
    this.goToList = [];
  }

  makeGoTo = () => {
    const newState = new State(this.rules[0]);
    newState.print();
    newState.expand(newState.clausurePosition,this.rules,this.goToList)
    newState.moveRight(this.rules,this.goToList);

  }

}
