import { Component, Input } from '@angular/core';
import { State } from './goto';
import {Rule} from '../gramatic/rule/rule';

@Component({
  selector: 'app-goto',
  templateUrl: 'goto.component.html'
})
export class GotoComponent {

@Input() rules: Rule[];

  constructor(){ 
  }

  makeGoTo = () => {
    const newState = new State(this.rules[0]);
    newState.print();
    let auxState = newState;
    while(!auxState.clausureAtEnd()){
      auxState = auxState.moveRight(this.rules);
      auxState.print();
    }

  }

}
