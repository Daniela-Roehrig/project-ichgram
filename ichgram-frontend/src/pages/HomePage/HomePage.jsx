import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import OtherPostModal from "../../modules/OtherPostModal/OtherPostModal";
import FollowButton from "../../shared/components/FollowButton/FollowButton";
import * as jwtDecode from "jwt-decode";
import getAvatarUrl from "../../shared/components/Avatar/AvatarUrl";

export default function HomePage() {
  const [feed, setFeed] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [following, setFollowing] = useState({});
  const [liked, setLiked] = useState({});
  const token = localStorage.getItem("token");

  const toggleLike = async (postId) => {
    try {
      const res = await axios.post(
        `/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { likesCount, likedByUser } = res.data;

      setFeed((prevFeed) =>
        prevFeed.map((p) =>
          p._id === postId
            ? { ...p, likes: Array(likesCount).fill("x"), likedByUser }
            : p
        )
      );

      setLiked((prev) => ({ ...prev, [postId]: likedByUser }));
    } catch (error) {
      console.error("Fehler beim Liken:", error);
    }
  };

  const currentUserId = token
    ? (() => {
        try {
          const decoded = jwtDecode(token);
          return decoded.id || decoded._id || null;
        } catch {
          return null;
        }
      })()
    : null;

  useEffect(() => {
    const fetchFeed = async () => {
      if (!token) {
        console.error("Kein Token gefunden");
        return;
      }
      try {
        const res = await axios.get("/api/follow/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.length === 0) {
          const randomRes = await axios.get("/api/posts/random", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFeed(randomRes.data);

          const likedMap = {};
          randomRes.data.forEach((post) => {
            likedMap[post._id] = post.likes?.includes(currentUserId) || false;
          });
          setLiked(likedMap);
        } else {
          setFeed(res.data);

          const likedMap = {};
          res.data.forEach((post) => {
            likedMap[post._id] = post.likes?.includes(currentUserId) || false;
          });
          setLiked(likedMap);
        }
      } catch (err) {
        console.error("Fehler beim Laden des Feeds:", err);
      }
    };

    fetchFeed();
  }, [token, currentUserId]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000
    );
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w`;
    const diffInMonths = Math.floor(diffInWeeks / 4);
    if (diffInMonths < 12) return `${diffInMonths}mo`;
    return `${Math.floor(diffInMonths / 12)}y`;
  };

  const toggleFollow = (authorId) => {
    setFollowing((prev) => ({
      ...prev,
      [authorId]: !prev[authorId],
    }));
  };

  return (
    <div>
      <div className={styles.feed}>
        {feed.map((post) => (
          <div key={post._id} className={styles.postContainer}>
            <div className={styles.header}>
              <Link to={`/users/${post.author._id}`}>
                <img
                  src={getAvatarUrl(post.author.avatar)}
                  alt={post.author.username}
                  className={styles.avatar}
                  style={{ cursor: "pointer" }}
                />
              </Link>
              <Link
                to={`/users/${post.author._id}`}
                className={styles.username}
                style={{ textDecoration: "none", color: "inherit", marginLeft: 8 }}
              >
                {post.author.username}
              </Link>
              <span className={styles.separator}>•</span>
              <span className={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</span>
              <span className={styles.separator}>•</span>

              <FollowButton
                targetUserId={post.author._id}
                currentUserId={currentUserId}
                initialIsFollowing={!!following[post.author._id]}
                onFollowChange={(nowFollowing) => {
                  setFollowing((prev) => ({
                    ...prev,
                    [post.author._id]: nowFollowing,
                  }));
                }}
              />
            </div>

            <img src={post.image} alt="Post" className={styles.image} />

            <div className={styles.actions}>
              <Heart
                size={24}
                className={styles.icon}
                onClick={() => toggleLike(post._id)}
                color={liked[post._id] ? "red" : "black"}
                style={{ cursor: "pointer" }}
              />
              <MessageCircle
                size={24}
                className={styles.icon}
                onClick={() => setSelectedPost(post)}
              />
            </div>

            <p className={styles.likes}>{post.likes?.length ?? 0} likes</p>

            <p className={styles.description}>
              <strong>{post.author.username}</strong> {post.description}
            </p>

            {post.firstComment && (
              <p className={styles.comment}>
                <strong>{post.firstComment.username}</strong>{" "}
                {post.firstComment.text.slice(0, 60)}...
                <span className={styles.more}> more</span>
              </p>
            )}

            {post.commentCount > 1 && (
              <p
                className={styles.viewAll}
                onClick={() => setSelectedPost(post)}
              >
                View all comments ({post.commentCount})
              </p>
            )}
            <span className={styles.border}></span>
          </div>
        ))}

        {selectedPost && (
          <OtherPostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </div>

      <div className={styles.customFooter}>
        <img
          src="/src/assets/img/check.png"
          alt="Check Icon"
          className={styles.checkIcon}
        />
        <p className={styles.title}>You've seen all the updates</p>
        <p className={styles.subtitle}>You have viewed all new publications</p>
      </div>
    </div>
  );
}
