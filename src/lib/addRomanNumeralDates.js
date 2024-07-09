const romanNumeralMonths = {
  '01': 'i',
  '02': 'ii',
  '03': 'iii',
  '04': 'iv',
  '05': 'v',
  '06': 'vi',
  '07': 'vii',
  '08': 'viii',
  '09': 'ix',
  '10': 'x',
  '11': 'xi',
  '12': 'xii'
};

export default function(dateString) {

  let match = dateString.match(/\d{1,2}[-\/]{1}\d{4}/)
  if (match) {
    let month = match[0].split(/[-\/]/)[0]
    let paddedMonth = month.padStart(2, '0')
    let numeral = romanNumeralMonths[paddedMonth]
    let replacement = match[0].replace(month, numeral)
    dateString = dateString.replace(match[0], replacement)
  }
  else {
    match = dateString.match(/\d{4}[-\/]{1}\d{1,2}/)
    if (match) {
      let month = match[0].split(/[-\/]/)[1]
      let paddedMonth = month.padStart(2, '0')
      let numeral = romanNumeralMonths[paddedMonth]
      let re = `(${month})(?!.*\\1)`
      let replacement = match[0].replace(new RegExp(re), numeral)
      dateString = dateString.replace(match[0], replacement)
    }
  }

  return dateString
  
}