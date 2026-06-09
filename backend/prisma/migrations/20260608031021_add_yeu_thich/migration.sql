-- CreateTable
CREATE TABLE `YeuThich` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_nguoi_dung` INTEGER NOT NULL,
    `ma_phong` INTEGER NOT NULL,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `YeuThich_ma_nguoi_dung_fkey`(`ma_nguoi_dung`),
    INDEX `YeuThich_ma_phong_fkey`(`ma_phong`),
    UNIQUE INDEX `YeuThich_ma_nguoi_dung_ma_phong_key`(`ma_nguoi_dung`, `ma_phong`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `YeuThich` ADD CONSTRAINT `YeuThich_ma_nguoi_dung_fkey` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `NguoiDung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YeuThich` ADD CONSTRAINT `YeuThich_ma_phong_fkey` FOREIGN KEY (`ma_phong`) REFERENCES `Phong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
