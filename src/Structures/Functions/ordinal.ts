export function ordinal(number: number) {
  const string = {
    1: "st",
    2: "nd",
    3: "rd",
  }
  return `${number}${string[number % 10] ? string[number % 10] : "th"}`
}