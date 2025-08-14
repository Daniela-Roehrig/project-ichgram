import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Notification.module.css";
import getAvatarUrl from "../../shared/components/Avatar/AvatarUrl";
import OtherPostModal from "../../modules/OtherPostModal/OtherPostModal";


export default function Notification({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);


  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setNotifications(res.data.data);
        setLoading(false);
      } catch (err) {
        setError("Fehler beim Laden der Benachrichtigungen");
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  if (loading) return <div className={styles.loading}>Lade Benachrichtigungen...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  function handleOpenPost(notificationId, post) {
    setSelectedPost(post);

    setNotifications((prev) =>
      prev.filter((notif) => notif._id !== notificationId)
    );
  }


  function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    }

    const diffInMonths = Math.floor(diffInWeeks / 4);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y`;
  }

  return (
    <div className={styles.notificationPanel}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>

      <h2 className={styles.h2}>Notifications</h2>
      <span className={styles.span}>New</span>

      {notifications.length === 0 && <p>No new notifications</p>}

      <ul className={styles.notificationList}>
        {notifications.map((notif) => (
          <li key={notif._id} className={styles.notificationItem}>
            <img
              src={getAvatarUrl(notif.actor?.avatar)}
              alt={`${notif.actor?.username} Avatar`}
              className={styles.avatar}
            />

            <div className={styles.content}>
              <p>
                <strong>{notif.actor?.username}</strong>{" "}
                <span>
                  {notif.type === "comment"
                    ? "commented your photo"
                    : "liked your photo"}
                </span>
                <span className={styles.timeAgo}>
                  {formatTimeAgo(notif.createdAt)}
                </span>
              </p>
            </div>

            {notif.post?.image && (
              <img
                src={notif.post.image}
                alt="Post Bild"
                className={styles.postImage}
                onClick={() => handleOpenPost(notif._id, notif.post)}

                style={{ cursor: "pointer" }}
              />
            )}

            {selectedPost && (
              <div className={styles.modalOverlay}>
                <OtherPostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
              </div>
            )}


          </li>
        ))}
      </ul>
    </div>
  );
}
