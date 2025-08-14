import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  Home,
  Search,
  Compass,
  MessageSquare,
  Heart,
  PlusSquare,
  User,
} from "lucide-react";

import SidebarModal from "./SidebarModal/SidebarModal";
import styles from "./Sidebar.module.css";
import logo from "../../assets/icons/ichgramLogo.svg";
import CreateModal from "./CreateModal/CreateModal";
import SearchPanel from "../SearchPanel/SearchPanel";
import MessagesModal from "../MessagesModal/MessagesModal";
import Notification from "../Notification/Notification";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search, isModal: true },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/messages", label: "Messages", icon: MessageSquare, isModal: true },
  { to: "/notifications", label: "Notifications", icon: Heart, isModal: true },
  { to: "/create", label: "Create", icon: PlusSquare, isModal: true },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ onCreateClick }) {
  const { user } = useUser();
  const [modalOpen, setModalOpen] = useState(null);
  const openModal = (type) => setModalOpen(type);
  const closeModal = () => setModalOpen(null);

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img src={logo} alt="Ichgram Logo" />
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ to, label, icon: Icon, isModal }) => {
            const isProfile = to === "/profile";

            if (isModal) {
              return (
                <div
                  key={label}
                  className={styles.link}
                  role="button"
                  tabIndex={0}
                  onClick={() => openModal(label.toLowerCase())}
                  onKeyDown={(e) => e.key === "Enter" && openModal(label.toLowerCase())}
                >
                  <Icon className={styles.icon} />
                  <span>{label}</span>
                </div>
              );
            }

            return (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
              >
                {label === "Profile" && user?.avatar ? (
                  <div className={styles.sidebarAvatarWrapper}>
                    <img
                      className={styles.sidebarAvatar}
                      src={
                        user.avatar.startsWith("http")
                          ? user.avatar
                          : `http://localhost:3000${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`
                      }
                      alt={`${user.username}'s avatar`}
                    />
                  </div>
                ) : (
                  <Icon className={styles.icon} />
                )}
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

     
      {modalOpen !== null && modalOpen !== "create" && (
        <SidebarModal isOpen onClose={closeModal}>
          {modalOpen === "search" && <SearchPanel onClose={closeModal} />}
          {modalOpen === "notifications" && <Notification onClose={closeModal} />}
          {modalOpen === "messages" && (
            <MessagesModal currentUserId="me" onClose={closeModal} />
          )}
        </SidebarModal>
      )}

      
      {modalOpen === "create" && <CreateModal onClose={closeModal} />}
    </>
  );
}
