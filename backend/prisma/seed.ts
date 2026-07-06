import { PrismaClient } from '.prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log('🌱 Seeding database with Kenya & Seychelles Tours...');

  // Clear existing users to start fresh
  console.log('🗑️ Cleaning existing users...');
  await prisma.user.deleteMany({});

  // Create admin user
  const adminHash = await bcrypt.hash('AdminAdmin001', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@grapihviotours.com' },
    update: {
      passwordHash: adminHash,
    },
    create: {
      email: 'admin@grapihviotours.com',
      passwordHash: adminHash,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin:', admin.email);

  // Create sample customer
  const customerHash = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'explorer@graphivio.com' },
    update: {},
    create: {
      email: 'explorer@graphivio.com',
      passwordHash: customerHash,
      name: 'Alex Explorer',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Created customer:', customer.email);

  // Clear existing tours (cascades to bookings and reviews)
  console.log('🗑️ Cleaning existing tours...');
  await prisma.tour.deleteMany({});

  // Create new Tours
  const tours = [
    {
      title: 'Maasai Mara National Reserve Safari',
      description: "Experience the crown jewel of Kenya's wildlife viewing. Maasai Mara is world-famous for its exceptional population of lions, leopards, cheetahs, and the annual Great Migration of wildebeest, zebras, and gazelles crossing the Mara River (July–October). Enjoy luxurious tented camps, daily sunrise game drives, and encounters with the local Maasai culture.",
      price: 180000,
      durationDays: 4,
      location: 'Maasai Mara, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 8,
      difficulty: 'EASY',
      ratingsAverage: 4.7,
      ratingsQuantity: 3505,
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival & Evening Game Drive', description: 'Fly or drive to Maasai Mara. Settle into your luxury tented lodge before heading out for a sunset wildlife search.' },
        { day: 2, title: 'Full Day Game Drive & Mara River', description: 'Spend the day tracking the Big Five. Visit the Mara River, the site of the dramatic Great Migration crossings.' },
        { day: 3, title: 'Maasai Village & Hot Air Balloon', description: 'Optional sunrise balloon safari followed by a cultural visit to a traditional Maasai community.' },
        { day: 4, title: 'Sunrise Drive & Departure', description: 'Catch a final morning game drive as the sun rises over the savannah, then head back to Nairobi.' }
      ]),
    },
    {
      title: 'Nairobi National Park Tour',
      description: "Discover the world's only game reserve located within a major capital city. Nairobi National Park offers a unique setting where you can photograph free-roaming rhinos, lions, giraffes, and zebras against a backdrop of towering city skyscrapers. Perfect for layovers, short trips, or business travelers.",
      price: 15000,
      durationDays: 1,
      location: 'Nairobi, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 12,
      difficulty: 'EASY',
      ratingsAverage: 4.5,
      ratingsQuantity: 11445,
      itinerary: JSON.stringify([
        { day: 1, title: 'Half-Day City Wildlife Safari', description: 'Early morning pickup. Traverse the park in a customized 4x4 open-roof safari vehicle and spot black rhinos, lions, and zebras before lunch.' }
      ]),
    },
    {
      title: 'National Museum of Kenya Exploration',
      description: "Take a deep dive into Kenya's rich heritage, history, diverse culture, and renowned archaeological discoveries of human evolution. The museum houses an incredible collection of prehistoric fossils, native avian taxidermy, art galleries, and a contiguous snake park.",
      price: 3000,
      durationDays: 1,
      location: 'Nairobi, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1572953119113-1ccabb627a7c?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 20,
      difficulty: 'EASY',
      ratingsAverage: 4.5,
      ratingsQuantity: 12005,
      itinerary: JSON.stringify([
        { day: 1, title: 'Guided Museum & Snake Park Tour', description: 'Spend the day with a resident historian exploring fossil displays, cultural artifacts, and walking through the botanical gardens and snake park.' }
      ]),
    },
    {
      title: 'Karen Blixen Museum Heritage Tour',
      description: "Walk back in time at the historic farmhouse estate of Karen Blixen, the author of the famous memoir 'Out of Africa'. Located at the foot of the Ngong Hills, the museum offers a unique glimpse of early colonial lifestyle, preserved period furniture, and pristine grounds with original agricultural machinery.",
      price: 4500,
      durationDays: 1,
      location: 'Nairobi, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 15,
      difficulty: 'EASY',
      ratingsAverage: 4.5,
      ratingsQuantity: 3601,
      itinerary: JSON.stringify([
        { day: 1, title: 'Estate Tour & High Tea', description: 'Tour the main house and agricultural grounds. Finish your afternoon enjoying authentic Kenyan coffee or tea on the veranda looking towards the Ngong Hills.' }
      ]),
    },
    {
      title: 'Diani Beach Tropical Getaway',
      description: "Unwind at Kenya's premier beach paradise. Diani Beach boasts flawless powder-white sand, sparkling turquoise waters, and lush coastal forests. Perfect for swimming, snorkelling among coral reefs, windsurfing, or just relaxing under coconut palms. Enjoy luxurious beachside resorts and vibrant local seafood dining.",
      price: 45000,
      durationDays: 4,
      location: 'Diani, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1589979482837-e74f2e145060?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 10,
      difficulty: 'EASY',
      ratingsAverage: 4.7,
      ratingsQuantity: 2086,
      itinerary: JSON.stringify([
        { day: 1, title: 'Welcome to Paradise', description: 'Arrive at your boutique beach villa. Spend the day walking the soft white sand and swimming in the warm Indian Ocean.' },
        { day: 2, title: 'Snorkeling at Kisite-Mpunguti', description: 'Take a traditional dhow sailboat trip to the marine park for snorkeling with dolphins and a Swahili lunch.' },
        { day: 3, title: 'Watersports & Leisure', description: 'Try kitesurfing, stand-up paddleboarding, or pamper yourself at a luxury beachfront spa.' },
        { day: 4, title: 'Sunset Cruise & Departure', description: 'Enjoy a morning beach stroll followed by an afternoon transfer back to Mombasa for departure.' }
      ]),
    },
    {
      title: 'Vallée de Mai UNESCO Reserve Expedition',
      description: 'Explore the mystical prehistoric rainforest of Vallée de Mai on Praslin Island, Seychelles. This UNESCO World Heritage site is a legendary valley untouched since primeval times, famous for harboring the largest population of the giant, uniquely shaped Coco de Mer palm trees. Wander beneath massive fronds and listen for the calls of the rare Seychelles Black Parrot.',
      price: 60000,
      durationDays: 2,
      location: 'Praslin, Seychelles',
      imageCover: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1589392191049-fc10c97e64b6?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 6,
      difficulty: 'MEDIUM',
      ratingsAverage: 4.3,
      ratingsQuantity: 1919,
      itinerary: JSON.stringify([
        { day: 1, title: 'Valley Walk & Coco de Mer', description: 'Take a guided hike through the ancient forest trails, marveling at the giant seed pods and unique endemic plants.' },
        { day: 2, title: 'Anse Lazio Relaxation', description: 'Visit the world-famous Anse Lazio beach nearby to relax on giant granite boulder sands.' }
      ]),
    },
    {
      title: 'Morne Seychellois Hiking Adventure',
      description: 'Conquer the highest peak on Mahé Island inside the spectacular Morne Seychellois National Park. Trek through mist-covered mountain forests, granite slopes, and rare indigenous flora. The Morne Blanc trail leads hikers to a sheer cliff summit offering breathtaking, panoramic views of the western coast and outer islands.',
      price: 35000,
      durationDays: 1,
      location: 'Mahé, Seychelles',
      imageCover: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 8,
      difficulty: 'DIFFICULT',
      ratingsAverage: 4.7,
      ratingsQuantity: 171,
      itinerary: JSON.stringify([
        { day: 1, title: 'Summit Morne Blanc', description: 'Hike through tea plantations and mossy forests. Reach the observation deck for spectacular oceanic vistas.' }
      ]),
    },
    {
      title: 'Victoria Botanical Gardens & Giant Tortoise Encounter',
      description: "Visit one of Seychelles' oldest National Monuments in the capital city of Victoria. Established over a century ago, the gardens feature a spectacular collection of mature exotic palms, orchid gardens, flying foxes, and a close-up encounter with giant Aldabra land tortoises that live inside the sanctuary.",
      price: 8000,
      durationDays: 1,
      location: 'Victoria, Seychelles',
      imageCover: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 25,
      difficulty: 'EASY',
      ratingsAverage: 4.2,
      ratingsQuantity: 2058,
      itinerary: JSON.stringify([
        { day: 1, title: 'Botanical Walk & Hand-feeding Tortoises', description: 'Explore spice trees, learn about the famous Coco de Mer palm, and feed the gentle, ancient giant tortoises.' }
      ]),
    },
    {
      title: 'Craft Village & Creole Heritage Tour',
      description: 'Explore the authentic cultural heritage of Seychelles at Domaine de Val des Prés (Craft Village). Wander through a meticulously restored traditional 1870s plantation house, visit local artisan workshops crafting handmade souvenirs, and discover local distillers and creators of pure Coco de Mer flower perfumes.',
      price: 12000,
      durationDays: 1,
      location: 'Mahé, Seychelles',
      imageCover: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
      ]),
      maxGroupSize: 15,
      difficulty: 'EASY',
      ratingsAverage: 4.3,
      ratingsQuantity: 598,
      itinerary: JSON.stringify([
        { day: 1, title: 'Creole Workshop Tour & Art Walk', description: 'Visit the historic Grann Kaz home, watch local glass and wooden craft demonstrations, and shop for authentic Creole keepsakes.' }
      ]),
    }
  ];

  for (const tourData of tours) {
    await prisma.tour.create({ data: tourData });
    console.log(`✅ Created tour: ${tourData.title}`);
  }

  // Create sample Blog Posts
  const blogPosts = [
    {
      title: 'Top 10 Travel Tips for Your First Kenyan Safari',
      slug: 'top-10-travel-tips-kenya-safari',
      summary: 'Essential advice on clothing, timing, vaccinations, and booking to make your first Maasai Mara wildlife safari unforgettable.',
      content: 'Planning your first safari is incredibly exciting, but can be daunting. Here are our top 10 tips:\n\n1. Book during the Great Migration (July to October) if you want to see the river crossings.\n2. Dress in neutral colors like khaki, olive, and brown. Avoid blue and black as they attract tsetse flies.\n3. Bring a good camera with a telephoto lens (at least 300mm).\n4. Respect the animals and stay inside the vehicle at all times.\n5. Don\'t forget to pack high-SPF sunscreen, insect repellent, and a wide-brimmed hat.\n6. Keep a light jacket handy; mornings and evenings in the savannah can be surprisingly chilly.\n7. Prepare your vaccinations and bring malaria prophylaxis.\n8. Hire an experienced local guide; their tracking skills are irreplaceable.\n9. Bring cash (Kenya Shillings or USD) for tipping lodge staff and drivers.\n10. Take time to put down the camera and absorb the sights and sounds of the wild.',
      category: 'Travel tips',
      imageCover: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      authorId: admin.id,
    },
    {
      title: 'Seychelles Visa Requirements & Travel Guide',
      slug: 'seychelles-visa-requirements-guide',
      summary: 'A complete walkthrough of the entry requirements, travel authorization forms, and customs policies for visiting the Seychelles.',
      content: 'Seychelles is a visa-free country, meaning anyone can visit without a pre-applied visa. However, you must obtain a Travel Authorization before arrival. Here is what you need:\n\n1. A valid passport for the duration of your stay.\n2. A return or onward ticket.\n3. Confirmed accommodation booking details.\n4. Sufficient funds for your stay (approx. $150 per day).\n5. Apply online for the mandatory Seychelles Travel Authorization (STA) 10 to 72 hours before departure via the official government portal.\n6. Standard application processing fees apply.\n7. Keep a printed or digital copy of the approved STA authorization handy at boarding and immigration desks.',
      category: 'Visa guides',
      imageCover: 'https://images.unsplash.com/photo-1589392191049-fc10c97e64b6?auto=format&fit=crop&w=800&q=80',
      authorId: admin.id,
    },
    {
      title: 'What to Pack for Seychelles Island Hopping',
      slug: 'packing-list-seychelles-island-hopping',
      summary: 'The ultimate packing list for your tropical getaway, featuring beachwear, rainforest hiking gear, and travel essentials.',
      content: 'Packing for the Seychelles requires balancing beach relaxation with tropical jungle hiking. Here is your checklist:\n\n- Lightweight, breathable clothing (linen, cotton)\n- Swimwear and UV-protection rash guards\n- Sturdy hiking shoes or trail runners for trails like Morne Blanc\n- Water-resistant dry bag for boat transfers and island hopping\n- Reef-safe biodegradable sunscreen to protect coral reefs\n- Polarized sunglasses and a sunhat\n- Power adapter (type G, same as the UK)\n- Personal medication and motion-sickness pills for boat rides.',
      category: 'Packing lists',
      imageCover: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
      authorId: admin.id,
    }
  ];

  console.log('🗑️ Cleaning existing blog posts...');
  await prisma.blogPost.deleteMany({});

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
    console.log(`✅ Created blog post: ${post.title}`);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('   Admin:    admin@grapihviotours.com / AdminAdmin001');
  console.log('   Customer: explorer@graphivio.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
