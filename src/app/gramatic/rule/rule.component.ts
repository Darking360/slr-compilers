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

  constructor(){
    let cadena = "BC"
    console.log(cadena.indexOf("C") + 1);
    console.log(cadena.length)
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

  firstNested = (rule: Rule, character: string, chain: string, index: number) => {
    for(let regla of this.reglas){
      if(new RegExp(character).test(regla.izq)){
        if(regla.searchEmpty()){
          rule.firstOne = rule.firstOne.concat(regla.firstOnes);
          rule.firstOne.splice(rule.firstOne.indexOf('?'),1);
          rule.firstOnes = rule.firstOnes.concat(regla.firstOnes);
          rule.firstOnes.splice(rule.firstOnes.indexOf('?'),1);
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
    //Going to find last ones from here
    for(let regla of this.reglas){
      for(let inex of this.reglas){
        if(inex.der.indexOf(regla.izq) != -1 && inex.der.indexOf(regla.izq)+1 < inex.der.length){
          if(!/[A-Z]/.test(inex.der[inex.der.indexOf(regla.izq) + 1])){
            regla.lastOnes = regla.lastOnes.concat(inex.der[inex.der.indexOf(regla.izq) + 1])
          }else{
            for(let find of this.reglas){
              let find = this.reglas.find(item => {
                return new RegExp(item.izq).test(inex.der[inex.der.indexOf(regla.izq) + 1]);
              });
              regla.lastOnes = regla.lastOnes.concat(find.firstOnes);
            }
          }
        }else if(inex.der.indexOf(regla.izq) + 1 == inex.der.length){
          console.log("CONCHALE ENTRA ACA")
          let find = this.reglas.find(item => {
            return new RegExp(item.izq).test(inex.izq);
          });
          regla.lastOnes = regla.lastOnes.concat(find.lastOnes);
        }
      }
    }
    for(let regla of this.reglas){
      for(let inex of this.reglas){
        if(inex.der.indexOf(regla.izq) != -1){
          if(/[A-Z]/.test(inex.der[inex.der.indexOf(regla.izq) + 1])){
            let find = this.reglas.find(item => {
              return new RegExp(item.izq).test(inex.der[inex.der.indexOf(regla.izq) + 1]);
            });
            if(find.searchEmpty()){
              regla.lastOnes = regla.lastOnes.concat(find.firstOnes);
              regla.lastOnes.splice(regla.lastOnes.indexOf('?'),1);
              let find2 = this.reglas.find(item => {
                return new RegExp(item.izq).test(inex.izq);
              });
              regla.lastOnes = regla.lastOnes.concat(find2.lastOnes);
            }
          }
        }
      }
    }
    for(let regla of this.reglas){
      regla.makeUnique();
    }
  }
}
