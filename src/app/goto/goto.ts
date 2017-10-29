import {Rule} from '../gramatic/rule/rule';

export class State {

  rule: Rule;
  number: number;
  clausurePosition: number;
  copy: boolean;
  expansion: State[];
  stringRepresentation: string;

  constructor(Rule, number = 0, clausurePosition = 0, copy = false, expansion = []){
    this.rule = Rule;
    this.number = number;
    this.clausurePosition = clausurePosition;
    this.copy = copy;
    this.expansion = expansion;
    let recorrido = this.rule.getRigthSide().substr(0,this.clausurePosition) + '.' + this.rule.getRigthSide().substr(this.clausurePosition);
    this.stringRepresentation = `${this.rule.getLeftSide()} -> ${recorrido}`;
  }


  isCopy = () => {
    return this.copy;
  }

  clausureAtEnd = () => {
    return this.rule.getRigthSide().length === this.clausurePosition
  }

  getclausurePosition = () => {
    return this.clausurePosition;
  }

  printRule = () => {
    console.log(this.rule.print())
  }

  print = (rules,list) => {
    const copy = this.isCopy() ? 'copia de' : '';
    console.log(`Estado ${copy} ${this.number}`);
    let recorrido = this.rule.getRigthSide().substr(0,this.clausurePosition) + '.' + this.rule.getRigthSide().substr(this.clausurePosition);
    this.stringRepresentation = `${this.rule.getLeftSide()} -> ${recorrido}`;
    console.log(this.stringRepresentation)
    this.expand(this.clausurePosition,rules,list)
    this.moveRight(rules,list)
  }

  expand (clausurePosition, rules, list) {
    if(this.expansion.length > 0){
      console.log('------');
      this.expansion.forEach((expansion)=>{
        expansion.print(rules, list);
        expansion.expand(expansion.clausurePosition, rules, list)
        expansion.moveRight(rules, list);
      })
    }

  }

  checkExpand = (rules) => {
    if(this.rule.getRigthSide().substr(this.clausurePosition,1).match(/[A-Z]/g)){
      const toExpand = this.findRule(rules, this.rule.getRigthSide().substr(this.clausurePosition,1));
      toExpand.forEach((obj)=>{
        this.expansion = this.expansion.concat(new State(obj))
      })
      this.expansion.forEach((obj)=> {
        obj.checkExpand(rules);
      })
    }
  }

  findRule(rules: Rule[], ruleToFind: string): Rule[]{
    let rule = [].concat(rules.filter(obj => obj.getLeftSide() === ruleToFind));
    return rule;
  }

  moveRight = (rules: Rule[], list: State[]) => {
    if(!this.clausureAtEnd()){
      let newState = new State(this.rule, this.number+1, this.clausurePosition+1);
      //newState.print(rules,list);
      //newState.expand(newState.clausurePosition, rules, list)
      newState.checkExpand(rules);
      if(!newState.checkIsCopy(list)){
        list.push(newState);
        newState.expansion.forEach((obj)=>{
          obj.moveRight(rules,list)
        })
        newState.moveRight(rules,list);
      }
      else{
        list.push(newState);
      }

    }
    else
      console.log("Final de la regla")
  }

  toString = () => {
    let aux = this.stringRepresentation;
    this.expansion.forEach((exp)=>{
      aux = aux+"\n"+exp.toString();
    })
    return aux;
  }

  checkIsCopy = (list: State[]) => {
    const isCopy = list.find(obj => JSON.stringify(obj) === JSON.stringify(this))
      if(isCopy)
        this.copy = true;
    return isCopy;
  }

}