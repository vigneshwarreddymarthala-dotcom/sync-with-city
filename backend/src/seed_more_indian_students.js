const bcrypt = require("bcryptjs");
const { getCollection, insertOne, updateOne } = require("./dbHelper");

async function seedIndianStudents() {
  console.log("Seeding comprehensive Indian student network across states...");
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  const users = await getCollection("users");

  const indianStudents = [
    {
      fullName: "Sai Teja Goud",
      usrEmail: "saiteja.goud@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Telangana",
      language: "Telugu",
      company: "University of Stuttgart (M.Sc. Data Science)",
      hobbies: "Badminton, Cloud Computing, Biryani cooking",
      description: "From Hyderabad, living in Vaihingen. Excited to connect with fellow Telugu and Indian students in Stuttgart!",
      usrImg: "avatar1.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Rohan Naidu",
      usrEmail: "rohan.naidu@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Andhra Pradesh",
      language: "Telugu",
      company: "University of Stuttgart (Embedded Systems)",
      hobbies: "Cricket, Gaming, Electronics DIY",
      description: "From Vizag! Studying embedded systems. Always up for sports on weekends.",
      usrImg: "avatar2.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Aditya Kulkarni",
      usrEmail: "aditya.kulkarni@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Maharashtra",
      language: "Marathi",
      company: "University of Stuttgart (Automotive Engineering)",
      hobbies: "Formula Student, Trekking, Table Tennis",
      description: "From Pune. Big car enthusiast and weekend trekker across the Swabian Alps.",
      usrImg: "avatar3.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Deepa Gowda",
      usrEmail: "deepa.gowda@uni-hohenheim.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Karnataka",
      language: "Kannada",
      company: "University of Hohenheim (Bioeconomy & Business)",
      hobbies: "Yoga, Coffee tasting, Classical dance",
      description: "Bangalore to Stuttgart! Exploring cafes and cultural events around Schlossplatz.",
      usrImg: "avatar4.jpg",
      gender: "Female",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Arun Kumar",
      usrEmail: "arun.kumar@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Tamil Nadu",
      language: "Tamil",
      company: "University of Stuttgart (Robotics & Automation)",
      hobbies: "Football, Chess, ROS programming",
      description: "From Chennai. Building autonomous robot systems and looking for football teammates.",
      usrImg: "avatar1.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Nandhini Sundaram",
      usrEmail: "nandhini.sundaram@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Tamil Nadu",
      language: "Tamil",
      company: "University of Stuttgart (Software Technology)",
      hobbies: "Painting, Travel, Baking",
      description: "From Coimbatore. Love software design, art workshops, and weekend trips.",
      usrImg: "avatar2.jpg",
      gender: "Female",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Anjali Menon",
      usrEmail: "anjali.menon@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Kerala",
      language: "Malayalam",
      company: "University of Stuttgart (Computational Mechanics)",
      hobbies: "Carnatic Music, Cycling, Reading",
      description: "From Kochi. Enjoying student life in Baden-Württemberg. Let's grab filter coffee!",
      usrImg: "avatar3.jpg",
      gender: "Female",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Harshil Shah",
      usrEmail: "harshil.shah@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Gujarat",
      language: "Gujarati",
      company: "University of Stuttgart (Mechanical & Process Eng.)",
      hobbies: "Cricket, Cooking, Entrepreneurship",
      description: "From Ahmedabad. Founder mindset, always ready for community hangouts and cricket matches.",
      usrImg: "avatar4.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Simranjeet Singh",
      usrEmail: "simranjeet.singh@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Punjab",
      language: "Punjabi",
      company: "University of Stuttgart (Mechatronics)",
      hobbies: "Gym, Bhangra, Food walks",
      description: "From Chandigarh. Fitness lover, foodie, always happy to help new students settling into Stuttgart.",
      usrImg: "avatar1.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Riya Malhotra",
      usrEmail: "riya.malhotra@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Delhi",
      language: "Hindi",
      company: "University of Stuttgart (Technology Management)",
      hobbies: "Photography, Music festivals, Travel",
      description: "From New Delhi. Exploring Europe one train ride at a time! Looking for study & travel buddies.",
      usrImg: "avatar2.jpg",
      gender: "Female",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    }
  ];

  for (const student of indianStudents) {
    const existing = users.find(u => u.usrEmail === student.usrEmail);
    if (!existing) {
      await insertOne("users", student);
      console.log(`Added student: ${student.fullName} (${student.locationIndia} - ${student.language})`);
    } else {
      await updateOne("users", existing._id, student);
      console.log(`Updated student: ${student.fullName}`);
    }
  }

  console.log("Seeding complete! Indian students now represent Telangana, AP, Maharashtra, Karnataka, Tamil Nadu, Kerala, Gujarat, Punjab, and Delhi.");
}

seedIndianStudents()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
