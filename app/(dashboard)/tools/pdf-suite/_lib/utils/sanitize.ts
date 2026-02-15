export function sanitizeFilename(filename: string, defaultName: string = 'download.pdf'): string {
  // Remove restricted characters
  // eslint-disable-next-line no-control-regex
  const sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');

  // Trim whitespace and dots
  const trimmed = sanitized.trim().replace(/^\.+|\.+$/g, '');

  // Ensure non-empty
  if (!trimmed) {
    return defaultName;
  }

  // Limit length
  if (trimmed.length > 255) {
    const extIndex = trimmed.lastIndexOf('.');
    if (extIndex > -1) {
      const ext = trimmed.slice(extIndex);
      return trimmed.slice(0, 255 - ext.length) + ext;
    }
    return trimmed.slice(0, 255);
  }

  return trimmed;
}
