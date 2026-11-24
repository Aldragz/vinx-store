import { runDatabaseSeed } from '../src/lib/seed';

async function main() {
  console.log('Seeding Vinx Store database...');
  const result = await runDatabaseSeed();
  console.log('Seed result:', result);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
