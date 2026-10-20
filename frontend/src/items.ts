
export type ReportedItem = {
  id: string;
  type: 'lost' | 'found';
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  photoName: string;
  photoData: string;
  createdAt: string;
};

const STORAGE_KEY = 'findit-ai-reported-items';
const API_URL = 'http://localhost:5000/api/items';

export function getItems(): ReportedItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const items = JSON.parse(saved) as Partial<ReportedItem>[];

    return items.map((item) => ({
      ...item,
      photoName: item.photoName ?? '',
      photoData: item.photoData ?? '',
    })) as ReportedItem[];
  } catch {
    return [];
  }
}

export function saveItem(item: ReportedItem): void {
  const items = getItems();
  items.unshift(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
export async function saveItemToDatabase(
  item: ReportedItem
): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error('Unable to save item to database');
  }
}
export async function getItemsFromDatabase(): Promise<ReportedItem[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Unable to load items from database');
  }

  return response.json();
}
