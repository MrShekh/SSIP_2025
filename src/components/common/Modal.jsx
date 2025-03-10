import React from 'react';
import PropTypes from 'prop-types';
import { HiX } from 'react-icons/hi';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'medium'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="modal-overlay active">
      <div className={`modal ${sizeClasses[size]}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="close-button"
            onClick={onClose}
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <div className="modal-content">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'full'])
};

export default Modal;
