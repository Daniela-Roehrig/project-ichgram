
import { useState, useEffect } from "react";
import styles from "./EditPostMenu.module.css";
import axios from "axios";

export default function EditPostMenu({
  post,
  token,
  onClose,
  onPostUpdated,
  onPostDeleted,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post.description || "");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  // Kommentar löschen
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Kommentar wirklich löschen?")) return;
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Fehler beim Löschen des Kommentars:", err);
    }
  };

  const openEditModal = () => setShowEditModal(true);

useEffect(() => {
  if (post.comments && post.comments.length > 0) {
    setComments(post.comments);
  }
}, [post.comments]);


  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `/api/posts/${post._id}`,
        { description: editedDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdated(res.data.post);
      setShowEditModal(false);
      onClose();
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Speichern fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Diesen Post wirklich löschen?")) return;
    try {
      setLoading(true);
      await axios.delete(`/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onPostDeleted(post._id);
      onClose();
    } catch (err) {
      console.error("Fehler beim Post-Löschen:", err);
      alert("Löschen fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(link)
      .then(() => alert("Link kopiert!"))
      .catch(() => alert("Fehler beim Kopieren."));
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
          <button className={`${styles.button} ${styles.delete}`} onClick={handleDeletePost}>Delete</button>
          <button className={styles.button} onClick={openEditModal}>Edit</button>
          <button className={styles.button} onClick={handleCopyLink}>Copy Link</button>
          <button className={styles.button} onClick={onClose}>Cancel</button>
        </div>
      </div>

      {showEditModal && (
        <div className={styles.overlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.imageContainer}>
              <img
                src={post.image}
                alt="Post"
                className={styles.imagePreview}
              />
            </div>

            <div className={styles.rightSide}>
              <textarea
                className={styles.textarea}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                disabled={loading}
              />

              <ul className={styles.commentList}>
                {comments.length === 0 && <li className={styles.noComments}>Keine Kommentare vorhanden.</li>}
                {comments.map((c) => (
                  <li key={c._id} className={styles.commentItem}>
                    <img src={c.avatar || "/default-avatar.jpg"} alt="avatar" className={styles.commentAvatar} />
                    <span className={styles.commentUsername}>{c.username}</span>
                    <span className={styles.commentText}>{c.text}</span>
                    <button
                      className={styles.deleteCommentBtn}
                      title="Kommentar löschen"
                      onClick={() => handleDeleteComment(c._id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={loading || !editedDescription.trim()}
              >
                {loading ? "Speichern..." : "Speichern"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
