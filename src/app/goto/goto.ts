import {Rule} from '../gramatic/rule/rule';

export class State {

  rule: Rule;
  number: number;
  clausurePosition: number;
  copy: boolean;
  expansion: State[];

  constructor(Rule, number = 0, clausurePosition = 0, copy = false, expansion = []){
    this.rule = Rule;
    this.number = number;
    this.clausurePosition = clausurePosition;
    this.copy = copy;
    this.expansion = expansion;
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

  print = () => {
    const copy = this.isCopy() ? 'copia de' : '';
    console.log(`Estado ${copy} ${this.number}`);
    let recorrido = this.rule.getRigthSide().substr(0,this.clausurePosition) + '.' + this.rule.getRigthSide().substr(this.clausurePosition);
    console.log(`${this.rule.getLeftSide()} -> ${recorrido}`);
    
  }

  expand (clausurePosition, rules, list) {
    if(this.rule.getRigthSide().substr(clausurePosition,1).match(/[A-Z]/g)){
      const toExpand = this.findRule(rules, this.rule.getRigthSide().substr(clausurePosition,1));
      toExpand.forEach((obj)=>{
        this.expansion = this.expansion.concat(new State(obj))
      })
      console.log('------');
      this.expansion.forEach((expansion)=>{
        expansion.print();
        expansion.expand(expansion.clausurePosition, rules, list)
        expansion.moveRight(rules, list);
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
      newState.print();
      newState.expand(newState.clausurePosition, rules, list)
      list.push(newState);
      newState.moveRight(rules,list)
    }
    else
      console.log("Final de la regla")
  }

}