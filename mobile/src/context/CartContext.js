import React, { createContext, useState, useCallback, useMemo } from 'react';

export const CartContext = createContext();

const findSizeKey = (sizeMap, querySize) => {
  if (!sizeMap || !querySize) return null;
  const query = String(querySize).trim().toLowerCase();
  const normalizedQuery = query.replace(/[^a-z0-9]/g, '');
  
  // Try exact match first
  for (const key of Object.keys(sizeMap)) {
    if (key.trim().toLowerCase() === query) return key;
  }
  
  // Try normalized match (e.g. "500l" vs "500l")
  for (const key of Object.keys(sizeMap)) {
    const normKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normKey === normalizedQuery) return key;
  }
  
  return null;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [activeDraftNo, setActiveDraftNo] = useState(null);

  const addToCart = useCallback((product, quantity = 1, size = '') => {
    const itemSize = String(size || '').trim();
    const matchedSizeKey = product.sizeProductCodes ? findSizeKey(product.sizeProductCodes, itemSize) : null;
    const matchedPackKey = product.packSizes ? findSizeKey(product.packSizes, itemSize) : null;
    const finalSize = itemSize; // Preserve exact selected size string

    setCartItems(prev => {
      // Strictly match both Product ID AND exact Size string
      const existingIdx = prev.findIndex(item => 
        (item.productId === product.id || item.productId === product.productId) &&
        String(item.size || '').trim().toLowerCase() === finalSize.toLowerCase()
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity
        };
        return updated;
      } else {
        const productCode = (matchedSizeKey && product.sizeProductCodes[matchedSizeKey])
          || (product.sizeProductCodes && product.sizeProductCodes[finalSize])
          || product.productCode || product.code || '';

        const packing = (matchedPackKey && product.packSizes[matchedPackKey])
          || (product.packSizes && product.packSizes[finalSize])
          || product.packing || product.packSize || '';

        return [
          ...prev,
          {
            productId: product.id || product.productId,
            productName: product.name || product.productName,
            image: product.image,
            categoryName: product.categoryName || '',
            subCategoryName: product.subCategoryName || product.subcategoryId || '',
            quantity: quantity,
            size: finalSize,
            productCode: productCode,
            packing: packing,
            uom: product.uom || 'Nos'
          }
        ];
      }
    });
  }, []);

  const updateQuantity = useCallback((productId, delta, size = '') => {
    const itemSize = String(size || '').trim().toLowerCase();
    setCartItems(prev => {
      return prev.map(item => {
        if (item.productId === productId && String(item.size || '').trim().toLowerCase() === itemSize) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  }, []);

  const removeFromCart = useCallback((productId, size = '') => {
    const itemSize = String(size || '').trim().toLowerCase();
    setCartItems(prev => prev.filter(item => 
      !(item.productId === productId && String(item.size || '').trim().toLowerCase() === itemSize)
    ));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setActiveDraftId(null);
    setActiveDraftNo(null);
  }, []);

  const loadDraft = useCallback((draft) => {
    if (!draft || !draft.items) return;
    const items = draft.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      image: item.image,
      categoryName: item.categoryName,
      subCategoryName: item.subCategoryName || '',
      quantity: item.quantity,
      size: item.size,
      productCode: item.productCode || '',
      packing: item.packing || '',
      uom: item.uom || 'Nos'
    }));
    setCartItems(items);
    setActiveDraftId(draft.id);
    setActiveDraftNo(draft.draftNo);
  }, []);

  const contextValue = useMemo(() => ({
    cartItems,
    activeDraftId,
    activeDraftNo,
    setActiveDraftId,
    setActiveDraftNo,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadDraft
  }), [cartItems, activeDraftId, activeDraftNo, addToCart, updateQuantity, removeFromCart, clearCart, loadDraft]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
