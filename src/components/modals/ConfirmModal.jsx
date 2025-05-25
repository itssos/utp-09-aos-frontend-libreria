import Modal from '../UI/Modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; // O cualquier ícono que prefieras

/**
 * Modal de confirmación reutilizable
 *
 * @param {{
 *   trigger: React.ReactNode,
 *   title?: string,
 *   message?: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   onConfirm?: () => void,
 *   onCancel?: () => void,
 *   size?: 'sm'|'md'|'lg'|'xl',
 *   confirmClassName?: string,
 *   cancelClassName?: string,
 * }} props
 */
export default function ConfirmModal({
  trigger,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  size = 'sm',
  confirmClassName = 'bg-red-600 text-white hover:bg-red-700',
  cancelClassName = 'bg-gray-200 text-gray-700 hover:bg-gray-300',
}) {
  return (
    <Modal
      trigger={trigger}
      title={title}
      size={size}
      actions={[
        {
          label: cancelLabel,
          onClick: onCancel,
          className: cancelClassName,
          closeOnClick: true, // Cierra al cancelar
        },
        {
          label: confirmLabel,
          onClick: onConfirm,
          className: confirmClassName,
          closeOnClick: true, // Cierra al confirmar
        },
      ]}
    >
      <div className="flex items-center gap-3">
        <ExclamationTriangleIcon className="h-8 w-8 text-red-500 flex-shrink-0" />
        <span>{message}</span>
      </div>
    </Modal>
  );
}
