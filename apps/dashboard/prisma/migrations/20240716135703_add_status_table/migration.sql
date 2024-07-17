/*
  Warnings:

  - You are about to drop the column `status` on the `BalanceTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BalanceTransactions` table. All the data in the column will be lost.
  - Added the required column `idStatus` to the `BalanceTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BalanceTransactions" DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "idStatus" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "BalanceTransactionStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "BalanceTransactionStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BalanceTransactionStatus_status_key" ON "BalanceTransactionStatus"("status");

-- AddForeignKey
ALTER TABLE "BalanceTransactions" ADD CONSTRAINT "BalanceTransactions_idStatus_fkey" FOREIGN KEY ("idStatus") REFERENCES "BalanceTransactionStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
