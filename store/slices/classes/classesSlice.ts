import { createSlice } from "@reduxjs/toolkit";
import type { ClassesState } from "./classesTypes";


const initialState: ClassesState = {
  items: [],
  categories: []
};

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {  },
});

export const selectClasses = (state: { classes: ClassesState }) => state.classes.items;

export const selectCategories = (state: { classes: ClassesState }) => state.classes.categories;

export const selectClassById =
  (id: string | number) =>
  (state: { classes: ClassesState }) =>
    state.classes.items.find((c) => c.id == id);

export default classesSlice.reducer;