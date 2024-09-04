export const fieldsMappings = { 
  //this uses DwC, mostly...
  catalogNumber: ['Catalog Number', 'CatNum', 'catnum', 'barcode', 'specimenbarcode'], 
  recordNumber:['Field Number', 'collNum', 'collNo', 'collectorNo', 'collectornumber', 'collectorCode', 'number'],
  project: ['projectname', 'survey', 'fieldtrip', 'trip'],
  duplicates: ['dups', 'dup'],
  geography: ['Orig. Prov', 'countryprovince'],
  country: ['countryname'],
  stateProvince: ['province', 'state', 'admin1', 'majorarea', 'majoradminname', 'major'],
  admin1Type: ['stateProvinceType', 'statetype', 'provincetype'], //specific for Arthrobase extracts
  county: ['district', 'municipality', 'admin2', 'minorarea', 'minor'],
  admin2Type: ['districttype', 'countytype', 'municipalitytype', 'admin2type' ], //specific for Arthrobase extracts
  verbatimLocality:[],
  locality: ['localityname', 'localitystring', 'locnotes', 'localitynotes'],
  fullLocality: [], 
  fullCoordsString: [],
  verbatimCoordinates: ['Orig Coords', 'verbatimCoords', 'original coords', 'verbatimcoordinates'], //odd mapping here due to field usage in Specify
  verbatimLatitude: ['Lat1text', 'verbatimLat', 'verbatimlatitude', 'latitude', 'lat'],
  verbatimLongitude: ['Long1text', 'verbatimLong', 'verbatimlongitude', 'longitude', 'long'],
  decimalLatitude: ['Latitude1', 'ddLat', 'ddlat', 'declat', 'decimalLat', 'decimallatitude'],
  decimalLongitude:['Longitude1', 'ddLong', 'ddLon', 'declong', 'decimalLong', 'decimalLon', 'decimallongitude'],

  // BRAHMS coordinates and altitude fields, here only so we can try get people off BRAHMS...
  llunit: [],
  ns: [],
  ew: [],
  alt: [],
  altUnit: [],

  // and back to sanity...
  coordsUncertainty: ['Max Uncertainty Est', 'uncertainty', 'llres'],
  coordsUncertaintyUnit:['Max Uncertainty Est Unit',  'uncertaintyunit'],
  coordsSource: ['Lat/Long Method', 'georeferenceSources', 'georefSource', 'georefSources', 'coordsMethod', 'coordsSource'], //because its should not be a georeference!!
  verbatimSRS: ['Datum', 'geodeticDatum'],
  gridReference:['grid', 'qds', 'gridref', 'qdgs'],
  labelElevation: [],
  verbatimElevation: ['elevation', 'altitude', 'Verbatim Elev'],
  minElevationMeters:['Min Elevation in meters', ], // not 'minElev', 'minelevation' because they can be in other units
  maxElevationMeters:['Max Elevation in meters'], //ditto
  habitat: ['habitattxt', 'habitattext'],
  description: ['plantdesc', 'descriptiontext'],
  fieldNumber: ['eventcode', 'sitecode', 'eventnumber', 'sitenumber', 'site/eventcode', 'site/eventnumber'],
  collectionDate: ['verbatimEventDate','dateCollected', 'eventDate', 'collectingDate', 'date'],
  collectionStartDate: ['startdate','collectingstartdate'],
  collectionEndDate: ['enddate', 'collectingenddate'],
  collectionStartTime: ['starttime', 'collectingstarttime'],
  collectionEndTime: ['endtime', 'collectingendtime'],
  year: ['collyy', 'collectionyear', 'collyear'],
  month: ['collmm', 'collectionmonth', 'collmonth'],
  day: ['colldd', 'collectionday', 'collday'],
  permitNumber: ['permit', 'permitcode', 'permitnumber', 'permitno'],
  recordedBy: ['Collectors [Aggregated]', 'collector', 'collectors', 'collectedby', 'namestring'],
  primaryCollectorLastName: ['primaryCollector'],
  additionalCollectors: ['addcoll'], ///BRAHMS strikes again...
  samplingProtocol: ['collectionMethod', 'Collecting Information/Method', 'collectMethods', 'collectmethod', 'method'],
  eventConditions: ['conditions'],
  eventRemarks:['collectingeventremarks'],
  specimenStageSex: ['Stage Sex Count', 'lifeStageSexCounts'],
  sex:['Sex'],
  lifeStage: ['stage'],
  specimenCount:['count', 'counts', 'countamt', 'countamount', 'labelcount', 'labeltotal', 'sheets'],
  seriesSampleCounts:[], //just for Arthrobase
  occurrenceRemarks: ['Remarks', 'Collection Object Remarks', 'Collection Object/Remarks', 'seriesNote', 'notes', 'note', 'specimenNotes', 'specimenNote'],

  //det stuff
  verbatimIdentification: ['labelDetName', 'verbatimdet', 'verbatimdetermination'], //can be used for verbatimIdentification, if we have that
  scientificName: ['Full Name', 'Taxon/Full Name', 'taxonname', 'taxon', 'canonicalName'], //because people use scientificName however they like...
  scientificNameAuthorship: ['author', 'authority', 'taxonauthor', 'taxonomicauthor', 'taxonAuthority', 'taxonomicAuthority', 'nameAuthority', 'nameAuthor'],
  taxonRank: ['rank'],
  
  // we just use ranks here, because Darwin Core taxon fields are a mess...
  order: [],
  superfamily: [],
  familyCode: ['familynumber', 'facode', 'fanumber'],
  family: ['faname', 'familyname'],
  tribe: [],
  subtribe: [],
  genus: ['genusname', 'gename'],
  genusCode: ['gecode', 'gencode', 'dthno', 'genusnumber', 'apgno', 'genusno', 'apgnumber', 'genspec', 'genspecno','taxoncode'],
  species: ['specificEpithet', 'speciesname'],
  subspecies:['infraspecificEpithet', 'sp1'],
  variety: ['var', 'sp2'],
  subvariety: ['subvar'],
  forma: ['form', 'sp3'],
  subforma: ['subform', 'subf'],

  identificationQualifier:['qualifier', 'prefix', 'prefixQualifier', 'taxonNamePrefix'],
  suffixQualifier: ['suffix', 'taxonNameSuffix'], //not a dwc term, but should be 
  identificationConfidence:['confidence', 'detconfidence', 'detcertainty'],
  identificationMethod:['Determinations/Method', 'detMethod', 'idmethod'],
  identificationReferences: ['detReferences', 'detrefs'],
  identifiedBy:['detBy', 'determinedby'],
  detByLast:['lastname'],
  detByFirst: ['firstname'],
  detByInitials: ['inital', 'initials', 'middleinitial'],
  dateIdentified: ['Determined Date', 'detdate'],
  detYear: ['detyy', 'determinationyear', 'detday'],
  detMonth:['detmm', 'determinationmonth', 'detmonth'],
  detDay: ['detdd', 'determinationday', 'detyear'],
  identificationRemarks: ['Determinations/Remarks', 'Determinations Remarks', 'detRemarks', 'detNotes', 'detNote'],

  //type data
  typeStatus: ['typestatus', 'typification', 'type'], 
  typeNumber: ['typenumber'],

  //storage
  storageBox: ['Box', 'storage', 'storagelocation']
}