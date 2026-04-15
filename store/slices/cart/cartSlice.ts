import { createSlice } from "@reduxjs/toolkit";
import  { toast } from "react-toastify";
import type { Pass } from "@/types/Pass";
import type { BasketItem } from "../../../types/basketItemTypes";
import { set } from "zod";

const initialState = {
    isBasketOpen: false,
    items: [] as BasketItem[],
    totalQtyItems: 0,
    cartTotal:0,
};

const getCartItemsFromStorage = () => {
  if (typeof window === "undefined") {
    // SSR: no access to localStorage
    return initialState;
  }
  // Client-side: try to get from localStorage
  try {
    const storedCart = window.localStorage.getItem("cartState");

    if (!storedCart) return initialState;
    const parsed = JSON.parse(storedCart);
    const items: BasketItem[] = parsed.items ?? [];
    parsed.totalQtyItems = items.reduce((total: number, item: BasketItem) => total + item.quantity, 0);
    parsed.cartTotal = items.reduce((total: number, item: BasketItem) => total + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity, 0);
    return parsed;
  } catch {
    return initialState;
}
}

const cartSlice = createSlice({
    name: "cart",
    initialState: getCartItemsFromStorage(),
    reducers: {
      openBasketDrawer: (state) => {
        state.isBasketOpen = true;
      },
      closeBasketDrawer: (state) => {
        state.isBasketOpen = false;
      },
      addToCart: (state, action: { payload:Pass}) => {
        const product = action.payload;
        const itemIndex: number  = state.items.findIndex((item:BasketItem) => item.id == product.id);

        if (itemIndex >= 0) {
          state.items[itemIndex].quantity += 1;
          
        } else {
          state.items.push({ ...product, quantity: 1 });
        }
        cartSlice.caseReducers.calculateTotals(state);
        toast.success("Item added to cart");
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter((item: BasketItem) => item.id !== action.payload.id);
            cartSlice.caseReducers.calculateTotals(state);
            toast.info("Item removed from cart");
        },

        clearCart: (state, action: { payload: { showToast?: boolean } }) => {
            localStorage.removeItem("cartState");
            if (action.payload.showToast) {
                toast.info("Cart cleared");
            }
            return { ...initialState };
        },
        calculateTotals: (state) => {
          state.totalQtyItems = state.items.reduce((total: number, item:BasketItem) => total + item.quantity, 0);
          state.cartTotal = state.items.reduce((total: number, item:BasketItem) => total + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity, 0);          
          localStorage.setItem("cartState", JSON.stringify(state));
        }
    }
});


export const { openBasketDrawer, closeBasketDrawer,addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;