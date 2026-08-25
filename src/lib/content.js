import site from '../content/site.json';
import menu from '../content/menu.json';

export { site, menu };

/**
 * Values in site.json that the owner still has to confirm are marked with the
 * string PLACEHOLDER. Anything user-facing has to be able to ask about that,
 * so it never renders "PLACEHOLDER: 8-digit KVK number" to a visitor.
 */
export function isPlaceholder(value) {
	return typeof value !== 'string' || value.trim() === '' || value.includes('PLACEHOLDER');
}

/** The value, or null when it is still a placeholder. */
export function real(value) {
	return isPlaceholder(value) ? null : value;
}

export function fullAddress(business) {
	return `${business.street}, ${business.postcode} ${business.city}`;
}

/** Section 8: the address is a real link to both Google Maps and Apple Maps. */
export function mapLinks(business) {
	const query = encodeURIComponent(`${business.name}, ${fullAddress(business)}`);
	const { lat, lng } = business.coordinates;
	return {
		google: real(business.mapsUrl) ?? `https://www.google.com/maps/search/?api=1&query=${query}`,
		apple: `https://maps.apple.com/?q=${query}&ll=${lat},${lng}`,
	};
}
