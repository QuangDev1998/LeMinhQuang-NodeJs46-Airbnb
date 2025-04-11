/*
  Warnings:

  - You are about to drop the column `ma_cong_viec` on the `BinhLuan` table. All the data in the column will be lost.
  - You are about to alter the column `gender` on the `NguoiDung` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - Added the required column `ma_phong` to the `BinhLuan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BinhLuan` DROP FOREIGN KEY `BinhLuan_ma_cong_viec_fkey`;

-- DropIndex
DROP INDEX `BinhLuan_ma_cong_viec_fkey` ON `BinhLuan`;

-- AlterTable
ALTER TABLE `BinhLuan` DROP COLUMN `ma_cong_viec`,
    ADD COLUMN `ma_phong` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `NguoiDung` MODIFY `gender` BOOLEAN NOT NULL;

-- CreateIndex
CREATE INDEX `BinhLuan_ma_phong_fkey` ON `BinhLuan`(`ma_phong`);

-- AddForeignKey
ALTER TABLE `BinhLuan` ADD CONSTRAINT `BinhLuan_ma_phong_fkey` FOREIGN KEY (`ma_phong`) REFERENCES `Phong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
