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
  terminals: string[] = [];
  non_terminals: string[] = [];
  table: string[][] = [];
  cantStates: number;

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
    let band = false;
    for (const nt of this.non_terminals) {
      if (n.izq === nt) {
        band = true;
      }
    }
    if (!band){
      this.non_terminals.push(n.izq);
    }
    band = false;
    for (let c = 0 ; c < n.der.length ; c++) {
      if (n.der.charAt(c) === n.der.charAt(c).toUpperCase()) {
        for (const nt of this.non_terminals) {
          if (n.der.charAt(c) === nt) {
            band = true;
          }
        }
        if (!band) {
          this.non_terminals.push(n.der.charAt(c));
        }
      }else {
          for (const t of this.terminals) {
              if (n.der.charAt(c) === t) {
                  band = true;
              }
          }
          if (!band) {
              this.terminals.push(n.der.charAt(c));
          }
      }
    }
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
    let index = -1;
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
          index = closes.index;
          break;
        }
      }
    }
    return { flag, index };
  }

  calculateFinals = () => {
    for(let closing of this.closings){
      for(let regla of closing.reglas){
        if(!closing.isCopy && regla.der.indexOf('.')+1 != -1 && typeof regla.der[regla.der.indexOf('.')+1] == 'undefined'){
          closing.isFinal = true;
        }
      }
    }
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
              let data = this.checkCopy(newC);
              if(data.flag){
                newC.isCopy = true;
                newC.index = data.index;
              }else{
                let f = this.closings.filter(item => {
                  return item.isCopy;
                });
                newC.isCopy = false;
                newC.index = this.closings.length - f.length;
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
    this.calculateFinals();
  }

  reviewRules = () => {
      if (this.reglas.length !== 0) {
              for (const rule of this.reglas) {
                  if (rule.der.indexOf('#') !== -1) {
                    return false;
                  }
              }
      }
      return true;
  }

  generateTable = () => {
    this.cantStates = 0;
    for (const closing of this.closings){
      if (closing.index > this.cantStates) {
          this.cantStates = closing.index;
      }
    }
    for (let i = 0 ; i < this.cantStates + 1 ; i++){
        this.table[i] = new Array(this.terminals.length + this.non_terminals.length);
    }
    for (let closing = 1 ; closing < this.closings.length ; closing++) {
      if (this.closings[closing].to !== this.closings[closing].to.toUpperCase()) {
        for (let t = 0 ; t < this.terminals.length ; t++) {
          if (this.closings[closing].to === this.terminals[t]) {
            this.table[this.closings[closing].from][t] = 'D' + this.closings[closing].index;
          }
        }
      }else {
          for (let t = 0 ; t < this.terminals.length ; t++) {
              if (this.closings[closing].to === this.non_terminals[t]) {
                  this.table[this.closings[closing].from][t] = this.closings[closing].index;
              }
          }
      }
    }
  }

  reviewClosings = () => {
    if (this.closings.length !== 0) {
      return false;
    }
    return true;
  }
}
