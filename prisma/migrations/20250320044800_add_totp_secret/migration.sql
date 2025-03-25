-- CreateTable
CREATE TABLE `totp_secret` (
    `id` VARCHAR(25) NOT NULL,
    `user_id` VARCHAR(25) NOT NULL,
    `secret` VARCHAR(64) NOT NULL,
    `exipre_le` DATETIME(3) NOT NULL,

    UNIQUE INDEX `totp_secret_user_id_key`(`user_id`),
    INDEX `index_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `totp_secret` ADD CONSTRAINT `totp_secret_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
