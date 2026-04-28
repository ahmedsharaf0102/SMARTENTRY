/**
 * Format a number as a currency price
 */
export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toPrecision(4);
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(2)}B`;
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(2)}K`;
  return volume.toFixed(2);
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Get action badge CSS class
 */
export function getActionClass(action: string): string {
  switch (action.toUpperCase()) {
    case 'BUY': return 'badge-buy';
    case 'WATCH': return 'badge-watch';
    case 'WAIT': return 'badge-wait';
    default: return '';
  }
}

/**
 * Get action color
 */
export function getActionColor(action: string): string {
  switch (action.toUpperCase()) {
    case 'BUY': return 'var(--accent-green)';
    case 'WATCH': return 'var(--accent-yellow)';
    case 'WAIT': return 'var(--accent-red)';
    default: return 'var(--text-secondary)';
  }
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
