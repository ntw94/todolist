//배열 메서드

let num = [1,2,3,"hello"];

let num2 = Array(3); // Array( 크기 ) 객체를 써서 배열을 만들 수 있다.

// 1. 주어진 숫자 배열에서 짝수만 필터링하여 새로운 배열을 만드세요.
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const resultNumbers = numbers.filter((item) => item % 2 === 0);
console.log(resultNumbers);


// 2. 사람들의 나이가 담긴 배열에서 성인(18세 이상)만 필터링하세요.
const ages = [12, 18, 22, 16, 30, 25, 15];
const age18over = ages.filter((item)=>{return item >= 18});
console.log(age18over);

// 3. 주어진 문자열 배열에서 모든 단어를 대문자로 변환하는 배열을 만드세요.
const words = ["apple", "banana", "cherry"];
const upperCaseWords = words.map((item) => item.toUpperCase());
console.log(upperCaseWords);


// 4. 상품 가격이 담긴 배열에서 모든 가격을 10% 할인한 새로운 배열을 만드세요.
const prices = [10000, 25000, 30000, 15000];
const discount10perPrices = prices.map((item) => item * 0.9);
console.log(discount10perPrices);

// 5. 배열의 값 두배 만들기
const numbers2 = [1, 2, 3, 4, 5];
const doubleNumbers = numbers2.map( item => item * 2);
console.log(doubleNumbers);

//6. 알파벳 a가 포함된 단어를 제외한 단어 배열 만들기
const words2 = ["apple", "banana", "cherry", "grape", "melon"];
const excludesWords = words2.filter((item) => !item.includes("a"))
console.log(excludesWords);