"use client";

import { IoMdCheckmark } from "react-icons/io";

// redux
import {
  Color,
  setColorSelection,
} from "@/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const ColorSelection = ({ colors }: { colors: Color[] }) => {
  const { colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Choisissez la couleur
      </span>
      <div className="flex items-center flex-wrap space-x-3 sm:space-x-4">
        {colors.map((color, index) => (
          <div key={index} className="relative group">
            <button
              type="button"
              className="rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-gray-300"
              style={{ backgroundColor: color.code }}
              onClick={() => dispatch(setColorSelection(color))}
            >
              {colorSelection.nom === color.nom && (
                <IoMdCheckmark className="text-base text-white" />
              )}
            </button>
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              {color.nom}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSelection;
