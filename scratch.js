/**
 * Removes duplicate name parts from an array of plant name parts, considering infraspecific ranks included. Updates the provided array in place.
 * @param {string[]} nameParts - The array of name parts to process.
 */
function removeDuplicateNameParts(nameParts) {

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


let testNameParts = ['Plantago', 'lanceolata']
removeDuplicateNameParts(testNameParts)
console.log(testNameParts.join(' '), 'should be', 'Plantago lanceolata')

testNameParts = ['Plantago', 'lanceolata', 'subsp.', 'lanceolata',]
removeDuplicateNameParts(testNameParts)
console.log(testNameParts.join(' '), 'should be', 'Plantago lanceolata subsp. lanceolata')

testNameParts = ['Plantago', 'lanceolata', 'subsp.', 'media',]
removeDuplicateNameParts(testNameParts)
console.log(testNameParts.join(' '), 'should be', 'Plantago lanceolata subsp. media')

testNameParts = ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'media']
removeDuplicateNameParts(testNameParts)
console.log(testNameParts.join(' '), 'should be', 'Plantago lanceolata var. media')

testNameParts = ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'intermedia']
removeDuplicateNameParts(testNameParts)
console.log(testNameParts.join(' '), 'should be', 'Plantago lanceolata var. intermedia')

testNameParts = ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'media', 'subvar.', 'media']
removeDuplicateNameParts(testNameParts)
console.log(testNameParts.join(' '), 'should be', 'Plantago lanceolata subvar. media')

testNameParts = ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'media', 'subvar.', 'determina']
removeDuplicateNameParts(testNameParts)
console.log(testNameParts.join(' '), 'should be', 'Plantago lanceolata subvar. determina')

testNameParts = ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'intermedia', 'subvar.', 'rubida']
removeDuplicateNameParts(testNameParts)
console.log(testNameParts.join(' '), 'should be', 'Plantago lanceolata subsp. media var. intermedia subvar. rubida')
