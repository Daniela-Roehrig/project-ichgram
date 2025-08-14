
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchPanel.module.css";
import axios from "../../shared/api/instance";
import { X } from "lucide-react";
import { useUser } from "../../context/UserContext";

export default function SearchPanel({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { user } = useUser();
  const currentUserId = user?._id; 
  const navigate = useNavigate();
  const inputRef = useRef();
  const API_BASE = "http://localhost:3000/";
 
  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    const url = avatar.startsWith("http") ? avatar : `http://localhost:3000${avatar}`;
    return url;
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleUserClick = (userId) => {
    if (userId === currentUserId) {
      navigate("/profile");
    } else {
      navigate(`/users/${userId}`);
    }
    onClose();
  };

  useEffect(() => {
    if (!query.trim()) return setResults([]);

    const timeout = setTimeout(() => {
      axios
        .get(`/users/search?q=${query}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={onClose} className={styles.closeBtn}>
          <X size={15} />
        </button>
      </div>

      <div className={styles.results}>
        {results.length === 0 ? (
          <div className={styles.noResults}>Keine Benutzer gefunden</div>
        ) : (
          results.map((user) => (
            <div
              key={user._id}
              className={styles.result}
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={getAvatarUrl(user.avatar)} // Hier wurde `user.avatar` verwendet statt `selectedUser.avatar`
                alt={`${user.fullname || user.username} Avatar`}  // Der Benutzername oder vollständiger Name des jeweiligen Users
                className={styles.chatAvatar}
              />
              <span>{user.username}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
