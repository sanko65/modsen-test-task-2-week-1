const prisma = require("./prisma");

async function seed() {
  try {
    await prisma.user.upsert({
      where: { email: "user1@example.com" },
      update: {},
      create: {
        email: "user1@example.com",
        password: "hashed_password_1",
        role: "user",
        logo_url: "https://example.com/logo1.jpg",
      },
    });
    await prisma.user.upsert({
      where: { email: "user2@example.com" },
      update: {},
      create: {
        email: "user2@example.com",
        password: "hashed_password_2",
        role: "moderator",
        logo_url: "https://example.com/logo2.jpg",
      },
    });
    await prisma.user.upsert({
      where: { email: "john.doe@example.com" },
      update: {},
      create: {
        email: "john.doe@example.com",
        password: "hashed_password_1",
        role: "user",
        logo_url: "https://example.com/logos/john_doe_logo.jpg",
      },
    });
    await prisma.user.upsert({
      where: { email: "jane.smith@example.com" },
      update: {},
      create: {
        email: "jane.smith@example.com",
        password: "hashed_password_2",
        role: "moderator",
        logo_url: "https://example.com/logos/jane_smith_logo.jpg",
      },
    });
    await prisma.user.upsert({
      where: { email: "alice.jones@example.com" },
      update: {},
      create: {
        email: "alice.jones@example.com",
        password: "hashed_password_3",
        role: "user",
        logo_url: "https://example.com/logos/alice_jones_logo.jpg",
      },
    });
    await prisma.user.upsert({
      where: { email: "bob.jackson@example.com" },
      update: {},
      create: {
        email: "bob.jackson@example.com",
        password: "hashed_password_4",
        role: "user",
        logo_url: "https://example.com/logos/bob_jackson_logo.jpg",
      },
    });

    await prisma.meetup.upsert({
      where: { meetup_id: 1 },
      update: {},
      create: {
        name: "Meetup 1",
        description: "Description of Meetup 1",
        keywords: ["keyword1", "keyword2"],
        time: new Date("2024-03-01T10:00:00"),
        place: "Location 1",
        creator_id: 1,
      },
    });
    await prisma.meetup.upsert({
      where: { meetup_id: 2 },
      update: {},
      create: {
        name: "Meetup 2",
        description: "Description of Meetup 2",
        keywords: ["keyword3", "keyword4"],
        time: new Date("2024-03-05T15:30:00"),
        place: "Location 2",
        creator_id: 2,
      },
    });
    await prisma.meetup.upsert({
      where: { meetup_id: 3 },
      update: {},
      create: {
        name: "Tech Conference 2024",
        description:
          "Annual technology conference featuring keynote speakers, workshops, and networking opportunities.",
        keywords: ["technology", "conference", "networking"],
        time: new Date("2024-05-15T09:00:00"),
        place: "Convention Center, New York",
        creator_id: 1,
      },
    });
    await prisma.meetup.upsert({
      where: { meetup_id: 4 },
      update: {},
      create: {
        name: "Art Exhibition Opening Night",
        description:
          "Celebrating the opening of a new art exhibition with live music, refreshments, and artist meet-and-greet.",
        keywords: ["art", "exhibition", "culture"],
        time: new Date("2024-06-20T18:00:00"),
        place: "Art Gallery, San Francisco",
        creator_id: 2,
      },
    });
    await prisma.meetup.upsert({
      where: { meetup_id: 5 },
      update: {},
      create: {
        name: "Music Festival 2024",
        description:
          "Three-day music festival featuring top artists from around the world.",
        keywords: ["music", "festival", "concert"],
        time: new Date("2024-07-10T12:00:00"),
        place: "Outdoor Venue, Los Angeles",
        creator_id: 3,
      },
    });
    await prisma.meetup.upsert({
      where: { meetup_id: 6 },
      update: {},
      create: {
        name: "Book Club Meeting",
        description:
          "Monthly book club meeting to discuss latest book selection and enjoy literary discussions.",
        keywords: ["books", "reading", "literature"],
        time: new Date("2024-08-05T19:00:00"),
        place: "Local Coffee Shop, Seattle",
        creator_id: 4,
      },
    });

    console.log("Seeding complited");
  } catch (error) {
    console.log("Error seeding data", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
