import { createApp } from "./app";
import { env } from "./common/config";
import { connectMongo } from "./common/db";

async function bootstrap(): Promise<void> {
  await connectMongo();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

void bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
