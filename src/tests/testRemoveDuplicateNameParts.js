import removeDuplicateNameParts from "../lib/removeDuplicateNameParts.js";

let tests = [
  { values: [], expected: '' },
  { values: ['Plantago', 'lanceolata'], expected: 'Plantago lanceolata' },
  { values: ['Plantago', 'lanceolata', 'subsp.', 'lanceolata'], expected: 'Plantago lanceolata subsp. lanceolata' },
  { values: ['Plantago', 'lanceolata', 'subsp.', 'media'], expected: 'Plantago lanceolata subsp. media' },
  { values: ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'media'], expected: 'Plantago lanceolata var. media' },
  { values: ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'intermedia'], expected: 'Plantago lanceolata subsp. media var. intermedia' },
  { values: ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'media', 'subvar.', 'media'], expected: 'Plantago lanceolata subvar. media' },
  { values: ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'media', 'subvar.', 'determina'], expected: 'Plantago lanceolata var. media subvar. determina' },
  { values: ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'intermedia', 'subvar.', 'rubida'], expected: 'Plantago lanceolata subsp. media var. intermedia subvar. rubida' },
  { values: ['Plantago', 'lanceolata', 'subsp.', 'media', 'var.', 'media', 'subvar.', 'media'], expected: 'Plantago lanceolata subvar. media' },

]

let allPassed = true
tests.forEach(test => {
  removeDuplicateNameParts(test.values);
  if (test.values.join(' ') !== test.expected) {
    allPassed = false;
    console.error('Test failed:', test);
    console.log('Actual:', test.values.join(' '));
    console.log('Expected:', test.expected);
    console.log();
  }
});

if (allPassed) {
  console.log('All tests passed')
}
