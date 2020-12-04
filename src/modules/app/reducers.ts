import { createReducer, createAction } from "@reduxjs/toolkit";
import { ICategory, ISubject } from "../../common/interface";

export interface IApp {
  subjectList: Array<ISubject>;
  category: Array<ICategory>;
}

const initialValue: IApp = {
  subjectList: [],
  category: [],
};

export const getSubjectList = createAction<Array<ISubject>>("GET_SUBJECT_LIST");
export const getCategory = createAction<ICategory>("GET_CATEGORY");

export default createReducer(initialValue, (builder) => {
  builder
    .addCase(getSubjectList, (state, action) => {
      state.subjectList = [...state.subjectList, ...action.payload];
    })
    .addCase(getCategory, (state, action) => {
      state.category = [...state.category, action.payload];
    });
});
