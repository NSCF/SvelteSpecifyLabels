// no return needed here
export default function(storageKey, settings) {
  const storedJSON = localStorage.getItem(storageKey)
	if (storedJSON) {
		const storedSettings = JSON.parse(storedJSON)
		for (const [key, val] of Object.entries(storedSettings)) {
			if (key in settings) {
				settings[key] = val
			}
		}
	}
}