import { Queue } from "bullmq";

import connection from "../connection";

export const sendMailQueue = new Queue("worker1", { connection });

export const messegeQueue = new Queue("worker2", {
  connection: connection.duplicate(),
});
