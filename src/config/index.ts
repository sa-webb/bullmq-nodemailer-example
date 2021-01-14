import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const connection = new IORedis();

export const sendMailQueue = new Queue('Hermes', { connection });
