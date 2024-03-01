-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('user', 'moderator');

-- CreateTable
CREATE TABLE "attendees" (
    "user_id" INTEGER NOT NULL,
    "meetup_id" INTEGER NOT NULL,

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("user_id","meetup_id")
);

-- CreateTable
CREATE TABLE "meetup" (
    "meetup_id" SERIAL NOT NULL,
    "name" VARCHAR(80),
    "description" TEXT,
    "keywords" VARCHAR(30)[],
    "time" TIMESTAMP(6),
    "place" VARCHAR(50),
    "creator_id" INTEGER,

    CONSTRAINT "meetup_pkey" PRIMARY KEY ("meetup_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "refresh_token" TEXT,
    "role" "user_role" DEFAULT 'user',
    "logo_url" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "user"("email");

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_meetup_id_fkey" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("meetup_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meetup" ADD CONSTRAINT "meetup_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
