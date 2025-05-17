// Redux
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type RemoveCartItem = {
  id: string;
  color: { id: string; name: string };
  size: { id: string; name: string };
};

export type CartItem = {
  id: string;
  name: string;
  imagePublicId: string;
  price: number;
  color: { id: string; name: string };
  size: { id: string; name: string };
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  totalQuantities: number;
};

// Define a type for the slice state
interface CartsState {
  cart: Cart | null;
  totalPrice: number;
  action: "update" | "add" | "delete" | null;
}

// Define the initial state using that type
const initialState: CartsState = {
  cart: null,
  totalPrice: 0,
  action: null,
};

export const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // initialize cart if empty
      if (!state.cart) {
        state.cart = {
          items: [action.payload],
          totalQuantities: action.payload.quantity,
        };
        state.totalPrice += action.payload.price * action.payload.quantity;
        return;
      }

      // find matching item by id, color and size
      const existing = state.cart.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.color.id === action.payload.color.id &&
          item.size.id === action.payload.size.id
      );

      if (existing) {
        state.cart.items = state.cart.items.map((item) => {
          if (
            item.id === action.payload.id &&
            item.color.id === action.payload.color.id &&
            item.size.id === action.payload.size.id
          ) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
            };
          }
          return item;
        });
        state.cart.totalQuantities += action.payload.quantity;
        state.totalPrice += action.payload.price * action.payload.quantity;
        return;
      }

      // add new item
      state.cart.items.push(action.payload);
      state.cart.totalQuantities += action.payload.quantity;
      state.totalPrice += action.payload.price * action.payload.quantity;
    },

    removeCartItem: (state, action: PayloadAction<RemoveCartItem>) => {
      if (!state.cart) return;

      const existing = state.cart.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.color.id === action.payload.color.id &&
          item.size.id === action.payload.size.id
      );
      if (!existing) return;

      state.cart.items = state.cart.items
        .map((item) => {
          if (
            item.id === action.payload.id &&
            item.color.id === action.payload.color.id &&
            item.size.id === action.payload.size.id
          ) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      state.cart.totalQuantities -= 1;
      state.totalPrice -= existing.price;
    },

    remove: (
      state,
      action: PayloadAction<RemoveCartItem & { quantity: number }>
    ) => {
      if (!state.cart) return;

      const existing = state.cart.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.color.id === action.payload.color.id &&
          item.size.id === action.payload.size.id
      );
      if (!existing) return;

      state.cart.items = state.cart.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.color.id === action.payload.color.id &&
            item.size.id === action.payload.size.id
          )
      );
      state.cart.totalQuantities -= existing.quantity;
      state.totalPrice -= existing.price * existing.quantity;
    },
  },
});

export const { addToCart, removeCartItem, remove } = cartsSlice.actions;

export default cartsSlice.reducer;
