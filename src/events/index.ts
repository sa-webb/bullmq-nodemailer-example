import { Job, QueueEvents } from "bullmq";
import { messegeQueue } from "../config";
import connection from "../connection";

import { useWorker as worker } from "../worker";

worker.on("completed", (job: Job) => {
  console.log("completed with data:", job.data);
  messegeQueue.add("messageTest", job.data);
});

worker.on("progress", (job: Job) => {
  console.log("In Progess", job.id);
});

worker.on("failed", (job: Job) => {
  console.log("job failed", job.failedReason);
});

const queueEvents = new QueueEvents("worker1", {
  connection: connection.duplicate(),
});

export const useGlobalEvents = () => {
  queueEvents.on("completed", (jobId: number) => {
    console.log("finished", jobId);
  });

  queueEvents.on("failed", (jobId: number, err) => {
    console.error("job", jobId, "error", err);
  });

  queueEvents.on("waiting", (jobId, err) => {
    console.error("job", jobId, "error", err);
  });
};
