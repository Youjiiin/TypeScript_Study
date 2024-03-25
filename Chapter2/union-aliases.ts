// -- 유니언 타입 & 리터럴 타입 --
// 두 개 이상의 타입으로 유연하게 타입 설정

// 타입 alias - 사용자 지정 타입
type Combinable = number | string;
type ConversionDescriptor = "as-number" | "as-text";

function combine(
  input1: Combinable, // 타입 alias
  input2: number | string, // 유니언 타입
  resultConversion: ConversionDescriptor
  //resultConversion: 'as-number' | 'as-text' //리터럴 타입
) {
  let result;

  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConversion === "as-number"
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  return result;
  // if (resultConversion === 'as-number') {
  //     return +result;
  // } else {
  //     return result.toString();
  // }
}

const combineAges = combine(30, 26, "as-number");
console.log(combineAges);

const combineStringAges = combine("30", "26", "as-number");
console.log(combineStringAges);

const combineNames = combine("Jang", "Yujin", "as-text");
console.log(combineNames);
