import path from 'path';

// export the root dir (where server.js lives) for reference for other paths
const mainFilePath: string = require.main?.filename
  ? (require.main?.filename as string)
  : (process.mainModule?.filename as string);

export const ROOT_DIR = path.dirname(mainFilePath);
