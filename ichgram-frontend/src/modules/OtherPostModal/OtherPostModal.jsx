import React, { useState, useEffect, useRef } from "react";
import { X, Heart, MessageCircle, Smile } from "lucide-react";
import { useUser } from "../../context/UserContext";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import styles from "./OtherPostModal.module.css";
import axios from "axios";
import getAvatarUrl from "../../shared/components/Avatar/AvatarUrl";
import FollowButton from "../../shared/components/FollowButton/FollowButton";

export default function PostModal({ post, onClose }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const { user: currentUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const postUser = post?.author && post.author._id
    ? {
      username: post.author.username,
      avatar: getAvatarUrl(post.author.avatar),
      _id: post.author._id,
    }
    : {
      username: "Unbekannt",
      avatar: getAvatarUrl(null),
      _id: null,
    };

  // Kommentare laden
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Fehler beim Laden der Kommentare:", err);
    }
  };

  useEffect(() => {
    if (post?._id) fetchComments();
  }, [post?._id]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        const res = await axios.get(`/follow/status/${postUser._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Fehler beim Prüfen des Follow-Status:", err);
      }
    };
    if (currentUser?._id && postUser._id !== currentUser._id) {
      checkIfFollowing();
    }
  }, [currentUser, postUser._id]);

  const handleLikePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.post(
        `/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      post.likedByUser = res.data.likedByUser;
      post.likes = res.data.likesCount;

    } catch (err) {
      console.error("Fehler beim Liken des Posts:", err);
    }
  };

  const handleLikeComment = async (id) => {
    try {
      const res = await axios.post(
        `/api/comments/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setComments((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
              ...c,
              likes: res.data.likesCount,
              likedByUser: res.data.likedByUser,
            }
            : c
        )
      );
    } catch (err) {
      console.error("Fehler beim Liken des Kommentars:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bitte einloggen");
      return;
    }
    try {
      const res = await axios.post(
        `/api/posts/${post._id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      setComments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Fehler beim Hinzufügen des Kommentars:", err);
    }
  };

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  console.log("Populated post:", post);


  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          {post?.image && (
            <div className={styles.imageWrapper}>
              <img src={post.image} alt="post" className={styles.postImage} />
            </div>
          )}

          <div className={styles.commentSection}>

            <div className={styles.header}>
              <div className={styles.userInfo}>
                <img src={postUser.avatar} alt="avatar" className={styles.avatar} />
                <div className={styles.nameAndFollow}>
                  <span className={styles.username}>{postUser.username}</span>
                  {postUser._id !== currentUser?._id && (
                    <FollowButton
                      targetUserId={postUser._id}
                      currentUserId={currentUser._id}
                      isFollowing={isFollowing}
                      onFollowChange={setIsFollowing}
                    />
                  )}
                </div>
              </div>
              <button className={styles.closeButton} onClick={onClose}>
                <X />
              </button>
            </div>

            {post.description && (
              <div className={styles.postDescriptionBlock}>
                <div className={styles.userInfoInBody}>
                  <img src={postUser.avatar} alt="avatar" className={styles.avatarSmall} />
                  <span className={styles.usernameInBody}>{postUser.username}</span>
                </div>
                <p className={styles.descriptionText}>{post.description}</p>
              </div>
            )}

            <div className={styles.commentsList}>
              {comments.map((c) => (
                <div key={c._id} className={styles.comment}>
                  <img
                    src={getAvatarUrl(c.user?.avatar)}
                    alt="avatar"
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentContent}>
                    <span className={styles.commentUser}>
                      {c.user?.username || "Unbekannt"}
                    </span>
                    <span className={styles.commentText}>{c.text}</span>
                  </div>
                  <button
                    className={`${styles.iconButton} ${c.likedByUser ? styles.liked : ""}`}
                    onClick={() => handleLikeComment(c._id)}
                  >
                    <Heart size={18} /> {c.likes}
                  </button>
                </div>
              ))}
            </div>

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

            <div className={styles.interactionArea}>
              <div className={styles.interactionIcons}>
                <button
                  className={`${styles.iconButton} ${post.likedByUser ? styles.liked : ""}`}
                  onClick={handleLikePost}
                >
                  <Heart size={24} />
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => setShowInput((prev) => !prev)}
                >
                  <MessageCircle size={24} />
                </button>
              </div>
              <div className={styles.likeInfo}>
                <strong>{post.likes || 0} likes</strong>
              </div>
            </div>

            <div className={styles.activityInfo}>
              {new Date(post.createdAt).toLocaleDateString("de-DE")}
            </div>
            <div className={styles.footerBottom}>
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
              <div className={styles.smiley}>
                <button
                  className={styles.iconButton}
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <Smile size={24} />
                </button>
              </div>
              <button
                className={styles.saveButton}
                disabled={!newComment.trim()}
                onClick={handleAddComment}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
