import dotenv from 'dotenv';
dotenv.config();

function ensureEnvVariables() {
  const requiredVariables = ['OPENROUTER_API_KEY', 'YOUR_SITE_URL', 'YOUR_SITE_NAME', 'YOUR_MODEL_AI'];
  const missingVariables = requiredVariables.filter(variable => !process.env[variable]);

  if (missingVariables.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingVariables.join(', ')}`);
    process.exit(1);
  }
}

ensureEnvVariables();

export default {
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  yourSiteUrl: process.env.YOUR_SITE_URL,
  yourSiteName: process.env.YOUR_SITE_NAME,
  yourModelAi: process.env.YOUR_MODEL_AI,
};