<script>
  import { link } from "svelte-spa-router";
  import exampleDataURL from "../../lib/exampleDataURL";
</script>

<h3>Resumen</h3>
<p>
  Simplemente agregue los registros de sus especímenes con los campos estándar para localidad, fecha,
  nombre del taxón, etc., seleccione el tipo de etiqueta que desee y ajuste la configuración según sea
  necesario. Las etiquetas han sido diseñadas para satisfacer las necesidades de la mayoría de los tipos
  de colecciones y se adhieren a las mejores prácticas.
</p>

<h3>Carga de datos</h3>
<p>
  Comience cargando un archivo CSV con sus datos desde la página de inicio. <a
    href="https://en.wikipedia.org/wiki/Comma-separated_values"
    target="_blank">CSV</a
  >
  es el formato más simple y seguro para intercambiar datos entre sistemas. Aquí tiene
  <a href={exampleDataURL} target="_blank">un archivo de ejemplo</a> que puede utilizar si
  aún no tiene uno.
</p>
<p>
  Si carga su conjunto de datos y no ve ninguna etiqueta, vaya directamente a los mapeos de
  campos y actualice los mapeos. Esto debería, al menos, darle un punto de partida. Luego
  puede editar los mapeos de campos manualmente si es necesario (ver Campos de datos a continuación).
</p>
<p>
  <em>
    Tenga en cuenta que no se almacenan ni se envían datos de especímenes a través de Internet al
    utilizar esta herramienta. El código fuente está
    <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank"
      >disponible en Github</a
    > y puede ser verificado por cualquier persona que sepa JavaScript para confirmarlo.
  </em>
</p>

<h3>Campos de datos</h3>
<p>
  La herramienta utiliza campos de datos estándar como localidad, fecha, nombre del taxón,
  etc., y emplea <a href="https://dwc.tdwg.org/terms/" target="_blank"
    >nombres de campos de Darwin Core</a
  >
  en la medida de lo posible. Al cargar sus datos, la herramienta hace todo lo posible para mapear
  los campos de su conjunto de datos a los campos de la etiqueta. Por ejemplo, si tiene un campo
  llamado 'localityname', se mapeará a 'locality'. La idea es poder importar sus datos utilizando
  cualquier campo que tenga y que la herramienta los detecte automáticamente, evitando así trabajo adicional.
</p>
<p>
  Si sus campos no aparecen en la etiqueta, existe la opción de configurar los mapeos manualmente.
  Los campos pueden incluirse o excluirse según lo considere oportuno. También puede leer las
  definiciones de los términos de Darwin Core en la sección de mapeo utilizando los enlaces provistos.
</p>
<p>
  Recuerde que los campos que incluya en la etiqueta dependen de usted. La herramienta requiere al menos
  un campo como localidad o nombre del taxón para generar una etiqueta, pero aparte de eso, es libre de
  elegir lo que desee.
</p>
<p>
  Para las etiquetas de herbario, también puede incluir campos como 'dups' para listar las instituciones
  donde se depositan los duplicados, e 'additionalCollectors', así como campos de número/código de familia
  y género si los desea para fines de archivo.
</p>
<p>
  Para las etiquetas de insectos, puede incluir un campo llamado 'shortLocality' para una forma abreviada
  de la localidad para imprimir en la etiqueta (las etiquetas de insectos tienen serias limitaciones de espacio).
  Este campo debe incluir todo, desde el país hasta la localidad específica como le gustaría que apareciera
  en la etiqueta, pero no las coordenadas ni los metadatos de las coordenadas, que van en su propia línea
  y deben ser mapeados a los campos de coordenadas de la etiqueta.
</p>

<h5>Campos de nombre del taxón</h5>
<p>
  Los nombres de los taxones se pueden almacenar de múltiples maneras en un conjunto de datos. La herramienta
  prioriza los nombres almacenados en campos de rango individuales, es decir, familia, género, especie, etc.
  (hasta subforma para plantas). Alternativamente, puede usar un solo campo para el nombre del taxón y
  almacenar el nombre identificado allí independientemente de su rango (se puede incluir un campo separado,
  taxonRank). También se recomienda incluir campos separados para el autor del taxón, calificadores, certeza,
  etc. También puede incluir observaciones de identificación, fuentes bibliográficas, etc.
</p>
<p>
  Los ejemplos y las reglas <a href="/name_examples" use:link>están disponibles aquí...</a>
</p>

<h5>El conjunto de datos de ejemplo</h5>
<p>
  El <a href={exampleDataURL} target="_blank">conjunto de datos de ejemplo</a> es una hoja de cálculo de
  Google que incluye campos que serán detectados por la herramienta y algunos registros de ejemplo.
  Tómese unos momentos para revisar los comentarios en los encabezados de los campos que describen
  cómo debe usarse cada campo. Le invitamos a hacer una copia de esta hoja para su propio uso (Archivo >> Hacer una copia).
</p>
<p>
  Para hacer etiquetas a partir de una hoja de cálculo de Google, primero debe descargar los datos en formato
  CSV. Vaya a Archivo >> Descargar y seleccione 'Valores separados por comas (.csv)'.
</p>
<p>
  La hoja de cálculo incluye un campo llamado 'print', que puede usarse para marcar y filtrar registros
  para imprimir.
  <a href="https://youtu.be/SYSevA4znlc?si=oO6e0d_pxyUikpEd" target="_blank"
    >Este video de 3 minutos</a
  >
  muestra cómo filtrar hojas de cálculo de Google. Para imprimir etiquetas solo para los registros filtrados,
  deberá copiarlos y pegarlos en una hoja de cálculo separada antes de descargar el archivo CSV. Desafortunadamente,
  Google Sheets exporta todo lo que hay en una hoja de cálculo, ignorando los filtros aplicados. Puede agregar
  tantas columnas de filtrado como necesite a su hoja de cálculo, como campos para la institución donde se depositan
  los especímenes y la fecha de depósito, para imprimir etiquetas para lotes de especímenes a medida que los deposita.
</p>

<h3>Etiquetas duplicadas</h3>
<p>
  Si desea etiquetas duplicadas para cada espécimen en una serie (por ejemplo, varios insectos de la misma especie
  recolectados juntos, o especímenes de herbario duplicados), deberá incluir un campo en su conjunto de datos con
  un conteo (llame al campo 'count' o 'specimenCount'). Si tiene un campo con conteos de especímenes por edad/sexo
  o un campo 'duplicates' (etiquetas de herbario), la herramienta intentará deducir los conteos a partir de ese campo
  si aún no tiene un campo de conteo.
</p>

<h3>Opciones de etiqueta</h3>
<p>
  Una vez que haya agregado sus datos, verá una lista de opciones para personalizar el diseño de sus etiquetas.
  Al hacer clic en el botón de imprimir, sus elecciones (y mapeos de campos) se guardarán para la próxima vez que desee
  imprimir etiquetas. Utilice un conjunto de datos pequeño para lograr el diseño de etiqueta adecuado antes de generar
  lotes grandes de etiquetas.
</p>
<p>
  <em>
    Le recomendamos que <strong>imprima una pequeña cantidad de etiquetas de prueba</strong> para verificar que su
    diseño funcione bien en papel antes de imprimir grandes lotes de etiquetas de especímenes reales.
  </em>
</p>

<h3>Impresión de etiquetas</h3>
<p>
  Al hacer clic en el botón de imprimir desde la pantalla de vista previa, el navegador abrirá el cuadro de diálogo
  de impresión estándar. Asegúrese de configurar el tamaño de página y los márgenes adecuadamente antes de imprimir.
  Puede imprimir directamente desde aquí o puede guardar las etiquetas como un archivo PDF para revisarlas e imprimirlas.
  Se recomienda utilizar la opción 'Guardar como PDF' en lugar de 'Microsoft Print to PDF', ya que esto ofrece mejores resultados.
</p>
<p>
  Para obtener pautas sobre cómo imprimir etiquetas de especímenes con calidad de archivo, consulte el
  <a
    href="https://nscf.org.za/resources/collections-management/"
    target="_blank">Manual de Gestión de Colecciones del NSCF</a
  >.
</p>

<h3>Comentarios, sugerencias y problemas</h3>
<p>
  Si tiene algún comentario o sugerencia, o si encuentra un error, cree un problema en la
  <a href="https://github.com/NSCF/SvelteSpecifyLabels/issues" target="_blank"
    >página de Github de esta herramienta</a
  >.
</p>

<h3>Agradecimientos</h3>
<p>
  Varios miembros de la comunidad del NSCF aportaron ideas y sugerencias sobre el diseño de las etiquetas,
  la disposición y la funcionalidad de esta herramienta.
</p>
<h5>Las traducciones fueron proporcionadas por:</h5>
<ul>
  <li>
    spa: Traducción automática (IA)
  </li>
  <li>
    afr: Adriaan Jordaan, Christiaan Steenkamp, Hester Steyn, Ian Engelbrecht
  </li>
  <li>zul: voluntarios bienvenidos</li>
</ul>
<p>
  Si desea contribuir con la traducción de un idioma para ampliar la variedad de idiomas en los que está disponible
  la herramienta, consulte las instrucciones
  <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank"
    >en la página de Github</a
  >, y cree un problema como se indica arriba si necesita asistencia técnica.
</p>
