import { Component, Input } from '@angular/core';
import { State } from './goto';
import {Rule} from '../gramatic/rule/rule';

@Component({
  selector: 'app-goto',
  templateUrl: 'goto.component.html',
  styleUrls: ['./goto.component.css']
})
export class GotoComponent {

@Input() rules: Rule[];

  goToList: State[];

  constructor(){ 
    this.goToList = [];
  }

  makeGoTo = () => {
    let newState;
    //this.rules.forEach((rule) => {
      newState = new State(this.rules[0]);
      newState.checkExpand(this.rules);
      this.goToList.push(newState)
      newState.expansion.forEach((obj)=>{
        obj.moveRight(this.rules,this.goToList)
      })
      //newState.print(this.rules,this.goToList);
      //newState.expand(newState.clausurePosition,this.rules,this.goToList)
      newState.moveRight(this.rules,this.goToList);
      //this.goToList.push(newState)
    //})
    //console.log('Lista', this.goToList)
    this.goToList.forEach((state)=>{
      state.toString()
      console.log('----')
    })

  }

}
