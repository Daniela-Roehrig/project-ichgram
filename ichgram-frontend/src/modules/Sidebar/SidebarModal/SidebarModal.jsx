import styles from "./SidebarModal.module.css";

export default function SidebarModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>

        {children}
      </div>
    </> 
  );
}
