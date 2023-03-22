import * as Targets from "./pages/targets/reducers/targets.reducer"
import * as Tasks from "./pages/tasks/reducers/tasks.reducer";

export interface AppState {
  targets: Targets.State,
  tasks: Tasks.State
}