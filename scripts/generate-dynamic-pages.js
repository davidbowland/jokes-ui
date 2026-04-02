#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'out', 'j')
const srcDir = path.join(outDir, '__placeholder__')
const destDir = path.join(outDir, '[index]')

function copyAndPatch(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  let html = fs.readFileSync(src, 'utf8')
  // Remove index from __NEXT_DATA__ query so useRouter().query.index is undefined on first render
  html = html.replace('"index":"__placeholder__"', '')
  fs.writeFileSync(dest, html)
}

copyAndPatch(path.join(srcDir, 'index.html'), path.join(destDir, 'index.html'))

// Remove placeholder from out/ so it doesn't get uploaded to S3
fs.rmSync(srcDir, { recursive: true })

console.log('✓ Generated out/j/[index]/index.html')
