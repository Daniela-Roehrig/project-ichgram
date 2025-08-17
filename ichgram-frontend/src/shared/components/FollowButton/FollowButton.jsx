import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./FollowButton.module.css";


export default function FollowButton({
  targetUserId,
  currentUserId,
  isFollowing: initialIsFollowing,
  onFollowChange,
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  setIsFollowing(initialIsFollowing);
  
}, [initialIsFollowing]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/follow/${targetUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedFollowers = res.data.followers || [];
      const nowFollowing = updatedFollowers.some(
        (id) => id.toString() === currentUserId
      );

      setIsFollowing(nowFollowing);

      onFollowChange?.(nowFollowing, updatedFollowers);
    } catch (err) {
      console.error("Follow/Unfollow Fehler:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={styles.followButton}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
