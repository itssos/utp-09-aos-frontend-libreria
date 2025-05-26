// src/constants/navConfig.js
import {
  HomeIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  Cog6ToothIcon,
  UsersIcon,
  DocumentCurrencyDollarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  PencilIcon,
  TagIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  Square2StackIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
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
    // visible para todos
  },
  {
    name: "Admin Productos",
    path: ROUTES.ADMIN_PRODUCTS,
    Icon: ShoppingBagIcon,
    permissions: ['GET_PRODUCTS']
  },
  {
    name: "Editoriales",
    path: ROUTES.ADMIN_EDITORIALS,
    Icon: BookOpenIcon,
    permissions: ['GET_EDITORIALS']
  },
  {
    name: "Autores",
    path: ROUTES.ADMIN_AUTHORS,
    Icon: PencilIcon,
    permissions: ['GET_AUTHORS']
  },
  {
    name: "Categorias",
    path: ROUTES.ADMIN_CATEGORIES,
    Icon: TagIcon,
    permissions: ['GET_CATEGORIES']
  },
  {
    name: "Inventario",
    path: ROUTES.ADMIN_STOCK_MOVEMENT,
    Icon: ArrowsRightLeftIcon,
    permissions: ['GET_STOCK_MOVEMENTS']
  },
  {
    name: "Ventas",
    path: ROUTES.ADMIN_SALES,
    Icon: CurrencyDollarIcon,
    permissions: ['GET_SALES']
  },
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    Icon: ChartBarSquareIcon,
    permissions: ['REPORTS_VIEW'],
  },
  {
    name: 'Roles',
    path: ROUTES.ADMIN_ROLES,
    Icon: ShieldCheckIcon,
    permissions: ['GET_ROLES']
  },
  {
    name: 'Usuarios',
    path: ROUTES.ADMIN_USERS,
    Icon: UsersIcon,
    permissions: ['GET_PERSONS'],
  }
]