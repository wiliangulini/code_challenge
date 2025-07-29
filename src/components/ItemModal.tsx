'use client'

import { Item } from '@/types/item'
import Modal from './Modal'
import ItemForm from './ItemForm'

interface ItemModalProps {
  isOpen: boolean
  onClose: () => void
  item?: Item
  onSuccess: () => void
}

export default function ItemModal({ isOpen, onClose, item, onSuccess }: ItemModalProps) {
  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Editar Item' : 'Novo Item'}
    >
      <ItemForm
        item={item}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  )
}
