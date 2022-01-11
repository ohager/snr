-- CreateTable
CREATE TABLE `scan_peermonitor` (
    `announced_address` VARCHAR(255) NOT NULL,
    `platform` VARCHAR(255) NOT NULL,
    `application` VARCHAR(255) NOT NULL,
    `version` VARCHAR(255) NOT NULL,
    `height` INTEGER NOT NULL,
    `cumulative_difficulty` VARCHAR(255) NOT NULL,
    `state` SMALLINT UNSIGNED NOT NULL,
    `downtime` INTEGER UNSIGNED NOT NULL,
    `lifetime` INTEGER UNSIGNED NOT NULL,
    `availability` DOUBLE NOT NULL,
    `last_online_at` DATETIME(3) NOT NULL,
    `modified_at` DATETIME(3) NOT NULL,
    `reward_state` VARCHAR(255) NOT NULL DEFAULT 'None',
    `reward_time` DATETIME(3) NULL,

    PRIMARY KEY (`announced_address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
