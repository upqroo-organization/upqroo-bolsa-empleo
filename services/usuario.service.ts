import { prisma } from '@/lib/prisma';

export async function obtenerUsuarios() {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: usuarios,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: 'Error al obtener usuarios',
    };
  }
}

export async function crearUsuario(userData: {
  name: string;
  username: string;
  email: string;
  roleId?: string;
}) {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'El correo electrónico ya está en uso',
      };
    }

    // Check if username already exists
    if (userData.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      if (existingUsername) {
        return {
          success: false,
          error: 'El nombre de usuario ya está en uso',
        };
      }
    }

    // Get default role if not provided
    let roleId = userData.roleId;
    if (!roleId) {
      const defaultRole = await prisma.role.findUnique({
        where: { name: 'student' },
      });
      roleId = defaultRole?.id;
    }

    const nuevoUsuario = await prisma.user.create({
      data: {
        name: userData.name.trim(),
        username: userData.username?.trim(),
        email: userData.email.trim(),
        roleId: roleId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: nuevoUsuario,
      message: 'Usuario creado correctamente',
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: 'Error al crear usuario',
    };
  }
}