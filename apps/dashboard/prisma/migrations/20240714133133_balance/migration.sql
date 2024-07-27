-- CreateTable
CREATE TABLE "Balance" (
    "available" DOUBLE PRECISION NOT NULL,
    "pending" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("date")
);
