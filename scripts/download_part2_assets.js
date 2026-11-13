import https from 'https';
import fs from 'fs';
import path from 'path';

const targetDir = 'c:/Users/Kiaan technology/Desktop/AI image video/frontend/public/images/landing';

const newAssets = [
  {
    name: 'edit-relighting.jpg',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=85',
    title: 'Dramatic Atmospheric Red Relighting',
    author: 'Ali Pazani',
    license: 'Unsplash License'
  },
  {
    name: 'edit-node-workflow.jpg',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=85',
    title: 'Visual Inpainting & Scene Transformation',
    author: 'Luca Bravo',
    license: 'Unsplash License'
  },
  {
    name: 'edit-horse-mist.jpg',
    url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&auto=format&fit=crop&q=85',
    title: 'Ethereal Forest & White Horse Synthesis',
    author: 'Annie Spratt',
    license: 'Unsplash License'
  },
  {
    name: 'edit-macro-upscale.jpg',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85',
    title: 'Ultra-Fine Facial Retouch & 4K Upscale',
    author: 'Aiony Haust',
    license: 'Unsplash License'
  },
  {
    name: 'edit-cyberpunk.jpg',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=85',
    title: 'Cybernetic Style Transfer & Neural Filters',
    author: 'Steve Johnson',
    license: 'Unsplash License'
  },
  {
    name: 'marketing-product-poster.jpg',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop&q=85',
    title: 'Luxury Cosmetic Serum Commercial Shot',
    author: 'Laura Chouette',
    license: 'Unsplash License'
  },
  {
    name: 'marketing-product-ref.jpg',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=85',
    title: 'Product Reference Silhouette',
    author: 'Rachit Tank',
    license: 'Unsplash License'
  },
  {
    name: 'cta-cinematic-banner.jpg',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=85',
    title: 'Epic Cinematic Twilight Wilderness',
    author: 'Bailey Zindel',
    license: 'Unsplash License'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(dest);
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Starting download of ${newAssets.length} Part 2 assets...`);
  for (const item of newAssets) {
    const dest = path.join(targetDir, item.name);
    try {
      await downloadFile(item.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`✓ Downloaded ${item.name} (${Math.round(size / 1024)} KB)`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.name}: ${err.message}`);
    }
  }
  console.log('Finished downloading Part 2 landing assets.');
}

run();
