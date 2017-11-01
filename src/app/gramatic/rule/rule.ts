export class Rule {
  izq: string;
  der: string;
  firstOne: string[];
  firstOnes: string[];
  lastOnes: string[];
  dotAdded:  boolean = false;
  gramaticExpanded: boolean = false;
  dotApplied: boolean = false;

  constructor(leftSide = '', rightSide = ''){
    this.firstOnes = [];
    this.lastOnes = [];
    this.firstOne = [];
    this.izq = leftSide;
    this.der = rightSide;
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
}
