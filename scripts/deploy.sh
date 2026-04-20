# Set shared secret and deploy gateway
pnpm --filter gateway exec wrangler secret put AGENT_SHARED_SECRET
pnpm --filter gateway run deploy # Takes a sec, pushes image

# Delete gateway
pnpm --filter gateway exec wrangler delete

# Make sure .env.production has VITE_WORKER_URL set
pnpm --filter web exec wrangler pages deploy dist --project-name history-of-js