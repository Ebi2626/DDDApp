import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  TargetNotification,
  TaskNotification,
  getTargetNotifications,
  getTasksNotifications,
} from 'src/db/targets/getNotifications';
import {
  MailService,
  TargetReminderMail,
  TaskReminderMail,
} from 'src/mail/mail.service';
import { UserInfoService } from 'src/user-info/user-info.service';

export const NOTIFICATION_PERIODS = [
  'DAY',
  'WEEK',
  'TWO WEEK',
  'MONTH',
] as const;

export enum NOTIFICATION_PERIODS_ENUM {
  'DAY' = 'DAY',
  'WEEK' = 'WEEK',
  'TWO WEEK' = 'TWO WEEK',
  'MONTH' = 'MONTH',
}
export type NotificationPeriod = (typeof NOTIFICATION_PERIODS)[number];

@Injectable()
export class NotificationService {
  constructor(
    private mailService: MailService,
    private userInfoService: UserInfoService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendNotifications() {
    await this.sendTargetsNotifications();
    await this.sendTasksNotifications();
  }

  private async createTargetReminderObject({
    target,
  }: TargetNotification): Promise<TargetReminderMail> {
    const { name, email } = await this.userInfoService.getUserInfo(
      target['userId'],
    );
    return {
      name,
      targetTitle: target.title,
      targetDueDate: target.deadline,
      targetMotivation: target.motivation,
      subject: 'Zrób cel!',
      template: 'target-reminder',
      to: email,
    } as TargetReminderMail;
  }

  private async createTaskReminderObject({
    task,
  }: TaskNotification): Promise<TaskReminderMail> {
    const { name, email } = await this.userInfoService.getUserInfo(
      task['userId'],
    );
    return {
      name,
      taskTitle: task.title,
      taskDeadline: task.deadline,
      taskDescription: task.description,
      subject: 'Zrób zadanie!',
      template: 'task-reminder',
      to: email,
    };
  }

  private async sendTargetsNotifications() {
    for await (const period of NOTIFICATION_PERIODS) {
      const currentDateTime = new Date();
      const currentHour = currentDateTime.getHours();
      const targetNotifications = await getTargetNotifications(period);
      const curretnTargetNotifications: TargetNotification[] =
        targetNotifications.filter(
          ({ notificationTime: { hour } }) => hour === currentHour,
        );

      const mailsToSend = [];

      for (const targetNotification of curretnTargetNotifications) {
        const notification = await this.createTargetReminderObject(
          targetNotification,
        );
        mailsToSend.push(notification);
      }

      mailsToSend.forEach((mail) => {
        this.mailService.sendMail(mail);
      });
    }
  }

  private async sendTasksNotifications() {
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();
    const taskNotifications = await getTasksNotifications('WEEK');
    const currentTaskNotifications: TaskNotification[] =
      taskNotifications.filter(
        ({ notificationTime: { hour } }) => hour === currentHour,
      );

    const mailsToSend = [];

    for (const taskNotification of currentTaskNotifications) {
      const notification = await this.createTaskReminderObject(
        taskNotification,
      );
      mailsToSend.push(notification);
    }

    mailsToSend.forEach((mail) => {
      this.mailService.sendMail(mail);
    });
  }
}
