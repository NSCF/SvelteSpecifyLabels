/**
 * Removes duplicate name parts from an array of plant name parts, considering infraspecific ranks included. Updates the provided array in place.
 * @param {string[]} nameParts - The array of name parts to process.
 */
export default function removeDuplicateNameParts(nameParts) {

  if (nameParts.length <= 4) return; // nothing beyond genus+species or single pair

  const kept = [];
  for (let i = 2; i + 1 < nameParts.length; i += 2) {
    const rank = nameParts[i];
    const epithet = nameParts[i + 1];
    if (kept.length && kept[kept.length - 1][1] === epithet) {
      // same epithet as previous: replace higher rank with this lower rank
      kept[kept.length - 1] = [rank, epithet];
    } else {
      kept.push([rank, epithet]);
    }
  }

  // mutate input to: [Genus, species, ...flatten(kept)]
  nameParts.length = 2;
  for (const [r, e] of kept) nameParts.push(r, e);
}
