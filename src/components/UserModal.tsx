'use client'

import Modal from './Modal'
import UserForm from './UserForm'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UserModal({ isOpen, onClose, onSuccess }: UserModalProps) {
  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Novo Usuário"
    >
      <UserForm
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  )
}
