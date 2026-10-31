import { createServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runLocalQA() {
  console.log('Starting Vite server for local QA test...');
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5179 },
  });
  await server.listen();
  console.log('Vite listening at http://localhost:5179');

  const qa = spawn('node', ['qa/run.mjs'], {
    env: {
      ...process.env,
      BASE_URL: 'http://localhost:5179',
      QA_OUT: 'evidence/stage-3-qa/local',
      BROWSER: 'chromium',
    },
    stdio: 'inherit',
  });

  qa.on('close', async (code) => {
    await server.close();
    console.log(`Local QA process exited with code ${code}`);
    process.exit(code);
  });
}

runLocalQA().catch((err) => {
  console.error(err);
  process.exit(1);
});
