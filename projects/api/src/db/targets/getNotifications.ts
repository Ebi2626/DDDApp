/* eslint-disable prettier/prettier */
import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import {
  NOTIFICATION_PERIODS_ENUM,
  NotificationPeriod,
} from 'src/notification/notification/notification.service';
import { DEFAULT_USER_SETTINGS } from '../../db/data/userSettings';
import { NotificationTime, Target, Task } from 'dddapp-common';

export interface NotificationPeriodRange {
  startOfPeriod: Date | string;
  endOfPeriod: Date | string;
}

export interface TargetNotification {
  target: Target;
  notificationTime: NotificationTime;
}

export interface TaskNotification {
  task: Task;
  notificationTime: NotificationTime;
}

const getNotificationsPerPeriod = async (period: NotificationPeriod): Promise<NotificationPeriodRange> => {
  const db = getConnection();

  const periodQueryResults = [];
  let periodResults;

  const dailyPeriodDates = aql`
    LET currentDate = DATE_NOW()
    LET currentDay = DATE_DAY(currentDate)
    LET currentMonth = DATE_MONTH(currentDate)
    LET currentYear = DATE_YEAR(currentDate)
    LET startOfPeriod = DATE_ISO8601(DATE_TIMESTAMP(currentYear, currentMonth, currentDay))
    LET nextDayDate = DATE_ADD(currentDate, 1, "day")
    LET nextDay = DATE_DAY(nextDayDate)
    LET nextDayMonth = DATE_MONTH(nextDayDate)
    LET nextDayYear = DATE_YEAR(nextDayDate)
    LET endOfPeriod = DATE_ISO8601(DATE_ADD(DATE_ADD(DATE_ADD(DATE_TIMESTAMP(nextDayYear, nextDayMonth, nextDay), 23, "hours"), 59, "minutes"), 59, "seconds"))
    RETURN { startOfPeriod, endOfPeriod }
  `;

  const weeklyPeriodDates = aql`
  LET currentDate = DATE_NOW()
  LET currentDay = DATE_DAY(currentDate)
  LET currentMonth = DATE_MONTH(currentDate)
  LET currentYear = DATE_YEAR(currentDate)
  LET startOfPeriod = DATE_ISO8601(DATE_TIMESTAMP(currentYear, currentMonth, currentDay))
  LET nextDayDate = DATE_ADD(currentDate, 1, "week")
  LET nextDay = DATE_DAY(nextDayDate)
  LET nextDayMonth = DATE_MONTH(nextDayDate)
  LET nextDayYear = DATE_YEAR(nextDayDate)
  LET endOfPeriod = DATE_ISO8601(DATE_ADD(DATE_ADD(DATE_ADD(DATE_TIMESTAMP(nextDayYear, nextDayMonth, nextDay), 23, "hours"), 59, "minutes"), 59, "seconds"))
    RETURN { startOfPeriod, endOfPeriod }
  `;

  const twoWeekPeriodDates = aql`
  LET currentDate = DATE_NOW()
  LET currentDay = DATE_DAY(currentDate)
  LET currentMonth = DATE_MONTH(currentDate)
  LET currentYear = DATE_YEAR(currentDate)
  LET startOfPeriod = DATE_ISO8601(DATE_TIMESTAMP(currentYear, currentMonth, currentDay))
  LET nextDayDate = DATE_ADD(currentDate, 2, "week")
  LET nextDay = DATE_DAY(nextDayDate)
  LET nextDayMonth = DATE_MONTH(nextDayDate)
  LET nextDayYear = DATE_YEAR(nextDayDate)
  LET endOfPeriod = DATE_ISO8601(DATE_ADD(DATE_ADD(DATE_ADD(DATE_TIMESTAMP(nextDayYear, nextDayMonth, nextDay), 23, "hours"), 59, "minutes"), 59, "seconds"))
  RETURN { startOfPeriod, endOfPeriod }
  `;

  const monthlyPeriodDates = aql`
  LET currentDate = DATE_NOW()
  LET currentDay = DATE_DAY(currentDate)
  LET currentMonth = DATE_MONTH(currentDate)
  LET currentYear = DATE_YEAR(currentDate)
  LET startOfPeriod = DATE_ISO8601(DATE_TIMESTAMP(currentYear, currentMonth, currentDay))
  LET nextDayDate = DATE_ADD(currentDate, 1, "month")
  LET nextDay = DATE_DAY(nextDayDate)
  LET nextDayMonth = DATE_MONTH(nextDayDate)
  LET nextDayYear = DATE_YEAR(nextDayDate)
  LET endOfPeriod = DATE_ISO8601(DATE_ADD(DATE_ADD(DATE_ADD(DATE_TIMESTAMP(nextDayYear, nextDayMonth, nextDay), 23, "hours"), 59, "minutes"), 59, "seconds"))
  RETURN { startOfPeriod, endOfPeriod }
  `;

  switch (period) {
    case NOTIFICATION_PERIODS_ENUM.DAY:
      periodResults = await db.query(dailyPeriodDates);
      break;
    case NOTIFICATION_PERIODS_ENUM.WEEK:
      periodResults = await db.query(weeklyPeriodDates);
      break;
    case NOTIFICATION_PERIODS_ENUM['TWO WEEK']:
      periodResults = await db.query(twoWeekPeriodDates);
      break;
    case NOTIFICATION_PERIODS_ENUM.MONTH:
      periodResults = await db.query(monthlyPeriodDates);
      break;
    default:
      throw new Error('Wrong period');
  }

  for await (const doc of periodResults) {
    periodQueryResults.push(doc);
  }

  const notificationPeriodRange =
    periodQueryResults[0] as NotificationPeriodRange;

  return notificationPeriodRange;
}

export const getTasksNotifications = async (period: NotificationPeriod): Promise<TaskNotification[]> => {
  const db = getConnection();
  const notificationPeriodRange = await getNotificationsPerPeriod(period);
  const getTaskNotificationsPerPeriod = async (
    periodRange: NotificationPeriodRange,
  ) => {
    const notificationTimeResults = [];
    const queryResult = await db.query(aql`
      WITH Settings, Tasks
      FOR Task in Tasks
       FILTER (Task.deadline <= ${periodRange.endOfPeriod} && Task.deadline > ${periodRange.startOfPeriod}) || ((Task.taskCompletions != null) && (Task.taskCompletions[*].dueDate <= ${periodRange.endOfPeriod} && Task.taskCompletions[*].dueDate > ${periodRange.startOfPeriod}))
       LET notificationTime = (FIRST(FOR Setting in Settings FILTER Setting.userId == Task.userId RETURN Setting.notificationTime))
       RETURN { task: Task, notificationTime: notificationTime || ${DEFAULT_USER_SETTINGS.notificationTime} }
    `);

    for await (const doc of queryResult) {
      notificationTimeResults.push(doc);
    }
    console.log(notificationTimeResults);
    return notificationTimeResults;
  };

  return await getTaskNotificationsPerPeriod(notificationPeriodRange);
}

export const getTargetNotifications = async (period: NotificationPeriod): Promise<TargetNotification[]> => {
  const db = getConnection();
  const notificationPeriodRange = await getNotificationsPerPeriod(period);

  const getTargetNotificationsPerPeriod = async (
    periodRange: NotificationPeriodRange,
  ) => {
    const notificationTimeResults = [];
    const queryResult = await db.query(aql`
      WITH Settings, Targets
      FOR Target in Targets
       FILTER Target.deadline <= ${periodRange.endOfPeriod} && Target.deadline > ${periodRange.startOfPeriod}
       LET notificationTime = (FIRST(FOR Setting in Settings FILTER Setting.userId == Target.userId RETURN Setting.notificationTime))
       RETURN { target: Target, notificationTime: notificationTime || ${DEFAULT_USER_SETTINGS.notificationTime} }
    `);

    for await (const doc of queryResult) {
      notificationTimeResults.push(doc);
    }
    return notificationTimeResults;
  };

  return await getTargetNotificationsPerPeriod(notificationPeriodRange);;
};
