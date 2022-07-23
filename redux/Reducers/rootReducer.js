import { combineReducers } from "redux";
import set_Notes from "./Notes";

const RootReducers = combineReducers({
  notes: set_Notes,
});
export default RootReducers;
