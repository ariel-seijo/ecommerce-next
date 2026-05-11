export const initialState = [];

export const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const { product, quantity: addQty = 1 } = action.payload;
            const existingItem = state.find((item) => item.id === product.id);
            const existingQty = existingItem ? existingItem.quantity : 0;
            const stock = product.stock ?? 0;

            if (existingQty >= stock) return state;

            const newQty = Math.min(existingQty + addQty, stock);

            if (existingItem) {
                return state.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: newQty }
                        : item
                );
            }
            return [...state, { ...product, quantity: newQty }];
        }

        case "INCREASE_QUANTITY":
            return state.map((item) =>
                item.id === action.payload && item.quantity < item.stock
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

        case "DECREASE_QUANTITY":
            return state
                .map((item) =>
                    item.id === action.payload
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);

        case "REMOVE_FROM_CART":
            return state.filter(
                (item) => item.id !== action.payload
            );

        case "CLEAR_CART":
            return [];

        case "SET_CART":
            return action.payload;

        default:
            return state;
    }
};
