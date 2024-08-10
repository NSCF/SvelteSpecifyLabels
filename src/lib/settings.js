import numberInputSettings from './numberInputSettings.js'

export default {
  	lang: 'en',
		type: 'general',
		showInstitution: false,
		collectionName: null,
		showHerbariumCollection: false,
		herbariumCollection: null,
		herbariumInstitution: null,
		labelPerSpecimen: false,
		labelsPerHerbariumSpecimen: false,
		useRomanNumeralMonths: false,
		detLabel: true,
		detLabelOnly: false,
		italicizeNames: false,
		showStorage: false,
		includePunch: false,
		includeBarcode: true,
    includeQRCode: false,
		qrCodeErrorLevel: 'Q',
		qrCodeOnDetLabels: false,
		includeTaxonAuthorities: false,
		excludeNoCatnums: false,
    includeFieldNumber: false,
		includeCollectorInSort: false,
		underline: false,
    italics: false,
		addPrintedDate: false,
    includeProject: false,
		font: 'Roboto Condensed',
		herbarimLabelFont: 'Courier',
		fontSize: numberInputSettings.fontSize.default,
		fontWeight: 400,
		lineHeight: numberInputSettings.lineHeight.default,
		labelWidth: numberInputSettings.labelWidth.default,
		qrCodeDims: numberInputSettings.qrCodeDims.default,
		defaults: {
			labelWidth: {
				insect: '2cm',
				herbarium: '9cm'
			}
		},
		generalLabelZoom: 1
}