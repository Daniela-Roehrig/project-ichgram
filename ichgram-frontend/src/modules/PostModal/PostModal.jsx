import { useState, useEffect, useRef } from "react";
import { X, Heart, MessageCircle, Smile, Bookmark, Send } from "lucide-react";
import { useUser } from "../../context/UserContext";
import EditPostMenu from "../EditPostMenu/EditPostMenu";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import styles from "./PostModal.module.css";
import axios from "axios";
import getAvatarUrl from "../../shared/components/Avatar/AvatarUrl";

// ...


export default function PostModal({ post, onClose }) {
  const { user: currentUser } = useUser();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showEditDescription, setShowEditDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post?.description || "");
  const [showInput, setShowInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postLikes, setPostLikes] = useState(post?.likes || 0);

  const inputRef = useRef(null);


  function getRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Heute";
    if (isYesterday) return "Gestern";

    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
useEffect(() => {
  setPostLikes(post?.likes || 0);
}, [post]);

  // 🔧 Post-Like Funktion
  const handleLikePost = async () => {
    try {
      const token = localStorage.getItem("token");

      // Optional: Backend-API-Call (nur wenn du sowas im Backend hast)
      await axios.post(
        `/api/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPostLikes((prev) => prev + 1);
    } catch (error) {
      console.error("Fehler beim Liken des Posts:", error);
    }
  };


  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`/api/comments/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };




  useEffect(() => {
    if (post?._id) {
      fetchComments();
    }
  }, [post?._id]);

  const postUser = {
    username: post?.author?.username || "Unknown",
    avatar: "/default-avatar.jpg", 
  };

  useEffect(() => {
    if (!post) return;

    if (post.comments && post.comments.length > 0) {
      setComments(
        post.comments.map((c) => ({
          _id: c._id || Date.now() + Math.random(),
          username: c.username || "Unknown",
          avatar: c.avatar || "/default-avatar.jpg",
          text: c.text || "",
          likes: c.likes || 0,
        }))
      );
    } else if (post.description) {
      setComments(
        post.description.split("\n\n").map((text, index) => ({
          _id: Date.now() + index,
          username: currentUser?.username || "Anonymous",
          avatar: currentUser?.avatar || "/default-avatar.jpg",
          text,
          likes: 0,
        }))
      );
    } else {
      setComments([]);
    }
  }, [post, currentUser]);


  const handleAddComment = (text = newComment) => {
    if (!text.trim()) return;

    const commentObj = {
      _id: Date.now() + Math.random(),
      username: currentUser?.username || "Anonymous",
      avatar: currentUser?.avatar || "/default-avatar.jpg",
      text,
      likes: 0,
    };

    setComments((prev) => [...prev, commentObj]);
    setNewComment("");
  };

  const handleLikeComment = (id) => {
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);



  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          {/* Linkes Bild */}
          {post?.image && (
            <div className={styles.imageWrapper}>
              <img src={post.image} alt="post" className={styles.postImage} />
            </div>
          )}

          {/* Kommentarbereich rechts */}
          <div className={styles.commentSection}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.userInfo}>
                <img
                  src={postUser.avatar}
                  alt="avatar"
                  className={styles.commentAvatar}
                />
                <span className={styles.username}>{postUser.username}</span>

              </div>

              <button className={styles.closeButton} onClick={onClose}>
                <X />
              </button>
            </div>

            {/* <div className={styles.postDescription}>
  {editedDescription}
</div> */}
            <div className={styles.postDescriptionWrapper}>
              <img
                src={getAvatarUrl(postUser.avatar)}
                alt="avatar"
                className={styles.commentAvatar}  // oder ggf. eigener Style für größeren Avatar
              />
              <p className={styles.postDescription}>{editedDescription}</p>
            </div>


            {/* Kommentare */}
            <div className={styles.commentsList}>
              {comments.map((c) => (
                <div key={c._id} className={styles.comment}>
                  <img
                    src={getAvatarUrl(c.avatar)}
                    alt="avatar"
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentContent}>
                    <span className={styles.commentUser}>{c.username}</span>
                    <span className={styles.commentText}>{c.text}</span>
                  </div>
                  <button className={styles.iconButton} onClick={handleLikePost}>
                    <Heart size={24} />
                  </button>

                </div>
              ))}


            </div>

            {/* Neue Kommentare (wird nur angezeigt, wenn showInput true ist) */}
            {showInput && (
              <div className={styles.newComment}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
            )}

            {/* Footer Interaktion */}
            <div className={styles.interactionArea}>
              {/* Neue Struktur: Icons oben */}
              <div className={styles.interactionIcons}>
    <button onClick={handleLikePost}>
  <Heart size={24} />
</button>


                <button className={styles.iconButton} onClick={() => setShowInput((prev) => !prev)}>
                  <MessageCircle size={24} />
                </button>

                <button className={styles.iconButton} type="button" onClick={() => handleAddComment()}>
                  <Send size={24} />
                </button>

                <button
                  className={styles.menuButton}
                  onClick={() => setShowEditOptions((prev) => !prev)}
                >
                  <Bookmark size={24} />
                </button>
              </div>

              {/* Like-Zähler */}
              <div className={styles.likeInfo}>
                <strong>{postLikes} likes</strong>
              </div>



              {/* Letzte Aktivität */}
              <div className={styles.activityInfo}>
                {getRelativeDate(post.updatedAt || post.createdAt)}
              </div>

              {/* Smiley bleibt unten */}
              <div className={styles.footerBottom}>
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className={styles.emojiPickerContainer}>
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji) => {
                        setNewComment((prev) => prev + emoji.native);
                        setShowEmojiPicker(false);
                        inputRef.current?.focus();
                      }}
                    />
                  </div>
                )}

                {/* Smiley links */}
                <div className={styles.smiley}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <Smile size={24} />
                  </button>
                </div>

                {/* Spacer zwischen Smiley und Save */}
                <div className={styles.footerSpacer}></div>

                {/* Save-Button rechts */}
                <button
                  className={styles.saveButton}
                  disabled={!newComment.trim()}
                  onClick={handleAddComment}
                >
                  Save
                </button>
              </div>

            </div>

            {/* EditPostMenu außerhalb, damit es sich überlappt */}
            {showEditOptions && (
              <>
  
                < EditPostMenu

                  post={post}
                  token={localStorage.getItem("token")} // ← token übergeben
                  onClose={() => setShowEditOptions(false)}
                  onPostUpdated={(updatedPost) => {
                    // onPostUpdated={(newPost) => setSelectedPost(newPost)}
                    // optional: aktualisiere Beschreibung direkt
                    setEditedDescription(updatedPost.description);
                  }}
                  onPostDeleted={() => {
                    // Schließe das Modal und informiere ggf. den Feed
                    onClose();
                  }}
                /></>
            )}

          </div>
        </div>
      </div>
    </div >

  );
}
