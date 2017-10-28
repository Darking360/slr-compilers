import { Component } from '@angular/core';
import { State } from './goto';
import {Rule} from '../gramatic/rule/rule';

@Component({
  selector: 'app-goto',
  templateUrl: 'goto.component.html'
})
export class GotoComponent {


  constructor(){
    const newRule = new Rule('A', 'aaSaaa');
    newRule.print();
    const newState = new State(newRule);
    newState.print();
    const newState2 = newState.moveRight();
    const newState3 = newState2.moveRight();
    const newState4 = newState3.moveRight();
    newState2.print();
    newState3.print();
    newState4.print();   
  }

  
}
