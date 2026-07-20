/**
 * Utility functions for saving, exporting, importing, and reconciling label settings.
 */

/**
 * Saves current settings to localStorage.
 */
export function saveSettings(
  appSettings,
  generalLabelSettings,
  herbariumLabelSettings,
  entoLabelSettings,
  fieldMappings
) {
  localStorage.setItem("appSettings", JSON.stringify(appSettings));
  localStorage.setItem(
    "generalLabelSettings",
    JSON.stringify(generalLabelSettings)
  );
  localStorage.setItem(
    "herbariumLabelSettings",
    JSON.stringify(herbariumLabelSettings)
  );
  localStorage.setItem(
    "entoLabelSettings",
    JSON.stringify(entoLabelSettings)
  );
  localStorage.setItem("fieldMappings", JSON.stringify(fieldMappings));
}

/**
 * Normalizes label type string for comparison.
 */
export function normalizeLabelType(type) {
  if (!type || typeof type !== "string") return null;
  const t = type.toLowerCase().trim();
  if (t === "herbarium" || t === "plant" || t === "plants") return "herbarium";
  if (t === "general" || t === "wet") return "general";
  if (t === "insect" || t === "ento" || t === "entomology") return "insect";
  return t;
}

/**
 * Exports current settings to a JSON file download.
 */
export function exportSettings(
  appSettings,
  generalLabelSettings,
  herbariumLabelSettings,
  entoLabelSettings,
  fieldMappings
) {
  const currentType = appSettings.labelType || "general";
  const exportData = {
    labelType: currentType,
    appSettings: appSettings,
    generalLabelSettings: generalLabelSettings,
    herbariumLabelSettings: herbariumLabelSettings,
    entoLabelSettings: entoLabelSettings,
    fieldMappings: fieldMappings,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentType}-label-settings.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Updates a Svelte store resiliently using an imported object.
 * Only keys present in the target store's current state will be updated.
 * Missing keys in sourceData are preserved.
 * Extra/unknown keys in sourceData are ignored.
 */
export function reconcileStore(store, sourceData) {
  if (!sourceData || typeof sourceData !== "object") return;
  store.update((currentObj) => {
    const updatedObj = { ...currentObj };
    for (const key of Object.keys(updatedObj)) {
      if (
        Object.prototype.hasOwnProperty.call(sourceData, key) &&
        sourceData[key] !== undefined
      ) {
        updatedObj[key] = sourceData[key];
      }
    }
    return updatedObj;
  });
}

/**
 * Imports settings from a parsed JSON object.
 * Validates label type against current label type.
 * Reconciles settings stores resiliently.
 */
export function importSettings(
  importedData,
  appSettingsStore,
  generalStore,
  herbariumStore,
  entoStore,
  mappingsStore,
  currentLabelType
) {
  if (!importedData || typeof importedData !== "object") {
    return {
      success: false,
      error: "Invalid JSON format: expected an object.",
    };
  }

  const normalizedCurrentType = normalizeLabelType(currentLabelType);

  // Determine imported label type
  let importedTypeStr =
    importedData.labelType || importedData.appSettings?.labelType;

  let importedType = normalizeLabelType(importedTypeStr);

  if (!importedType) {
    if (
      importedData.herbariumLabelSettings &&
      !importedData.generalLabelSettings &&
      !importedData.entoLabelSettings
    ) {
      importedType = "herbarium";
    } else if (
      importedData.entoLabelSettings &&
      !importedData.generalLabelSettings &&
      !importedData.herbariumLabelSettings
    ) {
      importedType = "insect";
    } else if (
      importedData.generalLabelSettings &&
      !importedData.herbariumLabelSettings &&
      !importedData.entoLabelSettings
    ) {
      importedType = "general";
    } else if (importedData.institutionName !== undefined) {
      importedType = "herbarium";
    } else if (
      importedData.borderForTypes !== undefined ||
      importedData.labelHeight !== undefined
    ) {
      importedType = "insect";
    } else if (
      importedData.includePunch !== undefined ||
      importedData.includeProject !== undefined
    ) {
      importedType = "general";
    }
  }

  // Type compatibility check
  if (importedType && importedType !== normalizedCurrentType) {
    const typeDisplayNames = {
      herbarium: "herbarium",
      general: "general",
      insect: "ento/insect",
    };
    const importedName = typeDisplayNames[importedType] || importedType;
    const currentName =
      typeDisplayNames[normalizedCurrentType] || normalizedCurrentType;

    return {
      success: false,
      error: `Cannot import ${importedName} settings for ${currentName} labels.`,
    };
  }

  // Reconcile label settings based on current label type
  if (normalizedCurrentType === "herbarium") {
    const source =
      importedData.herbariumLabelSettings ||
      importedData.labelSettings ||
      importedData.settings ||
      importedData;
    reconcileStore(herbariumStore, source);
  } else if (normalizedCurrentType === "insect") {
    const source =
      importedData.entoLabelSettings ||
      importedData.labelSettings ||
      importedData.settings ||
      importedData;
    reconcileStore(entoStore, source);
  } else {
    const source =
      importedData.generalLabelSettings ||
      importedData.labelSettings ||
      importedData.settings ||
      importedData;
    reconcileStore(generalStore, source);
  }

  // Optionally update appSettings if present
  if (importedData.appSettings) {
    reconcileStore(appSettingsStore, importedData.appSettings);
  }

  // Optionally update fieldMappings if present
  if (importedData.fieldMappings) {
    mappingsStore.update((currentMappings) => {
      const updated = { ...currentMappings };
      if (importedData.fieldMappings[normalizedCurrentType]) {
        updated[normalizedCurrentType] = {
          ...(updated[normalizedCurrentType] || {}),
          ...importedData.fieldMappings[normalizedCurrentType],
        };
      } else if (
        typeof importedData.fieldMappings === "object" &&
        !importedData.fieldMappings.general &&
        !importedData.fieldMappings.herbarium &&
        !importedData.fieldMappings.insect
      ) {
        updated[normalizedCurrentType] = {
          ...(updated[normalizedCurrentType] || {}),
          ...importedData.fieldMappings,
        };
      }
      return updated;
    });
  }

  // Get current store values to persist to localStorage
  let currentAppSettings, currentGeneral, currentHerbarium, currentEnto, currentMappings;
  appSettingsStore.subscribe((val) => (currentAppSettings = val))();
  generalStore.subscribe((val) => (currentGeneral = val))();
  herbariumStore.subscribe((val) => (currentHerbarium = val))();
  entoStore.subscribe((val) => (currentEnto = val))();
  mappingsStore.subscribe((val) => (currentMappings = val))();

  saveSettings(
    currentAppSettings,
    currentGeneral,
    currentHerbarium,
    currentEnto,
    currentMappings
  );

  return { success: true };
}
