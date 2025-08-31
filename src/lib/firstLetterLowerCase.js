// sometimes we just need the first letter lowercased
export default function firstLetterLowerCase(string) {
  if (!string || string.length === 0) return string;
  return string.charAt(0).toLowerCase() + string.slice(1);
}
