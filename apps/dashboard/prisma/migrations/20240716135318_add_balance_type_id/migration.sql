/*
  Warnings:

  - You are about to drop the column `type` on the `BalanceTransactions` table. All the data in the column will be lost.
  - Added the required column `idType` to the `BalanceTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BalanceTransactions" DROP COLUMN "type",
ADD COLUMN     "idType" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BalanceTransactionType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "BalanceTransactionType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BalanceTransactionType_type_key" ON "BalanceTransactionType"("type");

-- AddForeignKey
ALTER TABLE "BalanceTransactions" ADD CONSTRAINT "BalanceTransactions_idType_fkey" FOREIGN KEY ("idType") REFERENCES "BalanceTransactionType"("type") ON DELETE RESTRICT ON UPDATE CASCADE;
