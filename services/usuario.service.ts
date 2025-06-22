import { prisma } from '@/lib/prisma';

export const obtenerUsuarios = async () => {
  return prisma.usuario.findMany({
    include: {
      persona: true,
      empresa: true,
      administrativo: true,
      roles: {
        include: { rol: true },
      },
    },
  });
};

export const crearUsuario = async (data: {
  email: string;
  contraseña_hash: string;
  tipo_usuario: 'persona' | 'empresa';
  persona?: {
    nombre: string;
    apellidos: string;
    tipo_persona: 'alumno' | 'egresado' | 'publico';
  };
}) => {
  return prisma.usuario.create({
    data: {
      email: data.email,
      contraseña_hash: data.contraseña_hash,
      tipo_usuario: data.tipo_usuario,
      persona: data.persona
        ? {
            create: data.persona,
          }
        : undefined,
    },
  });
};
