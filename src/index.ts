import { sendMailQueue } from "./config";
import { useGlobalEvents } from "./events";
import { useWorker } from "./worker";

/** USE Nodemailer */
// sendMailQueue.add("register", { to: "bar@example.com", subject: "Welcome" });
// sendMailQueue.add("forgotPassword", {
//   to: "foo@example.com",
//   subject: "Forgot Password",
// });

sendMailQueue.add("mock1", { to: "bar@example.com", subject: "Welcome" });
sendMailQueue.add("mock2", { to: "bar2@example.com", subject: "Welcome2" });

try {
  useWorker;
  useGlobalEvents();
} catch (error) {
  console.error(error);
}
