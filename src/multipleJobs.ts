import { Queue, Worker, QueueEvents, Job } from "bullmq";

const myQueue = new Queue("Paint");

async function addJobs() {
  await myQueue.add("myJobName", { foo: "bar" });
  await myQueue.add("myJobName", { qux: "baz" });
}

async function aJ() {
  addJobs();
}

aJ();

const worker = new Worker("Paint", async (job: Job) => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  console.log(job.data);
});

worker.on("completed", (job: Job, returnvalue: any) => {
  console.log("completed");
});

worker.on("progress", (job: Job, progress: number | object) => {
  console.log("In Progess", job);
});

worker.on("failed", (job: Job, failedReason: string) => {
  console.log("job failed", job);
});

interface IActive {
  jobId: string;
  prev: string;
}

const queueEvents = new QueueEvents("Paint");

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on("active", ({ jobId, prev }: IActive) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on("progress", ({ jobId, data }, timestamp) => {
  console.log(`${jobId} reported progress ${data} at ${timestamp}`);
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});
