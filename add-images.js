import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'server/storage/products.live.json');

let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Function to set appropriate images for products
function setProductImage(product, manufacturerSlug) {
  const name = product.name.toLowerCase();

  // Solar modules
  if (name.includes('module') || name.includes('panel') || name.includes('modul') ||
      name.includes('wp') || /\d+w\b/i.test(name) ||
      (product.specs && (product.specs.ratedPower || product.specs.Leistung))) {

    // Manufacturer-specific images
    if (manufacturerSlug === 'jinko-solar') {
      product.imageUrl = 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop&crop=center';
    } else if (manufacturerSlug === 'trina-solar') {
      product.imageUrl = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center';
    } else if (manufacturerSlug === 'lg-energy-solution') {
      product.imageUrl = 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=400&h=300&fit=crop&crop=center';
    } else if (manufacturerSlug === 'canadian-solar') {
      product.imageUrl = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center';
    } else {
      // Generic solar panel image
      product.imageUrl = 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop&crop=center';
    }
  }

  // Inverters
  else if (name.includes('inverter') || name.includes('wechselrichter') ||
           name.includes('symo') || name.includes('tripower') || name.includes('gen24')) {
    product.imageUrl = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop&crop=center';
  }

  // Batteries
  else if (name.includes('battery') || name.includes('speicher') || name.includes('batterie') ||
           name.includes('powerwall') || name.includes('luna2000') ||
           (product.specs && (product.specs.capacity || product.specs.Kapazität))) {
    product.imageUrl = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop&crop=center';
  }

  // Power optimizers
  else if (name.includes('optimizer') || name.includes('ts4') || name.includes('yc1000') ||
           name.includes('p320')) {
    product.imageUrl = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center';
  }

  // Mounting systems
  else if (name.includes('mounting') || name.includes('system') || name.includes('rail') ||
           name.includes('fix') || name.includes('con') || name.includes('flat') ||
           name.includes('aero') || name.includes('compact') || name.includes('groundfix') ||
           name.includes('tiltfix') || (product.specs && product.specs.Material)) {
    product.imageUrl = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center';
  }

  // Heat pumps
  else if (name.includes('heat pump') || name.includes('wärmepumpe') || name.includes('vitocal')) {
    product.imageUrl = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center';
  }

  // Energy management systems
  else if (name.includes('smart meter') || name.includes('energy management') ||
           name.includes('energymanager') || name.includes('ems')) {
    product.imageUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center';
  }

  // If no image was set, use a generic solar technology image
  if (!product.imageUrl || product.imageUrl.trim() === '') {
    product.imageUrl = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop&crop=center';
  }
}

// Process all manufacturers and products
data.manufacturers.forEach(manufacturer => {
  manufacturer.products.forEach(product => {
    setProductImage(product, manufacturer.slug);
  });
});

// Update changeSummary
data.changeSummary = {
  ...data.changeSummary,
  imagesAdded: true,
  imageUpdateMethod: 'unsplash-stock-images-2025',
  lastUpdated: new Date().toISOString()
};

// Save the updated file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Images added to all products using high-quality stock images from Unsplash.');