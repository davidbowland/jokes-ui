#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'out', 'j')
const srcDir = path.join(outDir, '__placeholder__')
const destDir = path.join(outDir, '[id]')

function copyAndPatch(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  let html = fs.readFileSync(src, 'utf8')
  // Strip the placeholder param so the page reads the real ID from the URL at runtime
  html = html.replace('"id":"__placeholder__"', '')
  fs.writeFileSync(dest, html)
}

copyAndPatch(path.join(srcDir, 'index.html'), path.join(destDir, 'index.html'))

// Remove placeholder from out/ so it doesn't get uploaded to S3
fs.rmSync(srcDir, { recursive: true })

console.log('✓ Generated out/j/[id]/index.html')
