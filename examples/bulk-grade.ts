#!/usr/bin/env npx tsx

/**
 * Bulk grade submissions
 * 
 * Usage:
 * ASSIGNMENT_ID=789 STUDENT_GRADES="1:95,2:87,3:92" npx tsx examples/bulk-grade.ts
 * 
 * Format for STUDENT_GRADES: "studentId1:points1,studentId2:points2,..."
 */

import { SchoologyClient } from '../src/index.js';

const assignmentId = parseInt(process.env.ASSIGNMENT_ID || process.argv[2] || '');
const gradesInput = process.env.STUDENT_GRADES || process.argv[3] || '';

if (!assignmentId || !gradesInput) {
  console.error('Usage: ASSIGNMENT_ID=789 STUDENT_GRADES="1:95,2:87" npx tsx examples/bulk-grade.ts');
  process.exit(1);
}

// Parse grades
const grades = gradesInput.split(',').map(pair => {
  const [studentId, points] = pair.split(':').map(s => s.trim());
  return { studentId: parseInt(studentId), points: parseFloat(points) };
});

async function main() {
  const client = new SchoologyClient({
    apiKey: process.env.SCHOOLOGY_API_KEY!,
    apiSecret: process.env.SCHOOLOGY_API_SECRET!,
  });

  console.log(`Grading ${grades.length} submissions for assignment ${assignmentId}...\n`);

  const results = [];

  for (const { studentId, points } of grades) {
    try {
      const grade = await client.grades.create({
        assignment_id: assignmentId,
        user_id: studentId,
        points,
        comment: 'Auto-graded with schoology-ts',
      });

      console.log(`  ✅ Student ${studentId}: ${points} points`);
      results.push({ studentId, points, success: true });
    } catch (error: any) {
      console.log(`  ❌ Student ${studentId}: ${error.message}`);
      results.push({ studentId, points, success: false, error: error.message });
    }
  }

  const passed = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${passed}/${results.length} graded successfully`);
}

main().catch(console.error);
