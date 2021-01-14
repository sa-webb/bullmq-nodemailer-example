import { Worker, Job, QueueEvents } from "bullmq";
import sendMail from "./sendMail";
import { sendMailQueue, connection } from "./config";

sendMailQueue.add("register", { to: "bar@example.com", subject: "Welcome" });
sendMailQueue.add("forgotPassword", {
  to: "foo@example.com",
  subject: "Forgot Password",
});

const worker = new Worker(
  "Hermes",
  async (job) => {
    switch (job.name) {
      case "register":
        await sendMail(job.data.to, job.data.subject);
        break;
      case "forgotPassword":
        await sendMail(job.data.to, job.data.subject);
        break;
      default:
        throw new Error("Unknown Hermes type");
    }
  },
  { connection }
);

worker.on("completed", (job: Job, returnvalue: any) => {
  console.log("completed", job.data);
});

worker.on("progress", (job: Job, progress: number | object) => {
  console.log("In Progess", job);
});

worker.on("failed", (job: Job, failedReason: string) => {
  console.log("job failed", job.attemptsMade);
});

const queueEvents = new QueueEvents("Hermes", {
  connection: connection.duplicate(),
});

queueEvents.on("completed", (jobId) => {
  console.log("done painting", jobId);
});

queueEvents.on("failed", (jobId, err) => {
  console.error("error painting", err);
});

queueEvents.on("waiting", (jobId, err) => {
  console.error();
});
