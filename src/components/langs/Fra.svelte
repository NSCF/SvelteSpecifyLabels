<script>
  import { link } from "svelte-spa-router";
  import exampleDataURL from "../../lib/exampleDataURL";
</script>

<h3>Aperçu</h3>
<p>
  Ajoutez simplement vos enregistrements de spécimens avec les champs standards pour la localité, la date,
  le nom du taxon, etc., sélectionnez le type d'étiquette souhaité et ajustez les paramètres si nécessaire. Les
  étiquettes ont été conçues pour répondre aux besoins de la plupart des types de collections et respectent
  les meilleures pratiques.
</p>

<h3>Chargement de vos données</h3>
<p>
  Commencez par charger un fichier CSV avec vos données depuis la page d'accueil. <a
    href="https://en.wikipedia.org/wiki/Comma-separated_values"
    target="_blank">CSV</a
  >
  est le format le plus simple et le plus sûr pour échanger des données entre systèmes. Voici
  <a href={exampleDataURL} target="_blank">un fichier d'exemple</a> que vous pouvez utiliser si
  vous n'en avez pas déjà un.
</p>
<p>
  Si vous chargez votre jeu de données et ne voyez aucune étiquette, allez directement aux correspondances de
  champs et actualisez-les. Cela devrait au moins vous donner un point de départ. Vous pourrez ensuite modifier
  manuellement les correspondances de champs si nécessaire (voir les champs de données ci-dessous).
</p>
<p>
  <em>
    Veuillez noter qu'aucune donnée de spécimen n'est stockée ou envoyée sur Internet lors de l'utilisation
    de cet outil. Le code source est
    <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank"
      >disponible sur Github</a
    > et peut être vérifié par toute personne connaissant le Javascript.
  </em>
</p>

<h3>Champs de données</h3>
<p>
  L'outil utilise des champs de données standards tels que la localité, la date, le nom du taxon, etc., et
  utilise autant que possible les <a href="https://dwc.tdwg.org/terms/" target="_blank"
    >noms de champs Darwin Core</a
  >.
  Lorsque vous chargez vos données, l'outil fait de son mieux pour associer les champs de votre jeu de données
  aux champs de l'étiquette. Par exemple, si vous avez un champ nommé 'localityname', il sera associé à
  'locality'. L'idée est de pouvoir importer vos données quel que soit le nom de vos champs d'origine afin qu'ils
  soient reconnus par l'outil, vous évitant ainsi un travail supplémentaire.
</p>
<p>
  Si vos champs n'apparaissent pas sur l'étiquette, vous avez la possibilité de configurer les correspondances
  manuellement. Les champs peuvent être inclus ou exclus selon vos préférences. Vous pouvez également consulter
  les définitions des termes Darwin Core dans la section de correspondance à l'aide des liens fournis.
</p>
<p>
  N'oubliez pas que vous êtes libre de choisir les champs à inclure sur l'étiquette. L'outil nécessite au
  moins un champ comme la localité ou le nom du taxon pour générer une étiquette, mais en dehors de cela,
  vous êtes libre de faire vos choix.
</p>
<p>
  Pour les étiquettes d'herbier, vous pouvez également inclure des champs comme 'dups' pour lister les institutions
  où les doubles sont déposés, et 'additionalCollectors', ainsi que des champs de numéro/code de famille et
  de genre si vous en avez besoin pour le classement.
</p>
<p>
  Pour les étiquettes d'insectes, vous pouvez inclure un champ appelé 'shortLocality' pour une forme abrégée
  de la localité à imprimer sur l'étiquette (les étiquettes d'insectes ont des contraintes d'espace très strictes).
  Ce champ doit inclure tous les éléments, du pays jusqu'à la localité spécifique, comme vous souhaitez les voir
  figurer sur l'étiquette, à l'exception des coordonnées ou de leurs métadonnées, qui ont leur propre ligne et
  doivent être associées aux champs de coordonnées de l'étiquette.
</p>

<h5>Champs de nom de taxon</h5>
<p>
  Les noms de taxons peuvent être stockés de multiples manières dans un jeu de données. L'outil donne la priorité
  aux noms stockés dans des champs de rang individuels, c'est-à-dire famille, genre, espèce, etc. (jusqu'à la
  sous-forme pour les plantes). Vous pouvez également utiliser un seul champ pour le nom du taxon et y stocker
  le nom identifié quel que soit son rang (un champ distinct, taxonRank, peut être inclus). Il est également
  recommandé d'inclure des champs distincts pour l'auteur du taxon, les qualificatifs, la certitude, etc.
  Vous pouvez également inclure des remarques d'identification, des sources bibliographiques, etc.
</p>
<p>
  Des exemples et des règles <a href="/name_examples" use:link>sont disponibles ici...</a>
</p>

<h5>Le jeu de données d'exemple</h5>
<p>
  Le <a href={exampleDataURL} target="_blank">jeu de données d'exemple</a> est une feuille Google Sheets
  qui comprend des champs qui seront reconnus par l'outil et quelques exemples d'enregistrements. Prenez quelques
  instants pour lire les commentaires dans les en-têtes de colonnes décrivant comment utiliser chaque champ.
  Vous pouvez faire une copie de cette feuille pour votre propre usage (Fichier >> Créer une copie).
</p>
<p>
  Pour générer des étiquettes à partir d'une feuille Google Sheets, vous devez d'abord télécharger les données
  au format CSV. Allez dans Fichier >> Télécharger, et sélectionnez 'Valeurs séparées par des virgules (.csv)'.
</p>
<p>
  La feuille de calcul comprend un champ appelé 'print', qui peut être utilisé pour marquer et filtrer les
  enregistrements à imprimer.
  <a href="https://youtu.be/SYSevA4znlc?si=oO6e0d_pxyUikpEd" target="_blank"
    >Cette vidéo de 3 minutes</a
  >
  montre comment filtrer dans Google Sheets. Pour imprimer uniquement les étiquettes des enregistrements
  filtrés, vous devrez les copier et les coller dans une feuille de calcul distincte avant de télécharger
  le fichier CSV. Malheureusement, Google Sheets exporte l'intégralité de la feuille, ignorant les filtres
  appliqués. Vous pouvez ajouter autant de colonnes de filtrage que nécessaire à votre feuille de calcul, comme
  des champs pour l'institution de dépôt des spécimens ou la date de dépôt, afin d'imprimer les étiquettes
  par lots lors des dépôts.
</p>

<h3>Étiquettes en double</h3>
<p>
  Si vous souhaitez obtenir des étiquettes en double pour chaque spécimen d'une série (par exemple, plusieurs
  insectes de la même espèce collectés ensemble, ou des spécimens d'herbier en double), vous devrez inclure
  un champ dans votre jeu de données contenant un nombre (appelez ce champ 'count' ou 'specimenCount'). Si vous
  disposez d'un champ avec le nombre de spécimens par âge/sexe ou d'un champ 'duplicates' (etiquettes d'herbier),
  l'outil tentera de déduire le nombre à partir de ce champ, si vous n'avez pas déjà de champ de comptage dédié.
</p>

<h3>Options d'étiquette</h3>
<p>
  Une fois vos données ajoutées, vous verrez une liste d'options pour personnaliser la conception de vos
  étiquettes. Lorsque vous cliquez sur le bouton d'impression, vos choix (et correspondances de champs) seront
  enregistrés pour la prochaine fois. Utilisez un petit jeu de données pour finaliser la conception de
  l'étiquette avant de générer de grands lots.
</p>
<p>
  <em>
    Nous vous recommandons d'<strong>imprimer un petit nombre d'étiquettes de test</strong> pour vérifier que
    votre conception rend bien sur papier avant d'imprimer de grands lots d'étiquettes réelles.
  </em>
</p>

<h3>Impression des étiquettes</h3>
<p>
  Lorsque vous cliquez sur le bouton d'impression depuis l'écran d'aperçu, le navigateur ouvre la boîte de
  dialogue d'impression standard. Veillez à configurer correctement la taille de la page et les marges avant
  d'imprimer. Vous pouvez soit imprimer directement à partir d'ici, soit enregistrer les étiquettes au format
  PDF pour vérification et impression. Il est recommandé d'utiliser l'option 'Enregistrer au format PDF' plutôt
  que 'Microsoft Print to PDF' car cela donne de meilleurs résultats.
</p>
<p>
  Pour obtenir des directives sur l'impression d'étiquettes de spécimens de qualité archivistique, veuillez consulter le
  <a
    href="https://nscf.org.za/resources/collections-management/"
    target="_blank">Manuel de gestion des collections du NSCF</a
  >.
</p>

<h3>Commentaires, suggestions et problèmes</h3>
<p>
  Si vous avez des commentaires ou des suggestions, ou si vous rencontrez un bug, veuillez créer un ticket sur la
  <a href="https://github.com/NSCF/SvelteSpecifyLabels/issues" target="_blank"
    >page GitHub de cet outil</a
  >.
</p>

<h3>Remerciements</h3>
<p>
  Plusieurs membres de la communauté du NSCF ont fourni des suggestions et des retours sur la conception,
  la mise en page et les fonctionnalités de cet outil.
</p>
<h5>Les traductions ont été fournies par :</h5>
<ul>
  <li>
    fra: Traduction automatique (IA)
  </li>
  <li>
    afr: Adriaan Jordaan, Christiaan Steenkamp, Hester Steyn, Ian Engelbrecht
  </li>
  <li>zul: volontaires bienvenus</li>
</ul>
<p>
  Si vous souhaitez contribuer à une traduction pour élargir la gamme de langues disponibles, veuillez consulter les
  instructions sur la <a href="https://github.com/NSCF/SvelteSpecifyLabels" target="_blank">page GitHub</a>,
  et créer un ticket comme indiqué ci-dessus si vous avez besoin d'aide technique.
</p>
