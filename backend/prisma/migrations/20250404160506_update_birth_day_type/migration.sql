/*
  Warnings:

  - You are about to alter the column `birth_day` on the `NguoiDung` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `NguoiDung` MODIFY `birth_day` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ViTri` MODIFY `hinh_anh` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `BinhLuan` ADD CONSTRAINT `BinhLuan_ma_cong_viec_fkey` FOREIGN KEY (`ma_cong_viec`) REFERENCES `Phong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
