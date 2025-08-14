import { useEffect, useState } from "react";
import axios from "../../shared/api/instance";
import styles from "./Explore.module.css";
import OtherPostModal from "../OtherPostModal/OtherPostModal";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchPosts = async () => {
    setLoading(true);

    try {
      const res = await axios.get("/posts/feed?random=true", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          limit: 12, 
        },
      });

      setPosts(res.data.data);
    } catch (err) {
      console.error("Fehler beim Laden der Posts", err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  
  const handlePostClick = async (post) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedPost(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Fehler beim Laden des vollständigen Posts:", err);
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className={styles.explorePage}>
      <div className={styles.postsContainer}>
        {posts.length === 0 && !loading ? (
          <p>Keine Posts gefunden...</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className={styles.post}
            >
              <img
                src={post.image}
                alt={post.title || "Post image"}
                className={styles.postImage}
                onClick={() => handlePostClick(post)}
              />
            </div>
          ))
        )}
      </div>

      {loading && <p className={styles.loading}>Lade Posts...</p>}

      {isModalOpen && selectedPost && (
        <OtherPostModal post={selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  );
}
