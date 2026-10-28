export interface Config {
  productionUrl: string;
  testUrl: string;
}

// config.json is written on container start from the environment variables PRODUCTION_URL and TEST_URL
export async function loadConfig(): Promise<Config> {
  const response = await fetch('config.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Loading config.json failed: HTTP ${response.status}`);
  }
  const config = (await response.json()) as Partial<Config>;
  if (typeof config.productionUrl !== 'string' || typeof config.testUrl !== 'string') {
    throw new TypeError('config.json must contain productionUrl and testUrl');
  }
  return { productionUrl: config.productionUrl, testUrl: config.testUrl };
}
