export function getLocalWishlist(): number[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('wishlist');
  return saved ? JSON.parse(saved) : [];
}

export function toggleLocalWishlist(bookId: number): number[] {
  if (typeof window === 'undefined') return [];
  const wishlist = getLocalWishlist();
  const index = wishlist.indexOf(bookId);
  const newWishlist = index === -1 ? [...wishlist, bookId] : wishlist.filter(id => id !== bookId);
  localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  return newWishlist;
}
