import { HelloWord } from "./type";

const hello = (props: HelloWord) => {
  const array = [1, 2, 3, 4];

  console.log(`Hello ${props.name}, your age is ${props.age}`);

  console.log(array.at(-1));
};

hello({ name: "nanlan", age: 20 }); // @ts-ignore
