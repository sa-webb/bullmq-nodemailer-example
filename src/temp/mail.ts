const Queue = require("bull");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class EmailQueue {
  queue: any;
  constructor() {
    // initialize queue
    this.queue = new Queue("marketplaceArrival");
    // add a worker
    this.queue.process("email", (job: any) => {
      this.sendEmail(job);
    });
  }
  addEmailToQueue(data: any) {
    this.queue.add("email", data);
  }
  async sendEmail(job: {
    data: { to: any; from: any; subject: any; text: any; html: any };
    moveToCompleted: (arg0: string, arg1: boolean) => void;
    moveToFailed: (arg0: { message: string }) => void;
  }) {
    const { to, from, subject, text, html } = job.data;
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };
    try {
      await sgMail.send(msg);
      job.moveToCompleted("done", true);
    } catch (error) {
      if (error.response) {
        job.moveToFailed({ message: "job failed" });
      }
    }
  }
}
