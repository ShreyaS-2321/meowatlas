export function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDistance(meters) {
  if (meters == null) return '-';
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatTag(tag) {
  return tag?.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
