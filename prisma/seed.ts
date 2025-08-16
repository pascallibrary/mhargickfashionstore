import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in order due to foreign key constraints)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@mhargick.com',
      password: hashedPassword,
      phone: '+2348012345678',
      address: '123 Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      isAdmin: true,
      isVerified: true,
    },
  });

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'customer@test.com',
      password: customerPassword,
      phone: '+2348098765432',
      address: '456 Allen Avenue, Ikeja',
      city: 'Lagos',
      state: 'Lagos',
      isVerified: true,
    },
  });

  console.log('✅ Created users');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Men\'s Fashion',
        description: 'Stylish clothing for men',
        slug: 'mens-fashion',
        imageUrl: '/images/categories/mens.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Women\'s Fashion',
        description: 'Elegant clothing for women',
        slug: 'womens-fashion',
        imageUrl: '/images/categories/womens.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accessories',
        description: 'Fashion accessories and jewelry',
        slug: 'accessories',
        imageUrl: '/images/categories/accessories.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Footwear',
        description: 'Shoes and sandals',
        slug: 'footwear',
        imageUrl: '/images/categories/footwear.jpg',
      },
    }),
  ]);

  console.log('✅ Created categories');

  // Create products with Nigerian pricing
  const products = [
    // Men's Fashion
    {
      name: 'Classic Agbada',
      description: 'Traditional Nigerian flowing robe perfect for special occasions',
      price: 45000,
      salePrice: 38000,
      imageUrl: '/images/products/agbada-1.jpg',
      images: ['/images/products/agbada-1.jpg', '/images/products/agbada-2.jpg'],
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Cream', 'Gold'],
      stock: 25,
      sku: 'AGD-001',
      categoryId: categories[0].id,
      slug: 'classic-agbada',
      tags: ['traditional', 'formal', 'agbada', 'nigerian'],
      isFeatured: true,
    },
    {
      name: 'Senator Suit',
      description: 'Modern African-inspired suit for the contemporary man',
      price: 35000,
      imageUrl: '/images/products/senator-1.jpg',
      images: ['/images/products/senator-1.jpg', '/images/products/senator-2.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Navy', 'Black', 'Grey'],
      stock: 30,
      sku: 'SEN-001',
      categoryId: categories[0].id,
      slug: 'senator-suit',
      tags: ['suit', 'formal', 'modern', 'african'],
      isFeatured: true,
    },
    // Women's Fashion
    {
      name: 'Ankara Gown',
      description: 'Beautiful Ankara print dress for the modern African woman',
      price: 25000,
      salePrice: 20000,
      imageUrl: '/images/products/ankara-gown-1.jpg',
      images: ['/images/products/ankara-gown-1.jpg', '/images/products/ankara-gown-2.jpg'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue Print', 'Red Print', 'Green Print'],
      stock: 40,
      sku: 'ANK-001',
      categoryId: categories[1].id,
      slug: 'ankara-gown',
      tags: ['ankara', 'dress', 'african', 'print'],
      isFeatured: true,
    },
    {
      name: 'Aso Oke Blouse',
      description: 'Traditional hand-woven Aso Oke blouse',
      price: 18000,
      imageUrl: '/images/products/aso-oke-1.jpg',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Gold', 'Silver', 'Royal Blue'],
      stock: 20,
      sku: 'ASO-001',
      categoryId: categories[1].id,
      slug: 'aso-oke-blouse',
      tags: ['aso-oke', 'traditional', 'blouse', 'handwoven'],
    },
    // Accessories
    {
      name: 'Beaded Necklace',
      description: 'Handcrafted African beaded necklace',
      price: 8000,
      salePrice: 6500,
      imageUrl: '/images/products/necklace-1.jpg',
      colors: ['Red', 'Blue', 'Gold', 'Multi-color'],
      stock: 50,
      sku: 'BEA-001',
      categoryId: categories[2].id,
      slug: 'beaded-necklace',
      tags: ['jewelry', 'beads', 'handcrafted', 'traditional'],
    },
    {
      name: 'Leather Handbag',
      description: 'Premium leather handbag with African-inspired design',
      price: 22000,
      imageUrl: '/images/products/handbag-1.jpg',
      colors: ['Brown', 'Black', 'Tan'],
      stock: 15,
      sku: 'BAG-001',
      categoryId: categories[2].id,
      slug: 'leather-handbag',
      tags: ['handbag', 'leather', 'accessories', 'premium'],
    },
    // Footwear
    {
      name: 'African Print Sandals',
      description: 'Comfortable sandals with authentic African prints',
      price: 12000,
      imageUrl: '/images/products/sandals-1.jpg',
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
      colors: ['Kente Print', 'Mud Cloth', 'Ankara Print'],
      stock: 35,
      sku: 'SAN-001',
      categoryId: categories[3].id,
      slug: 'african-print-sandals',
      tags: ['sandals', 'african', 'print', 'comfortable'],
    },
  ];

  // Create products
  for (const productData of products) {
    await prisma.product.create({
      data: productData,
    });
  }

  console.log('✅ Created products');

  // Create some sample reviews
  const createdProducts = await prisma.product.findMany();
  
  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: createdProducts[0].id,
      rating: 5,
      comment: 'Amazing quality Agbada! The material is excellent and the fit is perfect.',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: createdProducts[2].id,
      rating: 4,
      comment: 'Beautiful Ankara dress, love the print and style!',
      isVerified: true,
    },
  });

  console.log('✅ Created sample reviews');

  // Create a sample order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'MHG-001',
      userId: customer.id,
      subtotal: 45000,
      shippingCost: 2500,
      total: 47500,
      shippingAddress: '456 Allen Avenue, Ikeja',
      shippingCity: 'Lagos',
      shippingState: 'Lagos',
      shippingPhone: '+2348098765432',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'paystack',
      paymentRef: 'ref_12345',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: sampleOrder.id,
      productId: createdProducts[0].id,
      quantity: 1,
      price: 45000,
      size: 'L',
      color: 'White',
    },
  });

  console.log('✅ Created sample order');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`👤 Admin: admin@mhargick.com / admin123`);
  console.log(`👤 Customer: customer@test.com / customer123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });