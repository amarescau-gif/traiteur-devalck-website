#!/usr/bin/env node

/**
 * Image Optimization Script for Traiteur De Valck
 * 
 * This script optimizes images for web use by:
 * - Converting to WebP format for better compression
 * - Creating multiple sizes for responsive images
 * - Generating blur placeholders for lazy loading
 * 
 * Usage: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
try {
  const sharp = require('sharp');
  
  const INPUT_DIR = path.join(__dirname, '../public/images');
  const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Image sizes for responsive images
  const SIZES = [400, 800, 1200, 1600];
  
  // Get all image files
  const imageFiles = fs.readdirSync(INPUT_DIR)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  
  console.log(`Found ${imageFiles.length} images to optimize...\n`);
  
  async function optimizeImage(filename) {
    const inputPath = path.join(INPUT_DIR, filename);
    const basename = path.basename(filename, path.extname(filename));
    
    console.log(`Processing: ${filename}`);
    
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Generate WebP versions at different sizes
      for (const size of SIZES) {
        if (metadata.width && metadata.width >= size) {
          const outputFilename = `${basename}-${size}.webp`;
          const outputPath = path.join(OUTPUT_DIR, outputFilename);
          
          await image
            .resize(size, null, { withoutEnlargement: true })
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);
          
          console.log(`  ✓ Created ${outputFilename}`);
        }
      }
      
      // Create full-size WebP
      const fullSizeOutput = path.join(OUTPUT_DIR, `${basename}.webp`);
      await image
        .webp({ quality: 90, effort: 6 })
        .toFile(fullSizeOutput);
      console.log(`  ✓ Created ${basename}.webp`);
      
      // Generate tiny blur placeholder (20px wide)
      const placeholderOutput = path.join(OUTPUT_DIR, `${basename}-placeholder.jpg`);
      await image
        .resize(20, null, { withoutEnlargement: true })
        .jpeg({ quality: 30, progressive: true })
        .toFile(placeholderOutput);
      console.log(`  ✓ Created ${basename}-placeholder.jpg`);
      
      console.log('');
    } catch (error) {
      console.error(`  ✗ Error processing ${filename}:`, error.message);
    }
  }
  
  // Process all images
  async function main() {
    for (const file of imageFiles) {
      await optimizeImage(file);
    }
    console.log('Image optimization complete!');
  }
  
  main().catch(console.error);
  
} catch (error) {
  console.log('Sharp not installed. Skipping image optimization.');
  console.log('To enable image optimization, run: npm install sharp --save-dev');
}
