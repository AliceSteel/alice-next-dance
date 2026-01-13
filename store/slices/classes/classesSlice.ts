import { createSlice } from "@reduxjs/toolkit";
import { classes } from "@/data/classesData";
import { instructors } from "@/data/instructorsData";
import type { ClassesState, Category } from "./classesTypes";

const categoriesFromClasses: Category[] = classes.map((c) => ({
  id: c.id,
  title: c.title,
}));

const classesWithInstructors = classes.map((classItem) => {
  const instructorForClass = instructors.find(
    (instructor) => instructor.id === classItem.id
  );
  return {
    ...classItem,
    instructor: instructorForClass || undefined,
  };
});

const initialState: ClassesState = {
  items: classesWithInstructors,
  categories: categoriesFromClasses
};

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {  },
});

export const selectClasses = (state: { classes: ClassesState }) =>
  state.classes.items;

export const selectCategories = (state: { classes: ClassesState }) =>
  state.classes.categories;

export const selectClassById =
  (id: string) =>
  (state: { classes: ClassesState }) =>
    state.classes.items.find((c) => c.id === id);

export default classesSlice.reducer;