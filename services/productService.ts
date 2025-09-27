export async function fetchLiveProducts(): Promise<any | null> {
  try {
    const res = await fetch('/api/products/live');
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.success && json?.data) return json.data;
    return null;
  } catch (err) {
    console.warn('[productService] Failed to fetch live products:', err.message ?? err);
    return null;
  }
}
