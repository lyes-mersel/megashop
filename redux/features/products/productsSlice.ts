import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Color = {
  id: string;
  nom: string;
  code: string;
};

export type Size = {
  id: string;
  nom: string;
};

// Define a type for the slice state
interface ProductsState {
  colorSelection: Color;
  sizeSelection: Size;
}

// Define the initial state using that type
const initialState: ProductsState = {
  colorSelection: {
    id: "",
    nom: "",
    code: "",
  },
  sizeSelection: {
    id: "",
    nom: "",
  },
};

export const productsSlice = createSlice({
  name: "products",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    resetSelections: (state) => {
      state.sizeSelection = { id: "", nom: "" };
      state.colorSelection = { id: "", nom: "", code: "" };
    },
    setColorSelection: (state, action: PayloadAction<Color>) => {
      state.colorSelection = action.payload;
    },
    setSizeSelection: (state, action: PayloadAction<Size>) => {
      state.sizeSelection = action.payload;
    },
  },
});

export const { setColorSelection, setSizeSelection, resetSelections } =
  productsSlice.actions;

export default productsSlice.reducer;
