import { Worker, Job } from "bullmq";
import { mockJob } from "../jobs/mockJob";
import sendMail from "../jobs/sendMail";
import connection from "../connection";

export const useWorker = new Worker(
  "worker1",
  async (job: Job) => {
    switch (job.name) {
      case "register":
        await sendMail(job.data.to, job.data.subject);
        break;
      case "forgotPassword":
        await sendMail(job.data.to, job.data.subject);
        break;
      case "mock1":
        mockJob(job.data);
        break;
      case "mock2":
        mockJob(job.data);
        break;
      default:
        throw new Error("Unknown Hermes type");
    }
  },
  { connection: connection.duplicate() }
);

export const messageWorker = new Worker(
  "worker2",
  async (job: Job) => {
    switch (job.name) {
      case "messageTest":
        mockJob(job.data);
        break;
      default:
        throw new Error("Unknown Hermes type");
    }
  },
  { connection: connection.duplicate() }
);

messageWorker.on("completed", (job: Job) => {
  console.log("completed from worker 2", job.id);
});
messageWorker.on("progress", (job: Job, progress: number | object) => {
  console.log("In Progess", job);
});

messageWorker.on("failed", (job: Job, failedReason: string) => {
  console.log("job failed", job);
});
