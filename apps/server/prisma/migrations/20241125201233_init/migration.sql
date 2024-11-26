-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "admin_id" VARCHAR(191) NOT NULL,
    "members" INTEGER[],
    "messages" JSONB[],
    "private" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);
