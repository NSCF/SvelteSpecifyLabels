import numberInputSettings from './numberInputSettings.js'

export default {
  	lang: 'en',
		showInstitution: false,
		collectionName: null,
		labelPerSpecimen: false,
		labelCountField: null,
		useRomanNumeralMonths: false,
		detLabel: true,
		detLabelOnly: false,
		italicizeNames: false,
		showStorage: false,
		includePunch: false,
    includeQRCode: false,
		includeTaxonAuthorities: false,
		excludeNoCatnums: false,
    includeFieldNumber: false,
		underline: false,
    italics: false,
		addPrintedDate: false,
    includeProject: false,
		font: 'Roboto Condensed',
		fontSize: numberInputSettings.fontSize.default,
		fontWeight: 400,
		lineHeight: numberInputSettings.lineHeight.default,
		labelWidth: numberInputSettings.labelWidth.default,
		qrCodeDims: numberInputSettings.qrCodeDims.default
}