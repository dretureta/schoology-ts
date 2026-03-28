#!/usr/bin/env npx tsx

/**
 * List all students in a section
 * 
 * Usage: SECTION_ID=123 npx tsx examples/list-students.ts
 */

import { SchoologyClient } from '../src/index.js';

const sectionId = parseInt(process.env.SECTION_ID || '123');

async function main() {
  const client = new SchoologyClient({
    apiKey: process.env.SCHOOLOGY_API_KEY!,
    apiSecret: process.env.SCHOOLOGY_API_SECRET!,
  });

  console.log(`Fetching all students in section ${sectionId}...`);

  const students: string[] = [];
  let count = 0;

  for await (const user of client.users.listAll({ section_id: sectionId })) {
    if (user.role === 'student') {
      count++;
      students.push(`${user.display_name} (${user.email})`);
    }
  }

  console.log(`\nFound ${count} students:\n`);
  students.forEach(s => console.log(`  - ${s}`));
}

main().catch(console.error);
