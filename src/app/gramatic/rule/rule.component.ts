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
    console.log(cadena.indexOf("C"));
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
      for(let inex of this.reglas){
        if(new RegExp(regla.izq).test(inex.izq))
          regla.firstOnes = regla.firstOnes.concat(inex.firstOne);
      }
    }
    while(this.checkLeftFirstOnes()){
      for(let regla of this.reglas){
        if(/[A-Z]/.test(regla.der[0])){
          console.log("Si pasa para aca")
          this.firstNested(regla, regla.der[0], regla.der, 0);
        }
      }
    }
  }
}
