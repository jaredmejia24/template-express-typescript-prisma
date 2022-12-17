import { prisma } from "../../utils/db.utils";

const main = async () => {
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      email: "admin@gmail.com",
      password: "pass1234",
      name: "admin",
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "jared@gmail.com" },
    update: {},
    create: {
      email: "jared@gmail.com",
      password: "pass1234",
      name: "Jared Mejia",
    },
  });

  await prisma.user.upsert({
    where: { email: "alberto@gmail.com" },
    update: {},
    create: {
      email: "alberto@gmail.com",
      password: "pass1234",
      name: "Alberto Rene",
    },
  });

  await prisma.user.upsert({
    where: { email: "boberto@gmail.com" },
    update: {},
    create: {
      email: "boberto@gmail.com",
      password: "pass1234",
      name: "Boberto Paredes",
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
