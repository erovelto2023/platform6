const RECENT_FILES_KEY = 'pdfcraft_recent_files';
const MAX_RECENT_FILES = 10;

export interface RecentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  date: number;
  toolSlug: string;
  toolName?: string;
}

export function getRecentFiles(): RecentFile[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(RECENT_FILES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse recent files', error);
    return [];
  }
}

export function addRecentFile(name: string, size: number, toolSlug: string, toolName?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const recentFiles = getRecentFiles();

    // Create new entry
    const newFile: RecentFile = {
      id: Date.now().toString(),
      name,
      size,
      type: 'pdf', // Assuming PDF for now
      date: Date.now(),
      toolSlug,
      toolName
    };

    // Add to beginning and remove duplicates (by name AND tool)
    const updated = [
      newFile,
      ...recentFiles.filter(f => !(f.name === name && f.toolSlug === toolSlug))
    ].slice(0, MAX_RECENT_FILES);

    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recent file', error);
  }
}

export function removeRecentFile(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const recentFiles = getRecentFiles();
    const updated = recentFiles.filter(f => f.id !== id);
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove recent file', error);
  }
}

export function clearRecentFiles(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RECENT_FILES_KEY);
}
