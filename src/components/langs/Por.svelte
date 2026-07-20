<script>
  import { link } from "svelte-spa-router";
  import exampleDataURL from "../../lib/exampleDataURL";
</script>

<h3>Visão geral</h3>
<p>
  Basta adicionar os registos dos seus espécimes com os campos padrão para
  localidade, data, nome do táxon, etc., selecionar o tipo de etiqueta
  pretendido e ajustar as definições conforme necessário. As etiquetas foram
  desenhadas para responder às necessidades da maioria dos tipos de coleções e
  cumprem as melhores práticas.
</p>

<h3 id="loading-data">Carregar os seus dados</h3>
<p>
  Comece por carregar um ficheiro CSV com os seus dados a partir da página
  inicial. <a
    href="https://en.wikipedia.org/wiki/Comma-separated_values"
    target="_blank">CSV</a
  >
  é o formato mais simples e seguro para a troca de dados entre sistemas. Eis
  <a href={exampleDataURL} target="_blank">um ficheiro de exemplo</a> que pode utilizar
  se ainda não tiver um.
</p>
<p>
  Se carregar o seu conjunto de dados e não vir nenhuma etiqueta, vá diretamente
  para os mapeamentos de campos e atualize-os. Isto deverá, pelo menos, dar-lhe
  um ponto de partida. Poderá depois editar os mapeamentos de campos
  manualmente, se necessário (ver Campos de dados abaixo).
</p>
<p>
  <em>
    Note que nenhuns dados dos espécimes são guardados ou enviados pela Internet
    ao utilizar esta ferramenta. O código-fonte está disponível no
    <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank"
      >GitHub</a
    > e pode ser verificado por quem saiba Javascript para confirmação.
  </em>
</p>

<h3>Campos de dados</h3>
<p>
  A ferramenta utiliza campos de dados padrão como localidade, data, nome do
  táxon, etc. e usa
  <a href="https://dwc.tdwg.org/terms/" target="_blank"
    >nomes de campos Darwin Core</a
  >
  tanto quanto possível. Quando carrega os seus dados, ferramenta faz o seu melhor
  para mapear os campos do seu conjunto de dados para os campos da etiqueta. Por
  exemplo, se tiver um campo chamado 'localityname', este será mapeado para 'locality'.
  A ideia é poder importar os seus dados utilizando os campos que tiver e que estes
  sejam reconhecidos pela ferramenta, evitando trabalho adicional.
</p>
<p>
  Se os seus campos não aparecerem na etiqueta, existe a opção de configurar os
  mapeamentos manualmente. Os campos podem ser incluídos ou excluídos conforme
  entender. Pode também consultar as definições dos termos Darwin Core na secção
  de mapeamento através das ligações fornecidas.
</p>
<p>
  Lembre-se de que os campos que inclui na etiqueta dependem de si. A ferramenta
  requer pelo menos um campo como localidade ou nome do táxon para gerar uma
  etiqueta, mas fora isso é livre de escolher o que desejar.
</p>
<p>
  Para etiquetas de herbário, pode também incluir campos como 'dups' para listar
  instituições onde as duplicatas são depositadas, e 'additionalCollectors', bem
  como campos de número/código de família e género se pretender esses dados para
  fins de arquivo.
</p>
<p>
  Para etiquetas de insetos, pode incluir um campo chamado 'shortLocality' para
  uma forma abreviada da localidade para impressão na etiqueta (as etiquetas de
  insetos têm sérias limitações de espaço). Este campo deve incluir tudo, desde
  o país até à localidade específica conforme pretendido na etiqueta, mas não as
  coordenadas ou metadados de coordenadas, que têm a sua própria linha e devem
  ser mapeados para os campos de coordenadas da etiqueta.
</p>

<h5>Campos do nome do táxon</h5>
<p>
  Os nomes dos táxons podem ser armazenados de várias formas num conjunto de
  dados. A ferramenta dá prioridade aos nomes armazenados em campos de categoria
  individuais, ou seja, família, género, espécie, etc. (até à subforma no caso
  de plantas). Alternativamente, pode utilizar um campo para o nome do táxon e
  armazenar aí o nome identificado, independentemente da sua categoria (pode ser
  incluído um campo separado, taxonRank). Recomenda-se também a inclusão de
  campos separados para o autor do táxon, qualificadores, certeza, etc. Pode
  ainda incluir observações de identificação, fontes bibliográficas, e assim por
  diante.
</p>
<p>
  Exemplos e regras <a href="/name_examples" use:link
    >estão disponíveis aqui...</a
  >
</p>

<h5>O conjunto de dados de exemplo</h5>
<p>
  O <a href={exampleDataURL} target="_blank">conjunto de dados de exemplo</a> é uma
  folha de cálculo do Google que inclui campos que serão identificados pela ferramenta
  e alguns registos de exemplo. Dispense alguns momentos para analisar os comentários
  nos cabeçalhos dos campos que descrevem como cada campo deve ser utilizado. Pode
  fazer uma cópia desta folha para seu uso próprio (Ficheiro >> Fazer uma cópia).
</p>
<p>
  Para fazer etiquetas a partir de uma folha de cálculo do Google, primeiro
  precisa de descarregar os dados no formato CSV. Vá a Ficheiro >> Transferir e
  selecione 'Valores separados por vírgulas (.csv)'.
</p>
<p>
  A folha de cálculo inclui um campo chamado 'print', que pode ser utilizado
  para sinalizar e filtrar registos para impressão.
  <a href="https://youtu.be/SYSevA4znlc?si=oO6e0d_pxyUikpEd" target="_blank"
    >Este vídeo de 3 minutos</a
  >
  mostra como filtrar folhas de cálculo do Google. Para imprimir etiquetas apenas
  de registos filtrados, terá de os copiar e colar numa folha de cálculo separada
  antes de descarregar o ficheiro CSV. Infelizmente, o Google Sheets exporta tudo
  numa folha de cálculo, ignorando quaisquer filtros aplicados. Pode adicionar tantas
  colunas de filtrado quantas necessitar à sua folha de cálculo, tais como campos
  para a instituição onde os espécimes são depositados e data de depósito, para impressão
  de etiquetas para lotes de espécimes à medida que os deposita.
</p>

<h3>Etiquetas duplicadas</h3>
<p>
  Se pretender etiquetas duplicadas para cada espécime de uma série (por
  exemplo, vários insetos da mesma espécie recolhidos juntos, ou duplicados de
  espécimes de herbário), terá de incluir um campo no seu conjunto de dados com
  uma contagem (chame ao campo 'count' ou 'specimenCount'). Se tiver um campo
  com contagens de espécimes por idade/sexo ou um campo 'duplicates' (etiquetas
  de herbário), a ferramenta tentará deduzir as contagens a partir desse campo,
  caso ainda não tenha um campo de contagem.
</p>

<h3>Opções de etiqueta</h3>
<p>
  Depois de adicionar os seus dados, verá uma lista de opções para personalizar
  o desenho das suas etiquetas. Ao clicar no botão de impressão, as suas
  escolhas (e mapeamentos de campos) serão guardadas para a próxima vez que
  pretender imprimir etiquetas. Utilize um conjunto de dados pequeno para
  acertar no desenho da etiqueta antes de gerar grandes lotes de etiquetas.
</p>
<p>
  <em>
    Recomendamos que <strong
      >imprima um número reduzido de etiquetas de teste</strong
    > para verificar se o seu desenho funciona bem no papel antes de imprimir grandes
    lotes de etiquetas reais.
  </em>
</p>

<h3>Salvar, exportar e importar configurações</h3>
<p>
  Todas as suas configurações de etiqueta e mapeamentos de campos são armazenados localmente no seu navegador para que suas preferências sejam lembradas na sua próxima visita. Nenhuma configuração ou dado é enviado para um servidor.
</p>
<p>
  Se você trabalha em vários computadores ou deseja compartilhar sua configuração de etiquetas com colegas, você pode usar os botões de exportação e importação no topo do painel de configurações para salvar suas configurações como um arquivo JSON e transferi-las.
</p>

<h3>Imprimir etiquetas</h3>
<p>
  Ao clicar no botão de impressão no ecrã de pré-visualização, o navegador
  abrirá a caixa de diálogo padrão de impressão. Certifique-se de que define o
  tamanho da página e as margens de forma adequada antes de imprimir. Pode
  imprimir diretamente a partir daqui ou guardar as etiquetas como um PDF para
  verificação e impressão. Recomenda-se a utilização da opção 'Guardar como PDF'
  em vez de 'Microsoft Print to PDF', pois esta oferece melhores resultados.
</p>
<p>
  Para orientações sobre a impressão de etiquetas de espécimes com qualidade de
  arquivo, consulte o
  <a
    href="https://nscf.org.za/resources/collections-management/"
    target="_blank">Manual de Gestão de Coleções do NSCF</a
  >.
</p>

<h3>Comentários, sugestões e problemas</h3>
<p>
  Se tiver quaisquer comentários ou sugestões, ou se detetar um erro, crie um
  problema na
  <a href="https://github.com/NSCF/SvelteSpecifyLabels/issues" target="_blank"
    >página do GitHub desta ferramenta</a
  >.
</p>

<h3>Agradecimentos</h3>
<p>
  Vários membros da comunidade do NSCF forneceram contributos e sugestões sobre
  o desenho, esquema e funcionalidade desta ferramenta.
</p>
<p>
  As traduções foram realizadas com recurso a IA e qualquer ajuda para as
  melhorar seria muito apreciada (com orientações fornecidas no <a
    href="https://github.com/NSCF/SvelteSpecifyLabels"
    target="_blank">GitHub</a
  >).
</p>
