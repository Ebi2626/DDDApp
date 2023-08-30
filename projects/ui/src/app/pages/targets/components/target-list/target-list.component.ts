import { Component, Input } from "@angular/core";
import { Target, Task, TargetStateClass, Category } from "dddapp-common";
import { TargetsService } from "../../services/targets.service";
import { TargetProgressService } from "../../services/targetProgress.service";
import { DateTime } from "luxon";
import { ActivatedRoute } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: 'dddapp-target-list[targets][tasks][categories]',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.scss'],
})
export class TargetListComponent {
  TargetStateClass = TargetStateClass;
  @Input() targets?: Target[] | null;
  @Input() tasks?: Task[] | null;
  @Input() categories: Category[] = [];
  @Input() onDashboard: boolean = false;

  openElementIndex?: number;
  constructor(
    public targetsService: TargetsService,
    private progressService: TargetProgressService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(){
    this.route.queryParams
    .pipe(
      filter((params) => params['id'])
    )
    .subscribe((params) => {
      const indexOfTask = this.tasks?.findIndex((task) => task.id === params['id']);
      this.openElement(indexOfTask as number);
    })
  }

  getTargetTasks(target: Target, tasks: Task[]): Task[] {
    const filteredTargetTasks = tasks.filter((task) => target.tasks?.includes(task.id));
    if(this.onDashboard) {
      const now = DateTime.now();
      return filteredTargetTasks.filter((task) => !task.completed && DateTime.fromISO(`${task.deadline}`) > now);
    }
      return filteredTargetTasks;
  }

  getTargetProgress(target: Target, tasks: Task[]): number {
    return this.progressService.getTargetProgress(target, tasks);
  }

  openElement(elementIndex: number) {
    this.openElementIndex === elementIndex
      ? this.openElementIndex = undefined
      : this.openElementIndex = elementIndex;
  }

  trackById(_: any, { id }: Target) {
    return id;
  }
}
