-- CreateTable
CREATE TABLE "BalanceTransactions" (
    "id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "available" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "net" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "BalanceTransactions_pkey" PRIMARY KEY ("id")
);
