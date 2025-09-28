// IndexedDB Helper Functions for Product Caching
const DB_NAME = 'ProductsDB';
const STORE_NAME = 'products';
export const CACHE_DURATION = 604800000; // 7 Tage in ms

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveToDB = async (data: any): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: 'productsData', data, timestamp: Date.now() });
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

export const loadFromDB = async (): Promise<any | null> => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('productsData');
    return new Promise((resolve) => {
        request.onsuccess = () => {
            const result = request.result;
            if (result) {
                resolve({ data: result.data, timestamp: result.timestamp });
            } else {
                resolve(null);
            }
        };
        request.onerror = () => resolve(null);
    });
};