export class Rule {
  izq: string;
  der: string;
  firstOne: string[];
  firstOnes: string[];
  lastOnes: string[];
  dotAdded:  boolean = false;
  gramaticExpanded: boolean = false;
  dotApplied: boolean = false;
  isFinal: boolean = false;

  constructor(izq = '', der = ''){
    this.izq = izq;
    this.der = der;
    this.firstOnes = [];
    this.lastOnes = [];
    this.firstOne = [];
  }

  searchEmpty = () => {
    return this.firstOnes.indexOf('?') != -1;
  }

  comparewithAnother = (regla: Rule) => {
    return (this.izq === regla.izq && this.der == regla.der)
  }

  makeUnique = () => {
    this.firstOnes = this.firstOnes.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });
    this.lastOnes = this.lastOnes.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });
  }

  checkLeft(){
    if(this.izq.match(/[a-z]/g))
      console.log('Lado izquierdo de la regla ha de ser en MAYÚSCULA indicando un No terminal')
  }

  checkRight(rigthSide){
    
  }

  getLeftSide(){
    return this.izq;
  }

  getRigthSide(){
    return this.der;
  }

  print(){
    console.log(`REGLA: ${this.izq} -> ${this.der}`)
  }

}
