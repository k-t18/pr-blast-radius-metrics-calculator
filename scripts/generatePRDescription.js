import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Output location
const outputDir = path.join(process.cwd(), '.github');
const outputFile = path.join(outputDir, 'pull-request-description.md');

// Create .github directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get current branch
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// Get last 20 commit messages for this branch
let commitMessages = '- No new commits';
try {
    commitMessages =
        execSync(`git log origin/${branch}..HEAD --pretty=format:"- %s"`, { stdio: ['pipe', 'pipe', 'ignore'] })
            .toString()
            .trim() || '- No new commits';
} catch {
    commitMessages = '- No new commits';
}

// Get changed files for this push
let changedFiles = [];
try {
    changedFiles = execSync(`git diff --name-only origin/${branch}..HEAD`, { stdio: ['pipe', 'pipe', 'ignore'] })
        .toString()
        .trim()
        .split('\n')
        .filter(f => f);
} catch {
    changedFiles = [];
}

// Get diff summary (added/removed lines)
let diffSummary = 'No diff available';
try {
    diffSummary = execSync(`git diff --stat origin/${branch}..HEAD`, { stdio: ['pipe', 'pipe', 'ignore'] })
        .toString()
        .trim();
} catch {
    diffSummary = 'No diff available';
}

// Generate auto title
const autoTitle = branch.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// MD template
const template = `
# 🔥 ${autoTitle}

## 📌 Summary
_This PR description was auto-generated based on committed files._

---

## 🧾 Commits Included
${commitMessages}

---

## 📂 Changed Files
${changedFiles.map(f => `- ${f}`).join('\n')}

---

## ✨ Diff Summary
\`\`\`
${diffSummary}
\`\`\`

---

## 🧪 How to Test
- Step 1:
- Step 2:
- Step 3:

---

Generated on **${new Date().toISOString()}**  
By **${process.env.USER || 'unknown'}**
`;

fs.writeFileSync(outputFile, template);

console.log('✅ Auto PR description created at:', outputFile);
