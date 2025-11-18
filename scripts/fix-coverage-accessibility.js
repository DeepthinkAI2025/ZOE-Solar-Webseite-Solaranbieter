import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fix accessibility issues in Jest HTML coverage reports
 * Replaces empty table headers with meaningful text content
 */
const fixCoverageAccessibility = () => {
  const coverageDir = path.join(__dirname, '../coverage/lcov-report');

  if (!fs.existsSync(coverageDir)) {
    console.log('❌ Coverage directory not found. Run tests with coverage first.');
    return;
  }

  console.log('🔧 Fixing accessibility issues in coverage reports...');

  const htmlFiles = [];

  function findHtmlFiles(dir) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findHtmlFiles(filePath);
        } else if (file.endsWith('.html')) {
          htmlFiles.push(filePath);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Warning: Could not read directory ${dir}:`, error.message);
    }
  }

  findHtmlFiles(coverageDir);

  if (htmlFiles.length === 0) {
    console.log('❌ No HTML files found in coverage directory.');
    return;
  }

  console.log(`📄 Found ${htmlFiles.length} HTML file(s) to fix`);

  let fixedFiles = 0;
  let totalFixedHeaders = 0;

  for (const htmlFile of htmlFiles) {
    try {
      let content = fs.readFileSync(htmlFile, 'utf8');
      const originalContent = content;

      // Fix empty table headers with descriptive text
      const fixes = [
        {
          pattern: /<th data-col="pic"[^>]*><\/th>/g,
          replacement: '<th data-col="pic" data-type="number" data-fmt="html" data-html="true" class="pic">Coverage Chart</th>'
        },
        {
          pattern: /<th data-col="statements_raw"[^>]*><\/th>/g,
          replacement: '<th data-col="statements_raw" data-type="number" data-fmt="html" class="abs">Statements (Total/Covered)</th>'
        },
        {
          pattern: /<th data-col="branches_raw"[^>]*><\/th>/g,
          replacement: '<th data-col="branches_raw" data-type="number" data-fmt="html" class="abs">Branches (Total/Covered)</th>'
        },
        {
          pattern: /<th data-col="functions_raw"[^>]*><\/th>/g,
          replacement: '<th data-col="functions_raw" data-type="number" data-fmt="html" class="abs">Functions (Total/Covered)</th>'
        },
        {
          pattern: /<th data-col="lines_raw"[^>]*><\/th>/g,
          replacement: '<th data-col="lines_raw" data-type="number" data-fmt="html" class="abs">Lines (Total/Covered)</th>'
        }
      ];

      // Apply all fixes
      for (const fix of fixes) {
        const matches = content.match(fix.pattern);
        if (matches) {
          content = content.replace(fix.pattern, fix.replacement);
          totalFixedHeaders += matches.length;
        }
      }

      // Only write file if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(htmlFile, content);
        fixedFiles++;
        console.log(`✅ Fixed accessibility in ${path.relative(process.cwd(), htmlFile)}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${htmlFile}:`, error.message);
    }
  }

  console.log(`\n🎉 Summary:`);
  console.log(`   📁 Files processed: ${htmlFiles.length}`);
  console.log(`   🔧 Files fixed: ${fixedFiles}`);
  console.log(`   🏷️  Headers fixed: ${totalFixedHeaders}`);

  if (fixedFiles > 0) {
    console.log(`\n✨ Accessibility issues have been resolved!`);
    console.log(`   📊 Coverage charts now have proper ARIA labels`);
    console.log(`   🖥️  Screen readers can now interpret table headers`);
  } else {
    console.log(`\nℹ️  No accessibility fixes were needed.`);
  }
};

// Run the fix
fixCoverageAccessibility();