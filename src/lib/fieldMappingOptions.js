export const fieldsMappings = { 
  //this uses DwC, mostly...
  catalogNumber: ['Catalog Number', 'CatNum', 'catnum',], 
  recordNumber:['Field Number', 'collNum', 'collNo', 'collectorNo', 'collectornumber', 'collectorCode'],
  geography: ['Orig. Prov', 'countryprovince'],
  country: [],
  stateProvince: ['province','state', 'admin1'],
  admin1Type: ['stateProvinceType', 'statetype', 'provincetype'], //specific for Arthrobase extracts
  county: ['district', 'municipality', 'admin2' ],
  admin2Type: ['districttype', 'countytype', 'municipalitytype', 'admin2type' ], //specific for Arthrobase extracts
  locality: ['localityname', 'localitystring'],
  fullLocality: [], 
  fullCoordsString: [],
  verbatimCoordinates: ['Orig Coords', 'verbatimCoords', 'original coords', 'verbatimcoordinates'], //odd mapping here due to field usage in Specify
  verbatimLatitude: ['Lat1text', 'verbatimLat', 'verbatimlatitude', 'latitude'],
  verbatimLongitude: ['Long1text', 'verbatimLong', 'verbatimlongitude', 'longitude'],
  decimalLatitude: ['Latitude1', 'ddLat', 'ddlat', 'decimalLat', 'decimallatitude'],
  decimalLongitude:['Longitude1', 'ddLong', 'ddLon', 'decimalLong', 'decimalLon', 'decimallongitude'],
  coordsUncertainty: ['Max Uncertainty Est', 'uncertainty'],
  coordsUncertaintyUnit:['Max Uncertainty Est Unit',  'uncertaintyunit'],
  coordsSource: ['Lat/Long Method', 'georeferenceSources', 'georefSource', 'georefSources', 'coordsMethod', 'coordsSource'], //because its should not be a georeference!!
  verbatimSRS: ['Datum', 'geodeticDatum'],
  labelElevation: [],
  verbatimElevation: ['elevation', 'altitude', 'Verbatim Elev'],
  minElevationMeters:['Min Elevation in meters', 'minElev'],
  maxElevationMeters:['Max Elevation in meters', 'maxElev'],
  habitat: [],
  collectionDate: ['verbatimEventDate','dateCollected', 'eventDate', 'collectingDate', 'date'],
  collectionStartDate: ['startdate','collectingstartdate'],
  collectionEndDate: ['enddate', 'collectingenddate'],
  collectionStartTime: ['starttime', 'collectingstarttime'],
  collectionEndTime: ['endtime', 'collectingendtime'],
  permitNumber: ['permit', 'permitcode', 'permitnumber', 'permitno'],
  recordedBy: ['Collectors [Aggregated]', 'collector', 'collectors', 'collectedby'],
  primaryCollectorLastName: ['primaryCollector'],
  samplingProtocol: ['collectionMethod', 'Collecting Information/Method', 'collectMethods', 'collectmethod', 'method'],
  eventConditions: ['conditions'],
  eventRemarks:['collectingeventremarks'],
  specimenStageSex: ['Stage Sex Count', 'lifeStageSexCounts'],
  sex:['Sex'],
  lifeStage: ['stage'],
  specimenCount:['count', 'counts', 'countamt', 'countamount',],
  seriesSampleCounts:[], //just for Arthrobase
  occurrenceRemarks: ['Remarks', 'Collection Object Remarks', 'Collection Object/Remarks', 'seriesNote', 'notes', 'note', 'specimenNotes', 'specimenNote'],

  //det stuff
  verbatimIdentification: ['labelDetName', 'verbatimdet', 'verbatimdetermination'], //can be used for verbatimIdentification, if we have that
  canonicalName: ['Full Name', 'Taxon/Full Name', 'taxonname', 'taxon'], 
  scientificName: [],
  scientificNameAuthorship: ['author', 'authority', 'taxonauthor', 'taxonomicauthor', 'taxonAuthority', 'taxonomicAuthority', 'nameAuthority', 'nameAuthor'],
  identificationQualifier:['qualifier'],
  identificationConfidence:['confidence', 'detconfidence', 'detcertainty'],
  identificationMethod:['Determinations/Method', 'detMethod', 'idmethod'],
  identificationReferences: ['detReferences', 'detrefs'],
  identifiedBy:['detBy'],
  dateIdentified: ['Determined Date', 'detdate'],
  identificationRemarks: ['Determinations/Remarks', 'Determinations Remarks', 'detRemarks', 'detNotes', 'detNote'],

  //type data
  typeStatus: ['typestatus', 'typification', 'type'], 
  typeNumber: ['typenumber'],

  //storage
  storageBox: ['Box', 'storage', 'storagelocation']
}