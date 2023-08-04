import { AppState } from "src/app/app.state";
import { State } from "../reducers/query.reducer"


export const selectQueryState = (state: AppState): State => state.query;
