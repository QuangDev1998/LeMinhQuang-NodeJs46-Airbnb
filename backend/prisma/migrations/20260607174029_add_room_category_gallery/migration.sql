-- AlterTable
ALTER TABLE `Phong` ADD COLUMN `danh_sach_anh` TEXT NULL,
    ADD COLUMN `loai_phong` VARCHAR(191) NOT NULL DEFAULT 'Phòng';
