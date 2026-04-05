export default function hasArialNarrow() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const text = "mmmmmmmmmmlliWWWW";

  ctx.font = "72px sans-serif";
  const fallback = ctx.measureText(text).width;

  ctx.font = '72px "Arial Narrow", sans-serif';
  const test = ctx.measureText(text).width;

  return test !== fallback;
}
