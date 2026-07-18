import numberInputSettings from './numberInputSettings.js'

export default {
  detLabel: true,
  detLabelOnly: false,
  includeQRCode: false,
  qrCodeErrorLevel: 'Q',
  qrCodeOnDetLabels: false,
  includeTaxonAuthorities: false,
  excludeNoCatnums: false,
  includeFieldNumber: false,
  includeCollectorInSort: false,
  underline: false,
  italics: false,
  includeProjectLabel: false,
  includeStageSexOnMainLabel: false,
  font: 'Roboto Condensed',
  fontSize: 4,
  fontWeight: 400,
  lineHeight: numberInputSettings.lineHeight.default,
  labelSize: '15x7',
  labelWidth: 1.5,
  labelHeight: 0.7,
  qrCodeDims: numberInputSettings.qrCodeDims.default,
  zoom: 1,
  labelPerSpecimen: true,
  useRomanNumeralMonths: true
}
