import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && entry.name.endsWith('.md') ? [path] : [];
  });
}

const paths = [
  ...readdirSync(root)
    .filter((name) => name.endsWith('.md'))
    .map((name) => join(root, name)),
  ...markdownFiles(join(root, 'docs')),
  ...markdownFiles(join(root, '.agents/skills')),
];

for (const path of paths) {
  const text = readFileSync(path, 'utf8');
  // Ignore examples inside fenced code, then check inline local file links.
  const prose = text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
  for (const match of prose.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#')) continue;
    const file = decodeURIComponent(target.split('#')[0]);
    if (!existsSync(resolve(dirname(path), file)))
      errors.push(`${path}: broken local link ${target}`);
  }
  if (basename(path) === 'SKILL.md') {
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
    if (!frontmatter) {
      errors.push(`${path}: missing skill frontmatter`);
      continue;
    }
    try {
      const metadata = parse(frontmatter[1]);
      if (metadata?.name !== basename(dirname(path)))
        errors.push(`${path}: skill name must match its directory`);
      if (
        typeof metadata?.description !== 'string' ||
        !metadata.description.trim()
      )
        errors.push(`${path}: missing skill description`);
    } catch (error) {
      errors.push(`${path}: invalid skill YAML: ${error.message}`);
    }
  }
}

// Parse workflow syntax as data; remote execution and project settings remain separate checks.
try {
  parse(readFileSync(join(root, '.github/workflows/quality.yml'), 'utf8'));
} catch (error) {
  errors.push(`Quality workflow: ${error.message}`);
}

if (errors.length) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    'Documentation links, skill metadata and workflow YAML validated.\n',
  );
}
