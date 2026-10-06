/**
 * Formats a number into Indonesian Rupiah (e.g., Rp 1.899.000)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp').trim();
}

/**
 * Formats number to compact string (e.g. 1.2rb or 4.5M)
 */
export function formatCompact(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace('.0', '')}jt+`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace('.0', '')}rb+`;
  }
  return count.toString();
}

/**
 * Pads single digit with leading zero
 */
export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
