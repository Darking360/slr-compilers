import { Component } from '@angular/core';
import { Closing } from './closing';
import { Rule } from '../rule/rule';

@Component({
  selector: 'app-closing',
  templateUrl: './closing.component.html'
})
export class ClosingComponent {
  closings: Closing[] = [];
  reglas: Rule[] = [];

  inputIzq: string = "";
  inputDer: string = "";

  constructor(){
    let cadena = "ABC";
    let position = 0;
    console.log([cadena.slice(0,position) + '.' + cadena.slice(position)]);
    position = 1;
    console.log([cadena.slice(0,position) + '.' + cadena.slice(position)]);
  }

  canAdd = () => {
    let n = new Rule();
    n.izq = this.inputIzq.replace(new RegExp(/ /, 'g'), "");
    n.der = this.inputDer.replace(new RegExp(/ /, 'g'), "");

    for(let regla of this.reglas){
      if(regla.comparewithAnother(n))
        return true;
    }
    if(this.inputIzq.length == 1 && this.inputDer.length > 0)
      return false;
    else
      return true;
  }

  addRule = () => {
    let n = new Rule();
    n.izq = this.inputIzq.replace(new RegExp(/ /, 'g'), "");
    n.der = this.inputDer.replace(new RegExp(/ /, 'g'), "");
    this.inputDer = "";
    this.inputIzq = "";
    this.reglas.push(n);
  }

  generateRules = (closing: Closing) => {
    for(let regla of closing.reglas){
      if(regla.dotAdded == false && regla.der.indexOf('.') != -1 && typeof regla.der.indexOf('.')+1 != undefined && new RegExp('[A-Z]').test(regla.der[regla.der.indexOf('.')+1])){
        regla.dotAdded = true;
        let rules = this.reglas.filter(item => {
          return item.izq === regla.der[regla.der.indexOf('.')+1];
        });
        for(let i of rules){
          let newR = new Rule();
          newR.izq = i.izq;
          newR.der = i.der;
          newR.der = [newR.der.slice(0,0) + '.' + newR.der.slice(0)].toString();
          closing.reglas.push(newR);
          this.generateRules(closing);
        }
      }
      regla.dotAdded = true;
    }
  }

  startClosings = () => {
    let initial = this.reglas.find(item => {
      return item.der.indexOf('#') != -1;
    });
    let newC = new Closing();
    let newR = new Rule;
    newR.izq = initial.izq;
    newR.der = [initial.der.slice(0,0) + '.' + initial.der.slice(0)].toString();
    newC.reglas.push(newR);
    newC.index = 0;
    this.generateRules(newC);
    this.closings.push(newC);
    this.makeClosings();
  }

  makeClosings = () => {
    for(let closing of this.closings){
      for(let regla of closing.reglas){
        let newC = new Closing();
        if(regla.der.indexOf('.')+1 != -1 && typeof regla.der[regla.der.indexOf('.')+1] != undefined && regla.der.indexOf('.')+1 < regla.der.length && regla.der[regla.der.indexOf('.')+1] != '#' && regla.gramaticExpanded == false){
          let rules = closing.reglas.filter(item => {
            return regla !== item && item.der.indexOf('.') != -1 && item.der[item.der.indexOf('.')+1] == regla.der[regla.der.indexOf('.')+1];
          });
          for(let j of rules){
            let newR = new Rule;
            newR.izq = regla.izq;
            newR.der = regla.der;
            newR.der = [newR.der.slice(0,0) + '.' + newR.der.slice(0)].toString();
            newC.reglas.push(j);
          }
          let newR = new Rule;
          newR.izq = regla.izq;
          newR.der = regla.der;
          let position = newR.der.indexOf('.')+1;
          newR.der = newR.der.replace(/\./g, "");
          newR.der = newR.der.substr(0, position) + '.' + newR.der.substr(position);
          newC.reglas.push(newR);
          this.closings.push(newC);
        }
        regla.gramaticExpanded = true;
      }
      //this.closings.push(newC);
    }
  }

}
