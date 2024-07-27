/*
  Warnings:

  - You are about to drop the column `updated_at` on the `BalanceTransactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BalanceTransactions" DROP COLUMN "updated_at",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
