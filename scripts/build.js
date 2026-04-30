const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}

fs.mkdirSync(distDir, { recursive: true });

const filesToCopy = [
    'index.html',
    'styles.css',
    'admin.html',
    'admin-styles.css',
    'admin.js',
    'app.js',
    'data.js',
    'translations.js',
    'qr-generator.html',
    'images',
];

function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((child) => {
            copyRecursive(path.join(src, child), path.join(dest, child));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

filesToCopy.forEach((item) => {
    const src = path.join(rootDir, item);
    const dest = path.join(distDir, item);
    if (fs.existsSync(src)) {
        copyRecursive(src, dest);
        console.log(`Copied: ${item}`);
    }
});

console.log(`Build complete! Output in ${distDir}`);
