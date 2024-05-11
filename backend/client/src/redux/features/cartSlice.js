import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem("cartItems")) : [],
};

export const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        setCartItem: (state, action) => {
            const newItem = action.payload; // The new item to be added to the cart

            // Check if the item already exists in the cart
            const existingItemIndex = state.cartItems.findIndex(
                (item) => item.product === newItem.product
            );

            if (existingItemIndex !== -1) {
                // If the item already exists, update its quantity
                state.cartItems[existingItemIndex].quantity += newItem.quantity;
            } else {
                // If the item doesn't exist, add it to the cart
                state.cartItems.push(newItem);
            }

            // Update local storage with the updated cart items
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeCartItem:(state,action)=>{
            state.cartItems = state ?.cartItems?.filter(
                (i) => i.product !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        }
    },
});

export default cartSlice.reducer;
export const { setCartItem ,removeCartItem} = cartSlice.actions;
