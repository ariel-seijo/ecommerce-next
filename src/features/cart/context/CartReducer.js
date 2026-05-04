export const initialState = [];

export const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const productExists = state.find(
                (item) => item.id === action.payload.id
            );

            if (productExists) {
                return state.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...state, { ...action.payload, quantity: 1 }];
        }

        case "INCREASE_QUANTITY":
            return state.map((item) =>
                item.id === action.payload
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
