const bcrypt = require("bcryptjs");
const { getCollection, insertOne, updateOne, findById } = require("./dbHelper");

async function seedFriends() {
  console.log("Seeding realistic student profiles for Friends...");
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 1. Ensure current user profile is complete
  const users = await getCollection("users");
  let currentUser = users.find(u => u.usrEmail === "student.stuttgart@gmail.com");
  if (currentUser) {
    await updateOne("users", currentUser._id, {
      fullName: currentUser.fullName || "Student Stuttgart",
      location: "Stuttgart",
      locationIndia: "Telangana",
      language: "Telugu",
      company: "University of Stuttgart",
      hobbies: "Badminton, Coding, Coffee",
      description: "Masters student in Stuttgart exploring tech, sports, and city life.",
      usrImg: "default-avatar.jpg",
      status: true,
      discoverable: true
    });
    currentUser = await findById("users", currentUser._id);
  }

  const currentUserId = currentUser?._id || "5723b4ab42e0cdecd8ec50db";

  // 2. Add realistic new student profiles
  const studentProfiles = [
    {
      fullName: "Priya Sharma",
      usrEmail: "priya.sharma@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Maharashtra",
      language: "Hindi",
      company: "University of Stuttgart (M.Sc. Computer Science)",
      hobbies: "Badminton, Cooking, Photography",
      description: "First-year master's student passionate about AI and weekend hiking around Baden-Württemberg!",
      usrImg: "avatar1.jpg",
      gender: "Female",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Rahul Verma",
      usrEmail: "rahul.verma@hft-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Karnataka",
      language: "Kannada",
      company: "HFT Stuttgart (Software Engineering)",
      hobbies: "Table Tennis, Chess, Gaming",
      description: "Love building full-stack web apps and playing table tennis at Vaihingen campus.",
      usrImg: "avatar2.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Ananya Reddy",
      usrEmail: "ananya.reddy@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Telangana",
      language: "Telugu",
      company: "University of Stuttgart (Automotive Engineering)",
      hobbies: "Badminton, Reading, Music",
      description: "Automotive tech enthusiast exploring Stuttgart cafes and looking for study buddies!",
      usrImg: "avatar3.jpg",
      gender: "Female",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Karthik Nair",
      usrEmail: "karthik.nair@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Kerala",
      language: "Malayalam",
      company: "University of Stuttgart (Information Technology)",
      hobbies: "Cricket, Guitar, Cycling",
      description: "Always up for a quick coffee and coding jam or exploring the Black Forest on weekends.",
      usrImg: "avatar4.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Sneha Patel",
      usrEmail: "sneha.patel@uni-stuttgart.de",
      password: hashedPassword,
      location: "Stuttgart",
      locationIndia: "Gujarat",
      language: "Gujarati",
      company: "University of Hohenheim",
      hobbies: "Yoga, Baking, Travel",
      description: "Management student at Hohenheim, always excited to meet new international students!",
      usrImg: "avatar1.jpg",
      gender: "Female",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    },
    {
      fullName: "Aarav Mehta",
      usrEmail: "aarav.mehta@tu-berlin.de",
      password: hashedPassword,
      location: "Berlin",
      locationIndia: "Delhi",
      language: "Hindi",
      company: "TU Berlin",
      hobbies: "Tech meetups, EDM, Gym",
      description: "CS grad student in Berlin, frequent visitor to tech hackathons across Germany.",
      usrImg: "avatar2.jpg",
      gender: "Male",
      status: true,
      discoverable: true,
      createdAt: new Date().toISOString()
    }
  ];

  const createdProfiles = [];
  for (const prof of studentProfiles) {
    const existing = users.find(u => u.usrEmail === prof.usrEmail);
    if (!existing) {
      const doc = await insertOne("users", prof);
      createdProfiles.push(doc);
      console.log(`Created student: ${prof.fullName} (${prof.usrEmail})`);
    } else {
      await updateOne("users", existing._id, prof);
      createdProfiles.push({ ...existing, ...prof });
      console.log(`Updated student: ${prof.fullName} (${prof.usrEmail})`);
    }
  }

  // 3. Add an incoming Friend Request from Priya Sharma to current user
  const priya = createdProfiles.find(p => p.fullName === "Priya Sharma");
  if (priya) {
    const existingReq = await getCollection("friendRequests");
    const foundReq = existingReq.find(r => r.fromUsrId === priya._id && r.toUsrId === currentUserId);
    if (!foundReq) {
      await insertOne("friendRequests", {
        fromUsrId: priya._id,
        fromUsrNm: priya.fullName,
        fromUsrImg: priya.usrImg,
        toUsrId: currentUserId,
        toUsrNm: currentUser?.fullName || "Student Stuttgart",
        toUsrImg: currentUser?.usrImg || "default-avatar.jpg",
        status: "Pending",
        createdAt: new Date().toISOString()
      });
      console.log("Added incoming friend request from Priya Sharma to Student Stuttgart");
    }
  }

  // 4. Add an accepted Friendship with Rahul Verma
  const rahul = createdProfiles.find(p => p.fullName === "Rahul Verma");
  if (rahul) {
    const existingFriends = await getCollection("friends");
    const foundFriend = existingFriends.find(f => (f.fromUsrId === rahul._id && f.toUsrId === currentUserId) || (f.fromUsrId === currentUserId && f.toUsrId === rahul._id));
    if (!foundFriend) {
      await insertOne("friends", {
        fromUsrId: rahul._id,
        fromUsrNm: rahul.fullName,
        fromUsrImg: rahul.usrImg,
        toUsrId: currentUserId,
        toUsrNm: currentUser?.fullName || "Student Stuttgart",
        toUsrImg: currentUser?.usrImg || "default-avatar.jpg",
        status: "Accepted",
        createdAt: new Date().toISOString()
      });
      console.log("Added active friendship with Rahul Verma");
    }
  }

  console.log("Seeding for Friends feature completed successfully!");
}

seedFriends()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
