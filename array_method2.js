
// 연습:  아래 배열을 " - " 구분자로 합치시오
const array = ["Dog", "Cat", "Rabbit"];
const newArray = array.join("-");
console.log(newArray);

// 연습: ["red", "blue"] 배열과 ["green", "yellow"] 배열을 합치시오.

const color1 = ["red", "blue"];
const color2 = ["green", "yellow"];
const combinedColors = color1.concat(color2);
console.log(combinedColors);

// 연습: 아래 배열에서 10보다 큰 첫 번째 숫자를 찾으시오.
const num = [3, 8, 12, 25];
console.log(num.find((number) => number > 10));


// 연습: 배열을 오름차순으로 정렬하시오.
const sortNum = [55, 23, 89, 12];
sortNum.sort((a,b)=>{return a-b});
console.log(sortNum);

//연습: 배열의 모든 값을 더하시오.
const addNum = [3, 5, 7, 9];
console.log(addNum.reduce((prev,cur) =>{return prev + cur},0));

