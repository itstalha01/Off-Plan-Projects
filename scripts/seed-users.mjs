import { randomBytes, scryptSync } from "node:crypto";
import { nanoid } from "nanoid";
import { sql } from "@vercel/postgres";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Passwords are read from env (set them in .env.local, which is gitignored)
// rather than hardcoded here, since this script is committed to a public repo.
const USERS = [
  { username: "talha", password: requireEnv("SEED_TALHA_PASSWORD") },
  { username: "arslan", password: requireEnv("SEED_ARSLAN_PASSWORD") },
];

async function upsertUser(username, password) {
  const { rows: existing } = await sql`select id from users where username = ${username}`;
  if (existing.length > 0) {
    console.log(`user "${username}" already exists (${existing[0].id}) — skipping insert`);
    return existing[0].id;
  }

  const id = nanoid();
  const passwordHash = hashPassword(password);
  await sql`insert into users (id, username, password_hash) values (${id}, ${username}, ${passwordHash})`;
  console.log(`created user "${username}" (${id})`);
  return id;
}

const [talhaId, arslanId] = await Promise.all(
  USERS.map((u) => upsertUser(u.username, u.password))
);
void arslanId;

const { rowCount: unitsBackfilled } = await sql`
  update units set owner_id = ${talhaId} where owner_id is null
`;
console.log(`backfilled owner_id on ${unitsBackfilled} existing unit(s) -> talha`);

const { rowCount: sharesBackfilled } = await sql`
  update inventory_shares set owner_id = ${talhaId} where owner_id is null
`;
console.log(`backfilled owner_id on ${sharesBackfilled} existing share(s) -> talha`);
