import { Component } from '@angular/core';
import { Rule } from './rule';

@Component({
  selector: 'app-rule',
  templateUrl: 'rule.component.html'
})
export class RuleComponent {
  reglas: Rule[] = [];

  inputIzq: string = "";
  inputDer: string = "";

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



  firstNested = (rule: Rule, character: string, chain: string, index: number) => {
    for(let regla of this.reglas){
      if(new RegExp(character).test(regla.izq)){
        if(regla.searchEmpty()){
          rule.firstOne = rule.firstOne.concat(regla.firstOnes);
          rule.firstOne = rule.firstOne.filter(item => {
            return item !== '?';
          });
          rule.firstOnes = rule.firstOnes.concat(regla.firstOnes);
          if(index + 1 !== chain.length){
            rule.firstOnes = rule.firstOnes.filter(item => {
              return item !== '?';
            });
          }
          if(index <= chain.length)
            this.firstNested(rule,chain[index+1], chain, index+1);
          else
            break;
        }else{
          rule.firstOne = rule.firstOne.concat(regla.firstOnes);
          rule.firstOnes = rule.firstOnes.concat(regla.firstOnes);
        }
        break;
      }
    }
  }

  checkLeftFirstOnes = () => {
    for(let regla of this.reglas){
      if(regla.firstOne.length == 0)
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
}
