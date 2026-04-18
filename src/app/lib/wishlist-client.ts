const LEGACY_WISHLIST_KEY = 'wishlist';

export interface WishlistBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  color: string;
  rating?: number;
  stock: boolean;
}

export interface WishlistResponse {
  bookIds: number[];
  books: WishlistBook[];
  count: number;
}

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export function getLegacyWishlist(): number[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const saved = localStorage.getItem(LEGACY_WISHLIST_KEY);
  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map((value) => Number(value)).filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export function clearLegacyWishlist() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(LEGACY_WISHLIST_KEY);
}

export async function fetchWishlist(token: string): Promise<WishlistResponse> {
  const response = await fetch('/api/wishlist', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }

  const data = await response.json();
  return {
    bookIds: data.bookIds || [],
    books: data.books || [],
    count: data.count ?? 0,
  };
}

export async function syncLegacyWishlist(token: string): Promise<number[] | null> {
  const legacyBookIds = getLegacyWishlist();

  if (legacyBookIds.length === 0) {
    return null;
  }

  const response = await fetch('/api/wishlist', {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ bookIds: legacyBookIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to synchronize wishlist');
  }

  const data = await response.json();
  clearLegacyWishlist();
  return data.bookIds || [];
}

export async function addWishlistBook(token: string, bookId: number): Promise<number[]> {
  const response = await fetch('/api/wishlist', {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ bookId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add wishlist item');
  }

  const data = await response.json();
  return data.bookIds || [];
}

export async function removeWishlistBook(token: string, bookId: number): Promise<number[]> {
  const response = await fetch('/api/wishlist', {
    method: 'DELETE',
    headers: getHeaders(token),
    body: JSON.stringify({ bookId }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove wishlist item');
  }

  const data = await response.json();
  return data.bookIds || [];
}
