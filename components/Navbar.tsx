'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo } from 'react';
import { LogOut } from 'lucide-react';
import logoUperoo from '../assets/logo_upqroo.svg';
import { Button } from './ui/button';

// Define this elsewhere in your project and import it
// Should be stay on a constant file
const perfilByRole: Record<string, string> = {
  admin: '/admin/perfil',
  external: '/client/perfil',
  company: '/empresa/perfil',
  student: '/client/perfil',
  coordinator: '/coordinator',
};
const navLinksByRole: Record<string, { name: string; href: string }[]> = {
  admin: [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Usuarios', href: '/admin/users' },
  ],
  external: [
    { name: 'Inicio', href: '/client' },
    { name: 'Perfil', href: '/profile' },
  ],
  student: [
    { name: 'Inicio', href: '/client' },
    { name: 'Mis Postulaciones', href: '/client/mis-postulaciones' }
    // { name: 'Mis Prácticas', href: '/client/practicas-profesionales' }
  ],
  company: [
    { name: 'Inicio', href: '/empresa' },
    { name: 'Gestionar Vacantes', href: '/empresa/gestionar-vacante' },
    { name: 'Encuestas', href: '/empresa/encuestas' },
    { name: 'Postulantes', href: '/empresa/postulantes' },
  ],
  coordinator: [
    { name: 'Inicio', href: '/coordinador' },
    { name: 'Validar Empresas', href: '/coordinador/validar-empresa' },
    { name: 'Encuestas', href: '/coordinador/encuestas' },
  ]
};

const ROLE_NAME = {
  admin: "Administrador",
  student: "Estudiante",
  company: "Empresa",
  coordinator: "Coordinador"
}

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session);

  const user = session?.user;
  const role = session?.user.role || ''; // ajusta según cómo guardas el rol
  const navLinks = useMemo(() => navLinksByRole[role] || [], [role]);

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/vacantes' })
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <nav className="bg-white text-white px-4 py-2 shadow-md">
      <div className="w-full mx-auto flex justify-between items-center max-w-[1720px]">
        {/* Logo y nombre del sitio */}
        <div className="flex items-center space-x-1">
          <Link href="/">
            <Image src={logoUperoo} alt="Logo" className='rounded-sm' width={140} height={140} />
          </Link>
          {role in ROLE_NAME && <Badge variant="secondary" className="ml-2">{ROLE_NAME[role as keyof typeof ROLE_NAME]}</Badge>}
        </div>

        {/* Navegación */}
        <ul className="flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-gray-500 text-black hover:underline">
                {link.name}
              </Link>
            </li>
          ))}

          {/* Avatar con dropdown */}
          {user ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer background-gray-800">
                <AvatarImage src={user?.image || ''} />
                <AvatarFallback className='bg-black'>{userInitial}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white text-black">
              <DropdownMenuLabel>{user?.name || 'Usuario'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!['admin', 'coordinator'].includes(role) && <DropdownMenuItem asChild>
                <Link href={perfilByRole[role]}>Perfil</Link>
              </DropdownMenuItem>}
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut color='red' />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <Button onClick={handleGoogleSignIn} className='text-white'>Iniciar sesión</Button>}
        </ul>
      </div>
    </nav>
  );
}
