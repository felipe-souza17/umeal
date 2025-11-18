export function formatOrderNumber(
  orderId: string | number,
  prefix: string = "OR"
): string {
  const numericId = orderId.toString().replace(/\D/g, "");
  const paddedId = numericId.padStart(4, "0");

  return `#${prefix.toUpperCase()}${paddedId}`;
}
