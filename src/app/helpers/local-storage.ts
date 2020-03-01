let available: boolean = void 0;

export const isLocalStorageAvailable = (): boolean => {
	if (available !== void 0)
		return available;

	const localKey = 'isLocalStorageAvailable';
	const localValue = String((new Date()).getTime());

	try {
		localStorage.setItem(localKey, localValue);
		available = localStorage.getItem(localKey) === localValue;
		localStorage.removeItem(localKey);
	} catch (e) {
		// We all love an empty catch
	}

	return available;
}

export const getItem = <T = any>(key: string): T | null => {
	if (!isLocalStorageAvailable())
		return null;

	const value = localStorage.getItem(key);

	return value ? JSON.parse(value) : null;
}

export const removeItem = (key: string): void => {
	if (isLocalStorageAvailable())
		localStorage.removeItem(key);
}

export function setItem(key: string, value: any) {
	if (!isLocalStorageAvailable())
		return false;

	localStorage.setItem(key, JSON.stringify(value));

	return true;
}
