<script>
  import exampleDataURL from '../../lib/exampleDataURL'
</script>

<h3>Oorsig</h3>
<p>
  Trek eenvoudig jou rekords in met standaardvelde vir lokaliteit, datum, taksonnaam ens., kies die etikettipe 
  en pas die stellings aan soos nodig. Die etikette is ontwerp om te voldoen aan die vereistes 
  van die meeste versamelingstipes en volg die beste praktyke.
</p>

<h3>Laai jou data</h3>
<p>
  Begin deur 'n CSV-lêer met jou data op die tuisblad te laai. <a href="https://en.wikipedia.org/wiki/Comma-separated_values" target="_blank">CSV</a>
  is die eenvoudigste en veiligste formaat vir die uitruil van data. Hier is 'n <a href={exampleDataURL} target="_blank">voorbeeld</a> wat jy kan 
  gebruik indien jy nie reeds een het nie.
</p>
<p>
  Indien jy jou datastel laai en geen etikette sien nie, gaan na veldpassings en verfris die passings. Dit behoort jou ten minste 'n etiket te gee 
  om mee te begin. Jy kan dan veranderings maak aan die veldpassings soos nodig (sien Datavelde hieronder).
</p>
<p>
  <em>
    Let daarop dat geen data gestoor of oor die internet gestuur word wanneer hierdie hulpmiddel gebruik word nie. 
    Die oorspronklike kode is <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank">beskikbaar op Github</a> en iemand wat 
    Javascript ken kan dit kontroleer en bevestig.  
  </em>
</p>

<h3>Datavelde</h3>
<p>
  Hierdie hulpmiddel gebruik standaard datavelde soos ligging, datum, taksonnaam, ens. en maak gebruik van 
  <a href="https://dwc.tdwg.org/terms/" target="_blank">Darwin Core-velde</a> so ver as moontlik. Wanneer jy jou data laai, 
  probeer die hulpmiddel om die velde in jou datastel met die ooreenstemmende etiketvelde te verbind. As jy byvoorbeeld 'n veld 
  genaamd 'localityname' het, sal die data geskryf word na die veld 'locality'. Die idee is dat jy jou data kan intrek met watter velde jy 
  ook al het en die hulpmiddel die vergelyking laat doen, sodat jy nie ekstra werk hoef te doen nie.
</p>
<p>
  Indien jou velde nie op die etiket verskyn nie, is daar 'n opsie om die verbindings/passings met die hand te stel. 
  Velde kan ingesluit of uitgesluit word soos jy goeddink. Jy kan meer lees oor die Darwin Core-termdefinisies deur 
  die skakels wat verskaf word te volg.
</p>
<p>
  Onthou dat die velde wat jy op die etiket insluit, jou keuse is. Die hulpmiddel benodig ten minste een veld, soos 
  ligging of taksonnaam om 'n etiket te genereer, maar andersins is jy vry om te kies en keur soos jy wil. 
</p>
<p>
  Vir herbarium-etikette kan jy ook velde soos 'dups' insluit om instansies te lys waarheen duplikate gestuur word, 
  en familie- en genusnommer/kode-velde, as jy dit vir liasseringsdoeleindes wil gebruik.
</p>
<p>
  Vir insek-etikette kan jy 'n veld genaamd 'shortLocality' insluit vir 'n verkorte vorm van die ligging (Insek-etikette 
  het ernstige spasiebeperkings). Hierdie veld moet alles insluit van land tot die spesifieke ligging soos jy dit op die 
  etiket wil hê, maar nie die koördinate of koördinaatmetadata nie. Laasgenoemde kry hul eie lyn en word verbind met etiketkoördinaatvelde.
  </p>

<h5>Taksonnaamvelde</h5>
<p>
  Taksonname kan op baie verskillende maniere in 'n datastel gestoor word. Die hulpmiddel gee prioriteit aan name wat in individuele 
  rangvelde gestoor word, dit wil sê familie, genus, spesie, ens. (tot subforma vir plante). Andersins kan jy 
  een veld vir die taksonnaam gebruik en die naam daarin stoor ongeag sy rang ('n aparte veld, taksonrang, kan ingesluit word). 
  Dit word aanbeveel om aparte velde vir die outeursitaat, spesifikasies, akkuraatheid, ens. te gebruik. Jy kan ook enige 
  opmerkings rakende die identifikasie, literatuurbronne, ens. insluit.
</p>

<h5>Die voorbeelddatastel</h5>
<p>
  Die <a href={exampleDataURL} target="_blank">voorbeelddata</a> is a Google Sheet wat velde insluit 
  wat deur die hulpmiddel herken sal word, asook 'n paar voorbeelde van rekords. Neem 'n paar oomblikke om deur die 
  kommentaar in die veldopskrifte te gaan wat verduidelik hoe elke veld gebruik moet word. Jy is welkom om 'n kopié
  van hierdie bladsy vir eie gebruik te maak (File >> Make a copy).
<p>
  Om etikette van 'n Google Sheet te maak, moet jy die data eers in CSV-formaat aflaai. Gaan na File >> Download, 
  en kies 'Comma separated values (.csv)'.
</p>
<p>
  Die sigblad bevat 'n veld genaamd 'print', wat gebruik kan word vir die kies en filter van rekords om te druk.  
  <a href="https://youtu.be/SYSevA4znlc?si=oO6e0d_pxyUikpEd" target="_blank"> Hierdie 3 minuut video</a> wys hoe om in Google Sheets
  te filter. Om slegs etikette vir gefilterde rekords te druk, moet jy die rekords kopieer en in 'n aparte sigblad plak 
  voordat jy dit aflaai. Ongelukkig ignoreer Google Sheets enige toegepaste filters en alle rekords 
  in 'n sigblad word uitgevoer. Jy kan soveel verskillende filters gebruik soos jy wil, byvoorbeeld velde insluit 
  vir die instituut en die datum waarop eksemplare gestoor word, om sodoende 
  etikette te druk vir groepe eksemplare soos dit in die versameling opgeneem word.
</p>

<h3>Duplikaat etikette</h3>
<p>
  As jy duplikaat etikette vir elke eksemplaar in 'n reeks wil hê (bv. verskeie insekte van dieselfde spesie wat saam versamel is, 
  of duplikate van herbarium eksemplare), sal jy 'n veld by jou datastel moet voeg met 'n aantal (noem die veld 'count' of 'specimenCount'). 
  Indien jy nie 'n spesifieke aantalveld het nie, sal die instrument die veld met aantal eksemplare per ouderdom/geslag  of 
  'dups' (herbarium-etikette) gebruik. 
</p>

<h3>Etiket opsies</h3>
<p>
  Sodra jy jou datastel ingetrek het, sal jy 'n lys opsies sien om jou etiketontwerp aan te pas. Wanneer jy op die drukknoppie kliek, 
  sal jou keuses (en veldskakels) gestoor word vir die volgende keer wanneer jy etikette wil druk. Gebruik 'n klein 
  datastel om die etiketontwerp baas te raak, voordat jy groot groepe etikette maak.
</p>
<p>
  <em>
    Dit word sterk aanbeveel dat jy 'n <strong>klein aantal toetsetikette</strong> druk om seker te maak dat jou ontwerp goed werk op papier, 
    voordat jy groot groepe finale etikette druk. 
  </em>
</p>

<h3>Druk van etikette</h3>
<p>
  Wanneer jy op die drukknoppie op die voorskoublad (preview screen) kliek, sal die blaaier die standaard drukdialoog oopmaak. Maak seker dat jy toepaslike bladsygrootte 
  en kantlyne kies voordat jy druk. Jy kan of direk druk of die etikette as 'n PDF stoor en later kontroleer en druk. Dit word aanbeveel dat die 
  'Save as PDF'-opsie eerder as die 'Microsoft Print to PDF' gebruik word, aangesien dit beter resultate gee. 
</p>
<p>
  Sien asseblief die <a href="https://nscf.org.za/resources/collections-management/" target="_blank">NSCF Collection Management Manual</a> vir riglyne 
  oor die druk van argiefgehalte etikette. 
</p>

<h3>Opmerkings, voorstelle en kwessies </h3>
<p>
  As jy enige opmerkings of voorstelle het, of as jy 'n fout teëkom, skep asseblief 'n kwessie op die 
  <a href="https://github.com/NSCF/SvelteSpecifyLabels/issues" target="_blank">Github-bladsy van hierdie hulpmiddel</a>.
</p>

<h3>Bedankings</h3>
<p>
  Verskeie lede van die NSCF-gemeenskap het insette en voorstelle oor etiketontwerp, uitleg en funksionaliteit 
  vir hierdie hulpmiddel bygedra.
</p>

<h5>Vertalings (verskyn nog nie op webwerf nie) is verskaf deur:</h5>
<ul>
  <li>afr: Adriaan Jordaan, Christiaan Steenkamp, Hester Steyn, Ian Engelbrecht</li>
  <li>zul: vrywilligers welkom</li>
</ul>
<p>As jy 'n vertaling wil bydra om die aantal tale waarin die instrument beskikbaar is te vermeerder, sien asseblief die 
  instruksies <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank">op die Github-bladsy</a>, en skep 'n 
  kwessie soos hierbo indien jy tegniese bystand benodig.
</p>