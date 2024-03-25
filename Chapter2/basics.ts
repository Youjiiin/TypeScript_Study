function plus(n1: number, n2: number, showResult: boolean, pharse: string) {
  // if (typeof n1 !== 'number' && typeof n2 !== 'number') {
  //     throw new Error('타입오류!');
  // } 
  //-> 자바스크립트의 경우 / 타입스크립트는 런타임에서 해결해줌
  const result = n1 + n2;
  if (showResult === true) {
      console.log(pharse + result);
  } else {
      return result;
  }
}

const num1 = 5;
const num2 = 2.8;
const printResult = true;
const resultPharse = 'Result is: ';

plus(num1, num2, printResult, resultPharse);