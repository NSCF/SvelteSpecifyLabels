<script>
  import { t } from "../../i18n/lang";
  import getLabelDet from "../../lib/getLabelDet.js";

  let withItalics = false;
  let withAuthorship = false;

  const tests = [
    //scientificName
    {
      ruleKey: "rule1",
      defaultRule: "scientificName takes precedence over rank fields",
      infras: true,
      data: {
        scientificName: "Quercus robur L.",
        genus: "Quercus",
        species: "robustiorum",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule2",
      defaultRule: "dwc:scientificName should not have qualifiers, but we can italicize around it anyway...",
      infras: true,
      data: {
        scientificName: "Quercus aff. robur L.",
        identificationQualifier: "aff.",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule3",
      defaultRule: "Authorship will be added to scientificName, even though it should be there already...",
      infras: true,
      data: {
        scientificName: "Quercus robur",
        identificationQualifier: "aff.",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule4",
      defaultRule: "But it's not added to verbatimIdentification, because we give you full control over what is printed there",
      infras: true,
      data: {
        verbatimIdentification: "Quercus robur",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule5",
      defaultRule: "Verbatim identification will be italicized though",
      infras: true,
      data: {
        verbatimIdentification: "Quercus aff. robur",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule6",
      defaultRule: "We can't italicize genera in scientificName because there's no way of knowing it's a genus and not a higher rank",
      infras: true,
      data: { scientificName: "Quercus sp." },
    },
    {
      ruleKey: "rule7",
      defaultRule: "...unless you provide a taxonRank",
      infras: true,
      data: { scientificName: "Quercus sp.", taxonRank: "genus" },
    },
    {
      ruleKey: "rule8",
      defaultRule: "You don't have to identify to species or genus level, any rank will do",
      infras: true,
      data: {
        scientificName: "Fagaceae",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule9",
      defaultRule: "The simplest is to use 'atomic' fields",
      infras: true,
      data: {
        family: "Fagaceae",
        genus: "Quercus",
        species: "robur",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule10",
      defaultRule: "...with a qualifier field if you have qualifiers",
      infras: true,
      data: {
        family: "Fagaceae",
        genus: "Quercus",
        species: "robur",
        identificationQualifier: "aff.",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule11",
      defaultRule: "...and then we can add the 'sp.' for genera automatically",
      infras: true,
      data: { family: "Fagaceae", genus: "Quercus" },
    },
    {
      ruleKey: "rule12",
      defaultRule: "Remember that qualifiers and question marks are different things, but you can have both",
      infras: true,
      data: {
        family: "Fagaceae",
        genus: "Quercus",
        species: "robur",
        identificationQualifier: "aff.",
        identificationConfidence: "poor",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule13",
      defaultRule: "For animals we don't include infraspecific ranks",
      infras: false,
      data: {
        family: "Canidae",
        genus: "Canis",
        species: "lupus",
        subspecies: "familiaris",
        scientificNameAuthorship: "Linnaeus",
      },
    },
    {
      ruleKey: "rule14",
      defaultRule: "But for plants we do, with authorship inserted in the correct place...",
      infras: true,
      data: {
        family: "Fagaceae",
        genus: "Quercus",
        species: "robur",
        subspecies: "robur",
        variety: "robur",
        scientificNameAuthorship: "L.",
      },
    },
    {
      ruleKey: "rule15",
      defaultRule: "or...",
      infras: true,
      data: {
        family: "Fagaceae",
        genus: "Quercus",
        species: "robur",
        subspecies: "robur",
        variety: "gigantea",
        scientificNameAuthorship: "Schlip.",
      },
    },
    {
      ruleKey: "rule16",
      defaultRule: "And the qualifier is in front so it's not lost amongst the infraspecific ranks and epithets...",
      infras: true,
      data: {
        family: "Fagaceae",
        genus: "Quercus",
        species: "robur",
        subspecies: "robur",
        variety: "gigantea",
        identificationQualifier: "aff.",
        scientificNameAuthorship: "Schlip.",
      },
    },
  ];

  let labelDets = [];

  $: withItalics,
    (labelDets = tests.map((x) =>
      getLabelDet(x.data, withAuthorship, x.infras, withItalics),
    ));

  $: withAuthorship,
    (labelDets = tests.map((x) =>
      getLabelDet(x.data, withAuthorship, x.infras, withItalics),
    ));
</script>

<div class="h-screen overflow-hidden min-h-0 flex flex-col">
  <div>
    <div class="flex items-center justify-between">
      <h3 class="">{$t("nameRules", "Name Rules")}</h3>
      <button class="btn-secondary" onclick="history.back()"
        >{$t("back", "Back")}</button
      >
    </div>
    <p class="text-[0.8em]">
      {$t("nameRulesHelp", "The rules that the label tool uses for forming and italicizing names are quite complex. Here are some examples to try and highlight how they work. The simplest is to either have 'atomic' fields in your dataset (family, genus, specificEpithet, qualifier, author, etc) or a full scientificName, taxonRank (if you have anything identified to the genus or subgenus level and want those italicized), qualifer, and author fields.")}
    </p>
    <input
      type="checkbox"
      name="withItalics"
      id="withItalics"
      bind:checked={withItalics}
    />
    <label for="withItalics">{$t("withItalics", "With Italics")}</label>

    <input
      type="checkbox"
      name="withAuthorship"
      id="withAuthorship"
      bind:checked={withAuthorship}
    />
    <label for="withAuthorship">{$t("withAuthorship", "With Authorship")}</label>
  </div>
  <div class="overflow-auto flex-grow pr-[16px] flex flex-col gap-[16px]">
    {#each labelDets as labelDet, index}
      <div class="text-gray-500">
        <p class="m-0 text-[0.8em] font-bold">
          {$t(tests[index].ruleKey, tests[index].defaultRule)}
        </p>
        <div class="flex items-center gap-[8px]">
          <pre class="m-0 p-0 w-[50%] inline-block">{JSON.stringify(
              tests[index].data,
              null,
              2,
            )}</pre>
          <span class="font-bold">{@html labelDet}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
