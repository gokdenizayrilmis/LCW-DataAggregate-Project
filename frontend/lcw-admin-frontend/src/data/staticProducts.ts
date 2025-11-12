export const categories = [
  { name: 'T-Shirt', path: 'tisort' },
  { name: 'Gömlek', path: 'gomlek' },
  { name: 'Pantolon', path: 'pantolon' },
  { name: 'Hırka', path: 'hirka' },
  { name: 'Ayakkabı', path: 'ayakkabi' },
  { name: 'Şort', path: 'sort' },
];

const productNames: { [key: string]: string[] } = {
  tisort: ['Basic Pamuklu T-Shirt', 'Baskılı Bisiklet Yaka T-Shirt', 'Polo Yaka T-Shirt', 'V Yaka Slim Fit T-Shirt', 'Oversize Pamuklu T-Shirt'],
  gomlek: ['Klasik Yaka Gömlek', 'Oduncu Gömleği', 'Keten Gömlek', 'Slim Fit Poplin Gömlek', 'Hakim Yaka Gömlek'],
  pantolon: ['Regular Fit Jean', 'Skinny Fit Jean', 'Chino Pantolon', 'Kargo Pantolon', 'Kumaş Pantolon'],
  hirka: ['Kapüşonlu Fermuarlı Hırka', 'V Yaka Triko Hırka', 'Baklava Desenli Hırka', 'Kalın Örgü Hırka', 'Polar Hırka'],
  ayakkabi: ['Günlük Sneaker', 'Deri Bot', 'Spor Ayakkabı', 'Loafer Ayakkabı', 'Sandalet'],
  sort: ['Jean Şort', 'Keten Şort', 'Spor Şort', 'Bermuda Şort', 'Deniz Şortu'],
};

// Actual image file names present in public/images/products/*
const productImages: { [key: string]: string[] } = {
  tisort: ['T1001.jpg', 'T1002.jpg', 'T1003.jpg', 'T1004.jpg', 'T1005.jpg'],
  gomlek: ['G1001.jpg', 'G1002.jpg', 'G1003.jpg', 'G1004.jpg', 'G1005.jpg'],
  pantolon: ['P1001.jpg', 'P1002.jpg', 'P1003.jpg', 'P1004.jpg', 'P1005.jpg'],
  hirka: ['H1001.jpg', 'H1002.jpg', 'H1003.jpg', 'H1004.jpg', 'H1005.jpg'],
  ayakkabi: ['A1001.jpg', 'A1002.jpg', 'A1003.jpg', 'A1004.jpg', 'A1005.jpg'],
  sort: ['S1001.jpg', 'S1002.jpg', 'S1003.jpg', 'S1004.jpg', 'S1005.jpg'],
};

const generateRandomCode = () => `LCW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
const generateRandomPrice = () => parseFloat((Math.random() * (500 - 50) + 50).toFixed(2));
const generateRandomStock = () => Math.floor(Math.random() * 200);

let productId = 1;

export const staticProducts = categories.flatMap(category => {
  const names = productNames[category.path];
  const images = productImages[category.path];
  return names.map((name, index) => ({
    id: productId++,
    name,
    code: generateRandomCode(),
    category: category.name,
    price: generateRandomPrice(),
    stockQuantity: generateRandomStock(),
    imageUrl: `/images/products/${category.path}/${images[index]}`,
  }));
});
