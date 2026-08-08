import path from "path";
import fs from "fs";

const outputFile = "project-structure.txt";

const ignoreFolders = [
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".vercel",
];

function generateTree(dir, prefix = "") {
  let result = "";

  const items = fs
    .readdirSync(dir)
    .filter((item) => !ignoreFolders.includes(item))
    .sort();

  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const isLast = index === items.length - 1;

    const connector = isLast ? "└── " : "├── ";

    result += prefix + connector + item + "\n";

    if (fs.statSync(fullPath).isDirectory()) {
      result += generateTree(fullPath, prefix + (isLast ? "    " : "│   "));
    }
  });

  return result;
}

const structure = generateTree(".");

fs.writeFileSync(outputFile, ".\n" + structure, "utf8");

console.log(`✅ Project structure generated: ${outputFile}`);
