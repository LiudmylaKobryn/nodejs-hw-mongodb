import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNowExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNowExists(TEMP_UPLOAD_DIR),
    await createDirIfNowExists(UPLOAD_DIR);
  setupServer();
};

void bootstrap();
