import { createPortal } from "react-dom";
import { ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}
export default function Modal({ isOpen, onClose, children }: ModalProps) {
	if (!isOpen) return null;

	return createPortal(
		<div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>,
		document.body
	);
}
