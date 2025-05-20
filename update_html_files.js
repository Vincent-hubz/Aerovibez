// This is a Node.js script to update all HTML files to include sidebar CSS and JS
// Usage: Run with node update_html_files.js

const fs = require('fs');
const path = require('path');

// Directory containing HTML files
const directory = __dirname;

// Read all files in directory
fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Filter HTML files
  const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html');
  
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  // Process each HTML file
  htmlFiles.forEach(file => {
    const filePath = path.join(directory, file);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }
      
      let modified = false;
      let newContent = data;
      
      // Add sidebar CSS link if not present
      if (!newContent.includes('sidebar.css')) {
        newContent = newContent.replace(
          /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.0\.0\/css\/all\.min\.css">/,
          '<link rel="stylesheet" href="sidebar.css">\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">'
        );
        modified = true;
      }
      
      // Add script.js reference before </body> if not present
      if (!newContent.includes('script.js')) {
        // Check if the file has any JavaScript functionality file
        const scriptMatch = newContent.match(/<script src="javascript_functionality[^"]*\.js"><\/script>/);
        
        if (scriptMatch) {
          // Add script.js before the existing script
          newContent = newContent.replace(
            scriptMatch[0],
            `<script src="script.js"></script>\n  ${scriptMatch[0]}`
          );
        } else {
          // No existing script found, add before </body>
          newContent = newContent.replace(
            /<\/body>/,
            '  <script src="script.js"></script>\n</body>'
          );
        }
        modified = true;
      }
      
      // Remove existing menu buttons (other than homepage1.html which we've configured properly)
      if (file !== 'homepage1.html') {
        // Find and remove menu button references in the left-icons section
        const menuButtonPattern = /<a [^>]*class="icon-container"[^>]*>[\s\S]*?<i class="fas fa-bars"[^>]*>[\s\S]*?<\/a>/;
        if (menuButtonPattern.test(newContent)) {
          newContent = newContent.replace(menuButtonPattern, '');
          modified = true;
        }
      }
      
      // Write the updated content back to the file
      if (modified) {
        fs.writeFile(filePath, newContent, 'utf8', (err) => {
          if (err) {
            console.error(`Error writing file ${file}:`, err);
            return;
          }
          console.log(`✅ Updated ${file}`);
        });
      } else {
        console.log(`ℹ️ No changes needed for ${file}`);
      }
    });
  });
}); 