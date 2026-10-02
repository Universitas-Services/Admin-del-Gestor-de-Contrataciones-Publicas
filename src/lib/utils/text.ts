export function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '').trim();
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent?.trim() ?? '';
}

export function truncateText(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}
