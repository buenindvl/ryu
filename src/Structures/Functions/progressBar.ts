export function progressBar(
  /** Current Progress */
  currentProgress: number,
  /** The Max Progress */
  maxProgress: number,
  /** Size Of The Progress Bar */
  size: number
) {
  let barArray = [];

  let fill = Math.round(
    size * (currentProgress / maxProgress > 1 ? 1 : currentProgress / maxProgress)
  );
  let empty = size - fill > 0 ? size - fill : 0;

  for (let i = 1; i <= fill; i++) barArray.push("▰");
  for (let i = 1; i <= empty; i++) barArray.push("▱");

  barArray[0] = barArray[0] == "▰" ? "▰" : "▱";
  barArray[barArray.length - 1] =
    barArray[barArray.length - 1] == "▰" ? "▰" : "▱";

  return barArray.join("");
}
