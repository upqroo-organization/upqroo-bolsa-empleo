-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contraseña_hash` VARCHAR(191) NOT NULL,
    `foto_url` VARCHAR(255) NULL,
    `tipo_usuario` ENUM('persona', 'empresa') NOT NULL,
    `esta_activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Persona` (
    `usuario_id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `curp` VARCHAR(18) NULL,
    `telefono` VARCHAR(20) NULL,
    `tipo_persona` ENUM('alumno', 'egresado', 'publico') NOT NULL,
    `cv_url` VARCHAR(255) NULL,

    PRIMARY KEY (`usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrativo` (
    `usuario_id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `puesto` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresa` (
    `usuario_id` VARCHAR(191) NOT NULL,
    `nombre_empresa` VARCHAR(191) NOT NULL,
    `rfc` VARCHAR(13) NULL,
    `sitio_web` VARCHAR(255) NULL,
    `linkedin` VARCHAR(255) NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `codigo_postal` VARCHAR(10) NOT NULL,
    `contacto_nombre_completo` VARCHAR(191) NOT NULL,
    `contacto_cargo` VARCHAR(191) NOT NULL,
    `contacto_correo` VARCHAR(191) NOT NULL,
    `contacto_telefono` VARCHAR(20) NOT NULL,
    `anio_fundacion` INTEGER NULL,
    `numero_empleados` INTEGER NULL,
    `beneficios` VARCHAR(191) NULL,
    `cultura_organizacional` VARCHAR(191) NULL,

    PRIMARY KEY (`usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Rol_nombre_rol_key`(`nombre_rol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuarioRol` (
    `usuario_id` VARCHAR(191) NOT NULL,
    `rol_id` INTEGER NOT NULL,

    PRIMARY KEY (`usuario_id`, `rol_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carrera` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Carrera_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vacante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `empresa` VARCHAR(191) NOT NULL,
    `ubicacion` VARCHAR(191) NOT NULL,
    `tipo_empleo` ENUM('Tiempo_completo', 'Medio_tiempo', 'Remoto', 'Practicas', 'Temporal', 'Freelance') NOT NULL,
    `rango_salarial_min` DECIMAL(10, 2) NULL,
    `rango_salarial_max` DECIMAL(10, 2) NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `fecha_publicacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `carrera_id` INTEGER NULL,
    `id_empresa` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Postulacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `persona_id` VARCHAR(191) NOT NULL,
    `vacante_id` INTEGER NOT NULL,
    `fecha_postulacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('pendiente', 'aceptada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    `cv_url` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PracticaProfesional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postulacion_id` INTEGER NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,
    `horas_registradas` INTEGER NOT NULL DEFAULT 0,
    `supervisor_nombre` VARCHAR(191) NOT NULL,
    `supervisor_email` VARCHAR(191) NULL,
    `tutor_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PracticaProfesional_postulacion_id_key`(`postulacion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroHora` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `practica_id` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `horas` INTEGER NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentoPractica` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `practica_id` INTEGER NOT NULL,
    `tipo` ENUM('propuesta', 'reporte_parcial', 'reporte_final', 'carta_aceptacion', 'carta_liberacion', 'otro') NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `fecha_subida` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado_revision` ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',
    `fecha_revision` DATETIME(3) NULL,
    `observaciones` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Persona` ADD CONSTRAINT `Persona_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administrativo` ADD CONSTRAINT `Administrativo_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Empresa` ADD CONSTRAINT `Empresa_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioRol` ADD CONSTRAINT `UsuarioRol_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioRol` ADD CONSTRAINT `UsuarioRol_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vacante` ADD CONSTRAINT `Vacante_carrera_id_fkey` FOREIGN KEY (`carrera_id`) REFERENCES `Carrera`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vacante` ADD CONSTRAINT `Vacante_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `Empresa`(`usuario_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Postulacion` ADD CONSTRAINT `Postulacion_persona_id_fkey` FOREIGN KEY (`persona_id`) REFERENCES `Persona`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Postulacion` ADD CONSTRAINT `Postulacion_vacante_id_fkey` FOREIGN KEY (`vacante_id`) REFERENCES `Vacante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PracticaProfesional` ADD CONSTRAINT `PracticaProfesional_postulacion_id_fkey` FOREIGN KEY (`postulacion_id`) REFERENCES `Postulacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PracticaProfesional` ADD CONSTRAINT `PracticaProfesional_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroHora` ADD CONSTRAINT `RegistroHora_practica_id_fkey` FOREIGN KEY (`practica_id`) REFERENCES `PracticaProfesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentoPractica` ADD CONSTRAINT `DocumentoPractica_practica_id_fkey` FOREIGN KEY (`practica_id`) REFERENCES `PracticaProfesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
