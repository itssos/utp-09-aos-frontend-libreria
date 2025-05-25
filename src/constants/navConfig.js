// src/constants/navConfig.js
import {
  HomeIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  Cog6ToothIcon,
  UsersIcon,
  DocumentCurrencyDollarIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { ROUTES } from './routes'

/**
 * Cada objeto define:
 * - name: etiqueta a mostrar
 * - path: ruta (o action para botones)
 * - Icon: componente HeroIcon
 * - roles: array de roles que pueden verlo
 *   usa 'GUEST' para no autenticados
 */
export const NAV_CONFIG = [
  {
    name: 'Productos',
    path: ROUTES.HOME,
    Icon: BookOpenIcon
  },


  {
    name: "Admin Productos",
    path: ROUTES.ADMIN_PRODUCTS,
    Icon: BookOpenIcon,
    roles: ['ADMINISTRADOR']
  },


  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    Icon: HomeIcon,
    roles: ['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'APODERADO'],
  },
  {
    name: 'Usuarios',
    path: ROUTES.ROLE_MANAGEMENT,
    Icon: UsersIcon,
    roles: ['ADMINISTRADOR'],
  }
]
