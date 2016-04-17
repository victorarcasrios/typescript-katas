/// <reference path="./cell.ts" />

class GameOfLife{
  private static minimumToSurvive: number = 2;
  private static perfectCase: number = 3;
  
  private environment: Array<Array<Cell>>;
  private futureEnvironment: Array<Array<Cell>>;
  
  constructor(environment: Array<Array<Cell>>){
    this.environment = environment;
    this.futureEnvironment = [];
  }
  
  next = (): Array<Array<Cell>> => {
    this.environment.forEach((row: Array<Cell>, rowIndex: number) => {
      let futureRow = row.reduce(
          (futureRow:Array<Cell>, cell: Cell, cellIndex: number) => {
            futureRow.push(this.getFutureCell([rowIndex, cellIndex]));
            return futureRow;
        }, []);
      this.futureEnvironment.push(futureRow);
    });
    
    this.environment = this.futureEnvironment;
    this.futureEnvironment = [];
    return this.environment;
  }
  
  getFutureCell = (position: Array<number>): Cell => {
    let [y, x] = position,
        willBeAlive: boolean = GameOfLife.evaluate(this.environment, position);
    
    return new Cell(willBeAlive);
  }
  
  static evaluate(environment: Array<Array<Cell>>, position: Array<number>){
    let [y, x] = position;
    let cell: Cell = environment[y][x],
        neighbours: number = 0,
        environmentWidth: number = environment[y].length,
        top: number = y - 1,
        left: number = x - 1,
        right: number = x + 1,
        bottom: number = y + 1,
        hasTop: boolean =  top >= 0,
        hasLeft: boolean = left >= 0,
        hasRight: boolean = right < environmentWidth,
        hasBottom: boolean = bottom < environment.length;
    
    if(hasTop){
      let topPortion: Array<Cell> = environment[top].slice(
          hasLeft ? left : x, 
          hasRight ? (right + 1) : x + 1 );
      neighbours += this.countNeighboursInRow(topPortion);
    }
    if(hasLeft && environment[y][left].alive){
      neighbours += 1;
    }
    if(hasRight && environment[y][right].alive){
      neighbours += 1;
    }
    if(hasBottom){
      let bottomPortion: Array<Cell> = environment[bottom].slice(
          hasLeft ? left : x, 
          hasRight ? (right + 1) : x + 1 );
      neighbours += this.countNeighboursInRow(bottomPortion);
    }
    
    return this.willBeAlive(cell, neighbours);
  }
  
  static countNeighboursInRow = (row: Array<Cell>): number => {
    return row.reduce((n:number, c: Cell) => {
        return n + (c.alive ? 1 : 0);
      }, 0);
  }
  
  static willBeAlive = (cell: Cell, neighbours: number): boolean => {
    if(neighbours === GameOfLife.perfectCase){
      return true;
    }
    
    if(cell.alive){
      return neighbours === GameOfLife.minimumToSurvive;
    }
    
    return false;
  }
}