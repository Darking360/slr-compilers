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
  usedGrammar: Rule[] = [];
  showTable = true;
  showGoTo = true;


  inputIzq: string = "";
  inputDer: string = "";
  completeGrammar: string = "";

  constructor(){
  }

  firstNested = (rule: Rule, character: string, chain: string, index: number) => {
    for(let regla of this.reglas){
      if(rule.firstExpanded == false && regla.izq != rule.izq && new RegExp(character).test(regla.izq) && !regla.der.endsWith('#') && regla.der.indexOf(regla.izq) == -1){
        if(regla.firstOne.length == 0 || regla.firstOnes.length == 0){
          this.firstNested(regla,regla.der[0], regla.der, 0);
          regla.firstExpanded = true;
        }
        if(regla.searchEmpty()){
          rule.firstOne = rule.firstOne.concat(regla.firstOnes);
          if(typeof chain[index+1] != 'undefined'){
            rule.firstOne = rule.firstOne.filter(item => {
              return item !== '?';
            });
          }          
          rule.firstOnes = rule.firstOnes.concat(regla.firstOnes);
          if(typeof chain[index+1] != 'undefined'){
            rule.firstOnes = rule.firstOnes.filter(item => {
              return item !== '?'; 
            });
          }
          if(typeof chain[index+1] != 'undefined' && new RegExp('[A-Z]').test(chain[index+1]) && chain[index+1] != rule.izq)
            this.firstNested(rule,chain[index+1], chain, index+1);
          else if(typeof chain[index+1] != 'undefined' && !new RegExp('[A-Z]').test(chain[index+1])){
            rule.firstOne.push(chain[index+1]);
            rule.firstOnes.push(chain[index+1]);
            rule.firstOnes = rule.firstOnes.filter(item => {
              return item !== '?'; 
            });
            rule.firstExpanded = true; 
            debugger;
            break;
          }else
            break;
        }else{
          rule.firstOne = rule.firstOne.concat(regla.firstOnes);
          rule.firstOnes = rule.firstOnes.concat(regla.firstOnes);
        }
        break;
      }else if(regla.izq == rule.izq){
        rule.firstOnes = rule.firstOnes.concat(regla.firstOnes);
      }
    }
  }

  checkLeftFirstOnes = () => {
    for(let regla of this.reglas){
      if(regla.firstOnes.length == 0)
        return true;
    }
    return false;
  }

  recursiveNextOnes = (rule: string) => {
    let nextOnes = [];
    let find = this.reglas.filter(item => {
      return item.der.indexOf(rule) != -1 ;
    });
    for(let busq of find){
      if(typeof busq.der[busq.der.indexOf(rule)+1] != 'undefined' && new RegExp('[A-Z]').test(busq.der[busq.der.indexOf(rule)+1])){
        let hall = this.reglas.find(item => {
          return new RegExp(busq.der[busq.der.indexOf(rule)+1]).test(item.izq);
        });
        if(hall.searchEmpty()){
          nextOnes = nextOnes.concat(hall.firstOnes);
          nextOnes = nextOnes.filter(item => {
            return item !== '?';
          });
          if(busq.izq != rule)
            nextOnes = nextOnes.concat(this.recursiveNextOnes(busq.izq));
        }else{
          let hall = this.reglas.find(item => {
            return new RegExp(busq.der[busq.der.indexOf(rule)+1]).test(item.izq);
          });
          nextOnes = nextOnes.concat(hall.firstOnes);
        }
      }else if(typeof busq.der[busq.der.indexOf(rule)+1] != 'undefined' && !new RegExp('[A-Z]').test(busq.der[busq.der.indexOf(rule)+1])){
        nextOnes.push(busq.der[busq.der.indexOf(rule)+1]);
      }else if(busq.der.indexOf(rule) != -1 && (busq.der.indexOf(rule) + 1) == busq.der.length && busq.der[busq.der.indexOf(rule)] != busq.izq){
        nextOnes = nextOnes.concat(this.recursiveNextOnes(busq.izq));
      }
    }
    return nextOnes;
  }

  findFirstAndLastOnes = () => {
    for(let regla of this.reglas){
      if(!/[A-Z]/.test(regla.der[0]) && typeof regla.der[0] != 'undefined' && regla.der[0] != null)
        regla.firstOne.push(regla.der[0]);
    }
    for(let regla of this.reglas){
      let filter = this.reglas.filter(item => {
        return new RegExp(regla.izq).test(item.izq)
      });
      for(let inex of filter){
        regla.firstOnes = regla.firstOnes.concat(inex.firstOne);
      }
    }
    while(this.checkLeftFirstOnes()){
      for(let regla of this.reglas){
        if(/[A-Z]/.test(regla.der[0])){
          this.firstNested(regla, regla.der[0], regla.der, 0);
        }
      }
    }
    for(let regla of this.reglas){
      regla.makeUnique();
    }
    for(let regla of this.reglas){
      let filter = this.reglas.filter(item => {
        return new RegExp(regla.izq).test(item.izq)
      });
      for(let inex of filter){
        regla.firstOnes = regla.firstOnes.concat(inex.firstOne);
      }
    }
    for(let regla of this.reglas){
      regla.makeUnique();
    }
    //Going to find last ones from here
    for(let regla of this.reglas){
      regla.lastOnes = regla.lastOnes.concat(this.recursiveNextOnes(regla.izq));
      regla.lastOnes = regla.lastOnes.filter(item => {
        return item.indexOf('?') == -1;
      });
    }
    for(let regla of this.reglas){
      regla.makeUnique();
    }
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

  addRule = (rule?: Rule) => {
    let n = rule || new Rule();
    this.inputIzq = this.inputIzq.toUpperCase();
    if(!rule){
      n.izq = this.inputIzq.replace(new RegExp(/ /, 'g'), "");
      n.der = this.inputDer.replace(new RegExp(/ /, 'g'), "");
    }
    this.inputDer = "";
    this.inputIzq = "";
    document.getElementById('inputIzq').focus();
    if(n.der.endsWith('#')){
      alert("No es posible agregar una regla con final de cadena")
    }
    else{
      if (this.reglas.length === 0 ){
        this.reglas.push(new Rule(n.izq, n.izq + '#'))
      }
      this.reglas.push(n);
      let band = false;
      for (const nt of this.non_terminals) {
        if (n.izq === nt) {
          band = true;
        }
      }
      if (!band){
        this.non_terminals.push(n.izq);
        console.log('No terminal - ' + n.izq);
      }
      for (let c = 0 ; c < n.der.length ; c++) {
        band = false;
        if (n.der.charAt(c) === n.der.charAt(c).toLowerCase()) {
          for (const t of this.terminals) {
            if (n.der.charAt(c) === t) {
              band = true;
            }
          }
          if (!band) {
            this.terminals.push(n.der.charAt(c));
            console.log('Terminal - ' + n.der.charAt(c));
          }
        }else {
            for (const nt of this.non_terminals) {
                if (n.der.charAt(c) === nt) {
                    band = true;
                }
            }
            if (!band) {
                this.non_terminals.push(n.der.charAt(c));
                console.log('No terminal - ' + n.der.charAt(c));
            }
        }
      }
    }
  }

  createGrammar = () => {
    this.completeGrammar.split('\n').forEach(rule => {
      if(!rule.endsWith('#')){
        const aux = new Rule(rule.split('->')[0].trim(), rule.split('->')[1].trim())
        this.addRule(aux);
      }
    })
  }

  removeRule = (toRemove: Rule) => {
    if(toRemove.der.includes('#'))
      alert('No se puede borrar la regla primaria')
    else
      this.reglas.splice(this.reglas.findIndex(rule => rule.izq === toRemove.izq && rule.der === toRemove.der))
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
    const sameGrammar = (this.usedGrammar.length == this.reglas.length) && this.usedGrammar.every((element, index) => {
      return element === this.reglas[index];
    });
    if(!sameGrammar){
       this.closings = [];
       this.usedGrammar = this.reglas.concat();
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
          regla.isFinal = true;
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
    // DESPLAZAMIENTOS
    for (const closing of this.closings){
      if (closing.index > this.cantStates) {
          this.cantStates = closing.index;
      }
    }
    for (let i = 0 ; i < this.cantStates + 1 ; i++){
        this.table[i] = new Array(this.terminals.length + this.non_terminals.length);
    }
      for (let closing = 1 ; closing < this.closings.length ; closing++) {
        if (this.closings[closing].to !== this.closings[closing].to.toLowerCase()) {
          for (let nt = 0 ; nt < this.non_terminals.length ; nt++) {
            if (this.closings[closing].to === this.non_terminals[nt]) {
              this.table[this.closings[closing].from][nt] = this.closings[closing].index;
            }
          }
        }else {
            for (let t = 0 ; t < this.terminals.length ; t++) {
                if (this.closings[closing].to === this.terminals[t]) {
                    this.table[this.closings[closing].from][t + this.non_terminals.length] = 'D' + this.closings[closing].index;
                }
            }
        }
      }

      //REDUCCIONES
      /*let reduccion = '';
      for (const closing of this.closings) {
        if (closing.isFinal) {
          for (const rule of closing.reglas) {
            if (rule.isFinal) {
              for (let r = 0 ; r < this.reglas.length ; r++) {
                if (rule.izq === this.reglas[r].izq && rule.der === this.reglas[r].der) {
                  reduccion = 'R' + r;
                }
              }
              for (let t = 0 ; t < this.terminals.length ; t++) {
                if (siguiente === this.terminals[t]) {
                  this.table[closing.index][t] = reduccion;
                }
              }
            }
          }
        }
      }*/

      for (let t = 0 ; t < this.terminals.length ; t++) {
          if ('#' === this.terminals[t]) {
              this.table[1][t] = 'OK';
          }
      }
  }

  reviewClosings = () => {
    if (this.closings.length !== 0) {
      return false;
    }
    return true;
  }

  toggleTable = () => {
    this.showTable = !this.showTable;
  }

  toggleGoTo = () => {
    this.showGoTo = !this.showGoTo;
  }

}
