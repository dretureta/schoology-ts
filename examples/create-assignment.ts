#!/usr/bin/env npx tsx

/**
 * Create an assignment with due date
 * 
 * Usage:
 * COURSE_ID=456 npx tsx examples/create-assignment.ts
 * 
 * Environment variables:
 * - COURSE_ID (required): The course ID
 * - TITLE (optional): Assignment title, defaults to "Homework 1"
 * - POINTS (optional): Max points, defaults to 100
 * - DUE_DATE (optional): Due date as ISO string, defaults to +7 days
 */

import { SchoologyClient } from '../src/index.js';

const courseId = process.env.COURSE_ID || process.argv[2];

if (!courseId) {
  console.error('Usage: COURSE_ID=456 npx tsx examples/create-assignment.ts');
  process.exit(1);
}

async function main() {
  const client = new SchoologyClient({
    apiKey: process.env.SCHOOLOGY_API_KEY!,
    apiSecret: process.env.SCHOOLOGY_API_SECRET!,
  });

  const title = process.env.TITLE || 'Homework 1';
  const points = parseInt(process.env.POINTS || '100');
  const dueInDays = parseInt(process.env.DUE_IN_DAYS || '7');
  const dueDate = Date.now() + dueInDays * 24 * 60 * 60 * 1000;

  const assignment = await client.assignments.create(courseId, {
    title,
    description: 'Assignment created with schoology-ts',
    points,
    due_date: dueDate,
  });

  console.log(`✅ Assignment created:`);
  console.log(`   ID: ${assignment.id}`);
  console.log(`   Title: ${assignment.title}`);
  console.log(`   Points: ${assignment.points}`);
  console.log(`   Due: ${new Date(assignment.due_date!).toISOString()}`);
  console.log(`   Course: ${assignment.course_id}`);
}

main().catch(console.error);
