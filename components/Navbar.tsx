'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo, useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import logoUperoo from '../assets/logo_upqroo.svg';
import { Button } from './ui/button';
import { SurveyNotificationDropdown } from './SurveyNotificationDropdown';
import { usePendingSurveys } from '@/hooks/usePendingSurveys';
import { cn } from '@/lib/utils';

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
    { name: 'Usuarios', href: '/admin/gestion-usuarios' },
  ],
  external: [
    { name: 'Inicio', href: '/client' },
    { name: 'Mis Postulaciones', href: '/client/mis-postulaciones' },
  ],
  student: [
    { name: 'Inicio', href: '/client' },
    { name: 'Mis Postulaciones', href: '/client/mis-postulaciones' }
    // { name: 'Mis Prácticas', href: '/client/practicas-profesionales' }
  ],
  company: [
    { name: 'Inicio', href: '/empresa' },
    { name: 'Gestionar Vacantes', href: '/empresa/gestionar-vacante' },
    { name: 'Eventos', href: '/empresa/eventos' },
    { name: 'Encuestas', href: '/empresa/encuestas' },
    { name: 'Postulantes', href: '/empresa/postulantes' },
  ],
  coordinator: [
    { name: 'Inicio', href: '/coordinador' },
    { name: 'Encuestas de empleabilidad', href: '/coordinador/encuestas' },
    { name: 'Validar Empresas', href: '/coordinador/validar-empresa' },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = session?.user;
  const role = session?.user.role || ''; // ajusta según cómo guardas el rol
  const navLinks = useMemo(() => navLinksByRole[role] || [], [role]);
  const { totalPendingSurveys } = usePendingSurveys();

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/vacantes' })
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <nav className="bg-white text-white shadow-md relative">
      <div className="w-full mx-auto px-4 py-2 max-w-[1720px]">
        <div className="flex justify-between items-center">
          {/* Logo y nombre del sitio */}
          <div className="flex items-center space-x-1">
            <Link href="/" onClick={closeMobileMenu}>
              <Image src={logoUperoo} alt="Logo" className='rounded-sm' width={140} height={140} />
            </Link>
            {role in ROLE_NAME && (
              <Badge variant="secondary" className="ml-2 hidden lg:inline-flex">
                {ROLE_NAME[role as keyof typeof ROLE_NAME]}
              </Badge>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="hover:text-gray-500 text-black hover:underline flex items-center gap-2 transition-colors"
              >
                {link.name}
                {/* Show notification badge for Encuestas link for companies */}
                {role === 'company' && link.href === '/empresa/encuestas' && totalPendingSurveys > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                  >
                    {totalPendingSurveys > 99 ? '99+' : totalPendingSurveys}
                  </Badge>
                )}
              </Link>
            ))}

            {/* Survey notifications for companies */}
            {role === 'company' && <SurveyNotificationDropdown />}

            {/* Desktop User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer background-gray-800">
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className='bg-black'>{userInitial}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white text-black">
                  <DropdownMenuLabel>{user?.name || 'Usuario'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!['admin', 'coordinator'].includes(role) && (
                    <DropdownMenuItem asChild>
                      <Link href={perfilByRole[role]}>Perfil</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut color='red' className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleGoogleSignIn} className='text-white'>
                Iniciar sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button and User Avatar */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Role Badge */}
            {role in ROLE_NAME && (
              <Badge variant="secondary" className="text-xs">
                {ROLE_NAME[role as keyof typeof ROLE_NAME]}
              </Badge>
            )}

            {/* Mobile User Avatar */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer background-gray-800 h-8 w-8">
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className='bg-black text-sm'>{userInitial}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white text-black">
                  <DropdownMenuLabel className="text-sm">{user?.name || 'Usuario'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!['admin', 'coordinator'].includes(role) && (
                    <DropdownMenuItem asChild>
                      <Link href={perfilByRole[role]} onClick={closeMobileMenu}>Perfil</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut color='red' className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-black hover:bg-gray-100 p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Link href="/" onClick={closeMobileMenu}>
              <Image src={logoUperoo} alt="Logo" className='rounded-sm' width={120} height={120} />
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileMenu}
            className="text-black hover:bg-gray-100 p-2"
            aria-label="Close mobile menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* User Info Section */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.image || ''} />
                  <AvatarFallback className='bg-black text-white'>{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                  {role in ROLE_NAME && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {ROLE_NAME[role as keyof typeof ROLE_NAME]}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-3 py-3 text-black hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <span className="font-medium">{link.name}</span>
                  {/* Show notification badge for Encuestas link for companies */}
                  {role === 'company' && link.href === '/empresa/encuestas' && totalPendingSurveys > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                    >
                      {totalPendingSurveys > 99 ? '99+' : totalPendingSurveys}
                    </Badge>
                  )}
                </Link>
              ))}

              {/* Survey Notifications for companies */}
              {role === 'company' && (
                <div className="px-3 py-2">
                  <SurveyNotificationDropdown />
                </div>
              )}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Profile Link */}
            {user && !['admin', 'coordinator'].includes(role) && (
              <Link
                href={perfilByRole[role]}
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium">Mi Perfil</span>
              </Link>
            )}

            {/* Login/Logout Button */}
            {user ? (
              <Button
                onClick={() => {
                  signOut();
                  closeMobileMenu();
                }}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  handleGoogleSignIn();
                  closeMobileMenu();
                }} 
                className='w-full text-white'
              >
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
