import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Color = {
  id: string;
  nom: string;
  code: string;
};

// Define a type for the slice state
interface ProductsState {
  colorSelection: Color;
  sizeSelection: string;
}

// Define the initial state using that type
const initialState: ProductsState = {
  colorSelection: {
    id: "",
    nom: "",
    code: "#4F4631",
  },
  sizeSelection: "L",
};

export const productsSlice = createSlice({
  name: "products",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setColorSelection: (state, action: PayloadAction<Color>) => {
      state.colorSelection = action.payload;
    },
    setSizeSelection: (state, action: PayloadAction<string>) => {
      state.sizeSelection = action.payload;
    },
  },
});

export const { setColorSelection, setSizeSelection } = productsSlice.actions;

export default productsSlice.reducer;
