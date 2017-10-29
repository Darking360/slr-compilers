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
          i.der = [i.der.slice(0,0) + '.' + i.der.slice(0)].toString();
          closing.reglas.push(i);
          this.generateRules(closing);
        }
      }
      regla.dotAdded = true;
    }
  }

  makeClosings = () => {
    let initial = this.reglas.find(item => {
      return item.der.indexOf('#') != -1;
    });
    let newC = new Closing();
    let newR = new Rule;
    newR.izq = initial.izq;
    newR.der = [initial.der.slice(0,0) + '.' + initial.der.slice(0)].toString();
    newC.reglas.push(newR);
    this.generateRules(newC);
    this.closings.push(newC);
    console.log("SALE DE LA FUNCIÓN EXPANDIDA Y CON PUNTOS");
    console.log(newC);
  }

}
