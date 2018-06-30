import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import Mustache from 'mustache';

type MailerConfiguration = {
  transport: {
    host: string,
    port: number,
    secure: string,
    auth: {
      user: string,
      pass: string
    }
  },
  templatesDir: string,
  sender: string
};

type EmailOptions = {
  to: string,
  from: string,
  subject: string,
  html: string,
  variables: Object,
  renderer?: Function
};

export default class Mailer {
  constructor(config: MailerConfiguration) {
    this.sender = config.sender;
    this.templatesDir = config.templatesDir;
    this.transporter = nodemailer.createTransport(config.transport);
    this.render = config.templateRenderer || Mustache.render;
  }

  parse(template: string, variables: Object): string {
    return this.render(template, variables);
  }

  readTemplate(template: string) {
    return fs.readFileSync(
      path.join(`${`${this.templatesDir}/${template}`}.html`),
      'UTF-8'
    );
  }

  send(options: EmailOptions) {
    try {
      return this.transporter.sendMail(options);
    } catch (e) {
      throw new Error('send failed'); // TODO create exception
    }
  }

  sendTemplate(template: string, options: EmailOptions) {
    const subject = this.parse(options.subject, options.variables);
    const rawTemplate = this.readTemplate(template);
    const html = this.parse(rawTemplate, options.variables);
    return this.send({ ...options, subject, html });
  }
}
