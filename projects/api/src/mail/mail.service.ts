import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
export interface MailCommon {
  from?: string;
  to: string;
  subject: string;
  template: string;
}

export interface TargetReminderMail extends MailCommon {
  name: string;
  targetTitle: string;
  targetDueDate: Date | string;
  targetMotivation: string;
}

export interface TaskReminderMail extends MailCommon {
  name: string;
  taskTitle: string;
  taskDeadline: Date | string;
  taskDescription: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendMail(context: TargetReminderMail | TaskReminderMail): void {
    this.mailerService
      .sendMail({
        to: context.to,
        from: context.from || 'noreply@nawigatorsukcesu.pl',
        subject: context.subject || 'Zrealizuj Cel!',
        template: context.template || 'target-reminder',
        context,
      })
      .then(() => {
        console.log('Mail sended successfully');
      })
      .catch((e) => {
        console.log('Mail not sended due to:');
        console.error(e);
      });
  }
}
