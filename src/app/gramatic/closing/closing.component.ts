import { Component } from '@angular/core';
import { Closing } from './closing';
import { Rule } from '../rule/rule';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-closing',
  templateUrl: './closing.component.html',
  styleUrls: ['./closing.component.css']
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
    this.inputIzq = this.inputIzq.toUpperCase();
    n.izq = this.inputIzq.replace(new RegExp(/ /, 'g'), "");
    n.der = this.inputDer.replace(new RegExp(/ /, 'g'), "");
    this.inputDer = "";
    this.inputIzq = "";
    this.reglas.push(n);
  }

  notInPrevious = (close: Closing, rule: Rule) => {
    let find = close.reglas.find(item => {
      return (item.izq === rule.izq && item.der === rule.der);
    });
    return find != null;
  }

  generateRules = (closing: Closing) => {
    for(let regla of closing.reglas){
      if(regla.dotAdded == false && regla.der.indexOf('.') != -1 && regla.der.indexOf('.')+1 < regla.der.length && typeof regla.der.indexOf('.')+1 != undefined
         && new RegExp('[A-Z]').test(regla.der[regla.der.indexOf('.')+1])){
        regla.dotAdded = true;
        let rules = this.reglas.filter(item => {
          return item.izq === regla.der[regla.der.indexOf('.')+1];
        });
        for(let i of rules){
          let newR = new Rule();
          newR.izq = i.izq;
          newR.der = i.der;
          newR.der = [newR.der.slice(0,0) + '.' + newR.der.slice(0)].toString();
          if(!this.notInPrevious(closing, newR)){
            closing.reglas.push(newR);
            this.generateRules(closing);
          }
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

  checkCopy = (closing: Closing) => {
    let flag = false;
    for(let closes of this.closings){
      if(closes.reglas.length == closing.reglas.length){
        let sum = 0;
        closes.reglas.forEach((value,i) => {
          if(value.izq === closing.reglas[i].izq && value.der === closing.reglas[i].der){
            sum+=1;
          }
        });
        if(sum == closes.reglas.length){
          flag = true;
          break;
        }
      }
    }
    return flag;
  }

  makeClosings = () => {
    for(let closing of this.closings){
      if(!closing.isCopy){
        for(let regla of closing.reglas){
          let newC = new Closing();
          if(regla.der.indexOf('.')+1 != -1 && typeof regla.der[regla.der.indexOf('.')+1] != undefined && regla.der.indexOf('.')+1 < regla.der.length && regla.der[regla.der.indexOf('.')+1] != '#' && regla.gramaticExpanded == false){
            let filtro = closing.reglas.filter(item => {
              return item.der.indexOf('.') != -1
                      && regla.der[regla.der.indexOf('.')+1] == item.der[item.der.indexOf('.')+1];
            });
            for(let fi of filtro){
              regla.gramaticExpanded = true;
              fi.gramaticExpanded = true;
              let newR = new Rule;
              newR.izq = fi.izq;
              newR.der = fi.der;
              let position = newR.der.indexOf('.')+1;
              newR.der = newR.der.replace(/\./g, "");
              newR.der = newR.der.substr(0, position) + '.' + newR.der.substr(position);
              newR.dotApplied = true;
              newC.reglas.push(newR);
              this.generateRules(newC);
              newC.isCopy = this.checkCopy(newC);
              if(!newC.isCopy){
                newC.index = this.closings.length;
              }
              newC.from = closing.index.toString();
              newC.to = fi.der[fi.der.indexOf('.')+1];
            }
            this.closings.push(newC);
          }
          regla.gramaticExpanded = true;
        }
      }
      //this.closings.push(newC);
    }
  }

  reviewRules = () => {
      let band = false;
      let band2 = false;
      if (this.reglas.length !== 0) {
          for (const rule of this.reglas) {
            for (let c ; c < rule.der.length ; c++) {
              const letra = rule.der.charAt(c);
              if (letra.match("/[A-Z]/g")) {
                band2 = true;
                for (const rule2 of this.reglas){
                  if (letra === rule2.izq){
                    band = true;
                  }
                }
              }
            }
          }
              for (const rule of this.reglas) {
                  if (rule.der.indexOf('#') !== -1) {
                    if (band2) {
                      if (band) {
                        return false;
                      }
                    }else {
                        return false;
                    }
                  }
              }
      }
      return true;
  }
}
