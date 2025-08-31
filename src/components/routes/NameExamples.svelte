<script>
  import getLabelDet from "../../lib/getLabelDet.js";

  let withItalics = false;
  let withAuthorship = false;

  const tests = [
    //scientificName
    {
      rule: "scientificName takes precedence over rank fields",
      infras: true,
      data: {
        scientificName: "Quercus robur L.",
        genus: "Quercus",
        species: "robustiorum",
        scientificNameAuthorship: "L.",
      },
    },
    {
      rule: "dwc:scientificName should not have qualifiers, but we can italicize around it anyway...",
      infras: true,
      data: {
        scientificName: "Quercus aff. robur L.",
        identificationQualifier: "aff.",
        scientificNameAuthorship: "L.",
      },
    },
    {
      rule: "Authorship will be added to scientificName, even though it should be there already...",
      infras: true,
      data: {
        scientificName: "Quercus robur",
        identificationQualifier: "aff.",
        scientificNameAuthorship: "L.",
      },
    },
    {
      rule: "But it's not added to verbatimIdentification, because we give you full control over what is printed there",
      infras: true,
      data: {
        verbatimIdentification: "Quercus robur",
        scientificNameAuthorship: "L.",
      },
    },
    {
      rule: "Verbatim identification will be italicized though",
      infras: true,
      data: {
        verbatimIdentification: "Quercus aff. robur",
        scientificNameAuthorship: "L.",
      },
    },
    {
      rule: "We can't italicize genera in scientificName because there's no way of knowing it's a genus and not a higher rank",
      infras: true,
      data: { scientificName: "Quercus sp." },
    },
    {
      rule: "...unless you provide a taxonRank",
      infras: true,
      data: { scientificName: "Quercus sp.", taxonRank: "genus" },
    },
    {
      rule: "You don't have to identify to species or genus level, any rank will do",
      infras: true,
      data: {
        scientificName: "Fagaceae",
        scientificNameAuthorship: "L.",
      },
    },
    {
      rule: "The simplest is to use 'atomic' fields",
      infras: true,
      data: {
        family: "Fagaceae",
        genus: "Quercus",
        species: "robur",
        scientificNameAuthorship: "L.",
      },
    },
    {
      rule: "...with a qualifier field if you have qualifiers",
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
      rule: "...and then we can add the 'sp.' for genera automatically",
      infras: true,
      data: { family: "Fagaceae", genus: "Quercus" },
    },
    {
      rule: "Remember that qualifiers and question marks are different things, but you can have both",
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
      rule: "For animals we don't include infraspecific ranks",
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
      rule: "But for plants we do, with authorship inserted in the correct place...",
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
      rule: "or...",
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
      rule: "And the qualifier is in front so it's not lost amongst the infraspecific ranks and epithets...",
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
      getLabelDet(x.data, withAuthorship, x.infras, withItalics)
    ));

  $: withAuthorship,
    (labelDets = tests.map((x) =>
      getLabelDet(x.data, withAuthorship, x.infras, withItalics)
    ));
</script>

<div
  style="height: 100vh; overflow:hidden; min-height:0; display:flex; flex-direction: column;"
>
  <div>
    <div
      style="display:flex; align-items: center; justify-content: space-between;"
    >
      <h3 class="">Name Rules</h3>
      <button class="btn" onclick="history.back()">Back</button>
    </div>
    <p style="font-size:0.8em">
      The rules that the label tool uses for forming and italicizing names are
      quite complex. Here are some examples to try and highlight how they work.
      The simplest is to either have 'atomic' fields in your dataset (family,
      genus, specificEpithet, qualifier, author, etc) or a full scientificName,
      taxonRank (if you have anything identified to the genus or subgenus level
      and want those italicized), qualifer, and author fields.
    </p>
    <input
      type="checkbox"
      name="withItalics"
      id="withItalics"
      bind:checked={withItalics}
    />
    <label for="withItalics">With Italics</label>

    <input
      type="checkbox"
      name="withAuthorship"
      id="withAuthorship"
      bind:checked={withAuthorship}
    />
    <label for="withAuthorship">With Authorship</label>
  </div>
  <div
    style="overflow: auto; flex-grow: 1; padding-right: 16px; display: flex; flex-direction: column; gap: 16px;"
  >
    {#each labelDets as labelDet, index}
      <div>
        <p style="margin:0;font-size:0.8em;font-weight:bold">
          {tests[index].rule}
        </p>
        <div style="display: flex; align-items: center; gap: 8px;">
          <pre
            style="margin:0;padding:0;width: 50%;display: inline-block;">{JSON.stringify(
              tests[index].data,
              null,
              2
            )}</pre>
          <span class="font-bold">{@html labelDet}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
