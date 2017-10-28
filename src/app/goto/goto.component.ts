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
    let newState;
    this.rules.forEach((rule) => {
      newState = new State(rule);
      newState.print();
      newState.expand(newState.clausurePosition,this.rules,this.goToList)
      newState.moveRight(this.rules,this.goToList);
    })
    console.log('Lista', this.goToList)

  }

}
