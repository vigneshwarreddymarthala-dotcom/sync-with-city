const { insertOne, getCollection } = require("./dbHelper");

async function seed() {
  console.log("Seeding database with realistic campus data...");

  // 1. Seed Creators / Campus Hubs
  const existingCreators = await getCollection("creators");
  if (existingCreators.length === 0) {
    const creatorsData = [
      {
        rId: "hub-1",
        rName: "Campus Café & Co-Working Hub",
        ownerName: "Marco Weber",
        description: "The central meeting point for students, laptops, fresh coffee, and project collaborations.",
        location: "Berlin",
        category: "Co-Working & Café",
        usrType: "business",
        website: "https://campus-hub.berlin",
        instagram: "@campusberlin",
        googleReview: "4.8"
      },
      {
        rId: "hub-2",
        rName: "Tech & Innovation Lab",
        ownerName: "Sarah Schneider",
        description: "Makerspace, 3D printing, hackathons, and developer study groups for international tech students.",
        location: "Berlin",
        category: "Tech & Innovation",
        usrType: "business",
        website: "https://techlab.berlin",
        googleReview: "4.9"
      },
      {
        rId: "hub-3",
        rName: "International Student Lounge",
        ownerName: "David Miller",
        description: "Community lounge hosting cultural events, language tandems, and student networking.",
        location: "Munich",
        category: "Community & Culture",
        usrType: "business",
        website: "https://intl-lounge.de",
        googleReview: "4.7"
      }
    ];

    for (const c of creatorsData) {
      await insertOne("creators", c);
    }
    console.log(`✓ Seeded ${creatorsData.length} creators`);
  }

  // 2. Seed Posts & Events
  const existingPosts = await getCollection("posts");
  if (existingPosts.length === 0) {
    const postsData = [
      {
        rId: "hub-1",
        rName: "Campus Café & Co-Working Hub",
        eventName: "Berlin AI & Web3 Hackathon 2026",
        title: "Berlin AI & Web3 Hackathon 2026",
        description: "48-hour student hackathon with great prizes, mentors, free pizza, and networking with tech founders.",
        type: "event",
        location: "Berlin",
        date: "2026-11-28",
        time: "10:00 AM",
        duration: "48 Hours",
        price: "Free",
        seats: 100,
        bookedSeats: 34,
        womenOnly: false
      },
      {
        rId: "hub-1",
        rName: "Campus Café & Co-Working Hub",
        eventName: "International Welcome & Games Night",
        title: "International Welcome & Games Night",
        description: "Meet fellow international students, play board games, and connect over snacks and drinks.",
        type: "event",
        location: "Berlin",
        date: "2026-11-20",
        time: "06:30 PM",
        duration: "3 Hours",
        price: "Free",
        seats: 50,
        bookedSeats: 22,
        womenOnly: false
      },
      {
        rId: "hub-2",
        rName: "Tech & Innovation Lab",
        eventName: "German Language Tandem: A2 to B2",
        title: "German Language Tandem: A2 to B2",
        description: "Casual conversational practice in German and English with native speakers in a friendly environment.",
        type: "event",
        location: "Berlin",
        date: "2026-11-22",
        time: "05:00 PM",
        duration: "2 Hours",
        price: "Free",
        seats: 30,
        bookedSeats: 14,
        womenOnly: false
      },
      {
        rId: "hub-2",
        rName: "Tech & Innovation Lab",
        eventName: "Student Startup Pitch & Pizza Night",
        title: "Student Startup Pitch & Pizza Night",
        description: "Pitch your project or idea in 3 minutes, get feedback from founders, and find co-founders.",
        type: "event",
        location: "Berlin",
        date: "2026-11-25",
        time: "07:00 PM",
        duration: "2.5 Hours",
        price: "Free",
        seats: 60,
        bookedSeats: 41,
        womenOnly: false
      }
    ];

    for (const p of postsData) {
      await insertOne("posts", p);
      await insertOne("events", p);
    }
    console.log(`✓ Seeded ${postsData.length} posts and events`);
  }

  // 3. Seed News Articles
  const existingNews = await getCollection("news");
  if (existingNews.length === 0) {
    const newsData = [
      {
        rId: "hub-1",
        newsTitle: "Deutschlandticket & Semester Ticket Updates for 2026",
        category: "Campus News",
        location: "Berlin",
        description: "Everything international and local students need to know about semester transit passes and regional upgrades across Germany.",
        link: "https://www.studentenwerk-berlin.de",
        createdAt: new Date().toISOString()
      },
      {
        rId: "hub-2",
        newsTitle: "Working Student (Werkstudent) Jobs: Top Berlin Openings",
        category: "Career",
        location: "Berlin",
        description: "A curated roundup of flexible 20-hour working student positions in software, data analytics, and marketing in Berlin startups.",
        link: "https://berlinstartupjobs.com",
        createdAt: new Date().toISOString()
      },
      {
        rId: "hub-1",
        newsTitle: "DAAD & Germany Scholarship Application Windows Open",
        category: "Scholarships",
        location: "Berlin",
        description: "Deadlines, requirements, and tips for applying for Germany scholarship programs (Deutschlandstipendium) for 2026/2027.",
        link: "https://www.daad.de",
        createdAt: new Date().toISOString()
      }
    ];

    for (const n of newsData) {
      await insertOne("news", n);
    }
    console.log(`✓ Seeded ${newsData.length} news articles`);
  }

  // 4. Seed Store Products
  const existingStore = await getCollection("store");
  if (existingStore.length === 0) {
    const storeData = [
      {
        rId: "hub-1",
        proName: "Official Campus Companion Hoodie",
        category: "Apparel",
        location: "Berlin",
        qty: "25",
        price: "29.99",
        discount: "10",
        details: "Comfortable organic cotton hoodie with embroidered campus logo, unisex fit.",
        status: true
      },
      {
        rId: "hub-2",
        proName: "German Grammar & Vocabulary Study Guide (A1-B2)",
        category: "Books",
        location: "Berlin",
        qty: "40",
        price: "14.50",
        discount: "0",
        details: "Concise quick-reference guide designed specifically for international students.",
        status: true
      },
      {
        rId: "hub-1",
        proName: "Ergonomic USB-C Desk Lamp with Wireless Charging",
        category: "Electronics",
        location: "Berlin",
        qty: "15",
        price: "24.99",
        discount: "15",
        details: "Multi-temperature LED desk lamp with fast phone charging base, ideal for dorm desks.",
        status: true
      }
    ];

    for (const s of storeData) {
      await insertOne("store", s);
    }
    console.log(`✓ Seeded ${storeData.length} store items`);
  }

  console.log("Database seeding completed successfully!");
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seed;
