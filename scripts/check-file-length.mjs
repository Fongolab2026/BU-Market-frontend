import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Vérifie qu'aucun fichier source ne dépasse la limite convenue (500 lignes).
 * Usage : npm run check:lines
 */
const MAX_LINES = 500
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
const EXTENSIONS = new Set(['.js', '.jsx', '.css'])

const files = []

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(fullPath)
    else if (EXTENSIONS.has(path.extname(entry.name))) files.push(fullPath)
  }
}

walk(ROOT)

const countLines = (content) => {
  if (!content) return 0
  const newlines = (content.match(/\n/g) || []).length
  return content.endsWith('\n') ? newlines : newlines + 1
}

const oversized = files
  .map((file) => ({
    file: path.relative(process.cwd(), file),
    lines: countLines(fs.readFileSync(file, 'utf8')),
  }))
  .filter(({ lines }) => lines > MAX_LINES)
  .sort((a, b) => b.lines - a.lines)

if (oversized.length > 0) {
  console.error(`\n✗ ${oversized.length} fichier(s) dépassent ${MAX_LINES} lignes :\n`)
  for (const { file, lines } of oversized) console.error(`  ${lines}  ${file}`)
  console.error('\nDécoupez ces fichiers avant de committer.\n')
  process.exit(1)
}

console.log(`✓ ${files.length} fichiers vérifiés, aucun ne dépasse ${MAX_LINES} lignes.`)
