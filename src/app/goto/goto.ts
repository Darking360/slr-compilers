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

 /* expand = () => { //ver si es necesario ambos metodos con y sin params
    if(this.rule.getRigthSide().substr(this.clausurePosition+1,this.clausurePosition+1).match(/[A-Z]/g))
      return new State(new Rule('S','ff')) // metodo para buscar que rule es segun el No Terminal detectado
  }
*/
  expand (clausurePosition, rules) {
    if(this.rule.getRigthSide().substr(clausurePosition,clausurePosition).match(/[A-Z]/g))
      this.expansion = this.expansion.concat(new State(this.findRule(rules, this.rule.getRigthSide().substr(clausurePosition,1)))) // metodo para buscar que rule es segun el No Terminal detectado
  }

  findRule(rules: Rule[], ruleToFind: string): Rule{
    let rule = rules.find(obj => obj.getLeftSide() === ruleToFind);
    return rule;
  }

  moveRight = (rules: Rule[]) => {
    if(!this.clausureAtEnd()){
      let newState = new State(this.rule, this.number+1, this.clausurePosition+1);
      newState.expand(newState.clausurePosition, rules)
      return newState;
    }
    else
      console.log("Final de la regla")
  }

}