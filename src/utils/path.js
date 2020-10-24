const path = require('path');

// export the root dir (where server.js lives) for reference for other paths
const mainFilePath = require.main?.filename ? require.main?.filename : process.mainModule?.filename;

export const ROOT_DIR = path.dirname(mainFilePath);
