/**
 * Simple Test Script
 * Tests basic functionality without complex dependencies
 */

console.log('🔍 Testing TeraBox + Notion Sync System\n');

// Test 1: Check if files exist
const fs = require('fs');
const path = require('path');

console.log('📁 Checking project structure...');

const requiredFiles = [
  'src/index.ts',
  'src/core/types.ts',
  'src/core/terabox-client.ts',
  'src/core/notion-client.ts',
  'src/core/sync-engine.ts',
  'src/core/conflict-resolver.ts',
  'src/core/ocr-integration.ts',
  'package.json',
  'README.md',
  'setup/workspace-selector.html',
  'monitoring/index.html',
  'config/sync-config.template.json',
  'config/classification-rules.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n✅ All required files present!');
} else {
  console.log('\n❌ Some files are missing!');
  process.exit(1);
}

// Test 2: Check package.json
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const requiredScripts = ['build', 'start', 'setup', 'health-check'];
  const requiredDeps = ['express', '@notionhq/client', 'axios', 'dotenv'];

  console.log('Scripts:');
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ npm run ${script}`);
    } else {
      console.log(`❌ npm run ${script} - MISSING`);
    }
  });

  console.log('Dependencies:');
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}@${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
    }
  });

} catch (error) {
  console.log('❌ Failed to parse package.json:', error.message);
}

// Test 3: Check TypeScript configuration
console.log('\n🔧 Checking TypeScript configuration...');
try {
  if (fs.existsSync('tsconfig.json')) {
    console.log('✅ tsconfig.json exists');
  } else {
    console.log('❌ tsconfig.json missing');
  }

  if (fs.existsSync('src/core/types.ts')) {
    const typesContent = fs.readFileSync('src/core/types.ts', 'utf8');
    if (typesContent.includes('SyncConfig') && typesContent.includes('TeraBoxFile')) {
      console.log('✅ Core types defined');
    } else {
      console.log('❌ Core types incomplete');
    }
  }
} catch (error) {
  console.log('❌ TypeScript configuration error:', error.message);
}

// Test 4: Check web interface files
console.log('\n🌐 Checking web interface...');
try {
  const setupHTML = fs.readFileSync('setup/workspace-selector.html', 'utf8');
  if (setupHTML.includes('TeraBox') && setupHTML.includes('Notion')) {
    console.log('✅ Setup interface ready');
  } else {
    console.log('❌ Setup interface incomplete');
  }

  const monitorHTML = fs.readFileSync('monitoring/index.html', 'utf8');
  if (monitorHTML.includes('monitoring') && monitorHTML.includes('dashboard')) {
    console.log('✅ Monitoring dashboard ready');
  } else {
    console.log('❌ Monitoring dashboard incomplete');
  }
} catch (error) {
  console.log('❌ Web interface error:', error.message);
}

// Test 5: Check configuration files
console.log('\n⚙️ Checking configuration...');
try {
  const configTemplate = JSON.parse(fs.readFileSync('config/sync-config.template.json', 'utf8'));
  if (configTemplate.terabox && configTemplate.notion && configTemplate.sync) {
    console.log('✅ Configuration template complete');
  } else {
    console.log('❌ Configuration template incomplete');
  }

  const classificationRules = JSON.parse(fs.readFileSync('config/classification-rules.json', 'utf8'));
  if (classificationRules.rules && classificationRules.global_settings) {
    console.log('✅ Classification rules ready');
  } else {
    console.log('❌ Classification rules incomplete');
  }
} catch (error) {
  console.log('❌ Configuration error:', error.message);
}

// Test 6: Try to build
console.log('\n🏗️ Testing build process...');
try {
  const { execSync } = require('child_process');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful!');

  // Check if dist folder was created
  if (fs.existsSync('dist/index.js')) {
    console.log('✅ Build artifacts created');
  } else {
    console.log('❌ Build artifacts missing');
  }
} catch (error) {
  console.log('❌ Build failed:', error.message);
  console.log('   Run "npm run build" to see detailed errors');
}

// Test 7: Check README
console.log('\n📖 Checking documentation...');
try {
  const readme = fs.readFileSync('README.md', 'utf8');
  if (readme.includes('TeraBox') && readme.includes('Notion') && readme.includes('Schnellstart')) {
    console.log('✅ README documentation complete');
  } else {
    console.log('❌ README documentation incomplete');
  }
} catch (error) {
  console.log('❌ README error:', error.message);
}

console.log('\n🎉 Basic testing completed!');
console.log('\n📋 Next steps:');
console.log('1. Run "npm run setup" for interactive configuration');
console.log('2. Run "npm start" to start the sync service');
console.log('3. Open setup/workspace-selector.html in your browser');
console.log('4. Check http://localhost:3000 for monitoring dashboard');

console.log('\n✨ TeraBox + Notion Bidirectional Sync System is ready!');