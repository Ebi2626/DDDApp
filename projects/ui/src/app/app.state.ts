import * as Targets from "./pages/targets/reducers/targets.reducer"
import * as Tasks from "./pages/tasks/reducers/tasks.reducer";
import * as Categories from "./pages/categories/reducers/categories.reducer";

export interface AppState {
  targets: Targets.State,
  tasks: Tasks.State,
  categories: Categories.State
}
