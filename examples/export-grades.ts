#!/usr/bin/env npx tsx

/**
 * Export course grades to CSV
 * 
 * Usage:
 * COURSE_ID=456 npx tsx examples/export-grades.ts > grades.csv
 */

import { SchoologyClient } from '../src/index.js';
import * as fs from 'fs';

const courseId = process.env.COURSE_ID || process.argv[2];

if (!courseId) {
  console.error('Usage: COURSE_ID=456 npx tsx examples/export-grades.ts [> grades.csv]');
  process.exit(1);
}

async function main() {
  const client = new SchoologyClient({
    apiKey: process.env.SCHOOLOGY_API_KEY!,
    apiSecret: process.env.SCHOOLOGY_API_SECRET!,
  });

  console.error('Fetching grades...');

  const grades: Array<{
    studentId: number;
    studentName: string;
    assignmentTitle: string;
    points: number;
    percentage: number;
  }> = [];

  // Get all grades for the course
  for await (const grade of client.grades.listAll({ course_id: courseId })) {
    grades.push({
      studentId: grade.user_id,
      studentName: '', // Would need to fetch user separately
      assignmentTitle: `Assignment ${grade.assignment_id}`,
      points: grade.points || 0,
      percentage: grade.percentage || 0,
    });
  }

  // Output CSV
  const csv = [
    'Student ID,Assignment,Points,Percentage',
    ...grades.map(g => `${g.studentId},"${g.assignmentTitle}",${g.points},${g.percentage}%`)
  ].join('\n');

  if (process.stdout.isTTY) {
    // Interactive: show on terminal
    console.log(csv);
  } else {
    // Piped: write to file
    fs.writeFileSync('grades.csv', csv);
    console.error(`✅ Exported ${grades.length} grades to grades.csv`);
  }
}

main().catch(console.error);
