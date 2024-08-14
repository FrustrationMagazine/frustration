/*
  Warnings:

  - You are about to drop the column `idStatus` on the `BalanceTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `idType` on the `BalanceTransactions` table. All the data in the column will be lost.
  - You are about to drop the `BalanceTransactionStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BalanceTransactionType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `BalanceTransactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `BalanceTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BalanceTransactions" DROP CONSTRAINT "BalanceTransactions_idStatus_fkey";

-- DropForeignKey
ALTER TABLE "BalanceTransactions" DROP CONSTRAINT "BalanceTransactions_idType_fkey";

-- AlterTable
ALTER TABLE "BalanceTransactions" DROP COLUMN "idStatus",
DROP COLUMN "idType",
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "BalanceTransactionStatus";

-- DropTable
DROP TABLE "BalanceTransactionType";
