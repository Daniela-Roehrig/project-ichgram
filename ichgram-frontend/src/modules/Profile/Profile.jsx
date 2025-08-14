import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";  
import styles from "./Profile.module.css";
import PostModal from "../PostModal/PostModal";

export default function Profile() {
  const { user, logout } = useUser(); 
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = posts
    .filter((post) => post.image)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const postsToShow = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  useEffect(() => {
    if (!user?._id) return;

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/posts/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPosts(res.data.data || []);
      } catch (err) {
        console.error("Posts konnten nicht geladen werden", err);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [user]);

  if (!user) return <p>Loading user...</p>;

  const {
    avatar,
    username,
    website,
    bio,
    followers = 0,
    following = 0,
  } = user;

  function handleEditClick() {
    navigate("/edit-profile");
  }

  function handleLogout() {
    logout();
  }

  const openBioModal = () => setIsBioModalOpen(true);
  const closeBioModal = () => setIsBioModalOpen(false);

  const openPostModal = (post) => setSelectedPost(post);
  const closePostModal = () => setSelectedPost(null);

  return (
    <div className={styles.layout}>
      {user.profileStyle?.headerImage && (
        <div className={styles.headerImageWrapper}>
          <img
            src={user.profileStyle.headerImage}
            alt="header"
            className={styles.headerImage}
          />
        </div>
      )}

      <main className={styles.main}>

        <div className={styles.header}>
          <div className={styles.avatarWrapper}>
            <img
              src={
                avatar?.startsWith("http")
                  ? avatar
                  : `http://localhost:3000${avatar}`
              }
              alt="avatar"
              className={styles.avatar}
              onError={(e) => {
                if (!e.currentTarget.dataset.fallback) {
                  e.currentTarget.src = "/default-avatar.jpg";
                  e.currentTarget.dataset.fallback = "true";
                }
              }}
            />
          </div>

          <div className={styles.info}>
            <div className={styles.usernameRow}>
              <h2 className={styles.username}>{username}</h2>
              <button className={styles.editButton} onClick={handleEditClick}>
                Edit Profile
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className={styles.stats}>
              <span>{posts.length} posts</span>
              <span>{followers.length || followers} followers</span>
              <span>{following.length || following} following</span>
            </div>

            <p className={styles.bio} onClick={openBioModal}>
              {bio?.split("\n").slice(0, 3).join("\n")}
              {bio && bio.split("\n").length > 3 && (
                <span className={styles.more}>... more</span>
              )}
            </p>

            <div className={styles.bottomSection}>
              {website && (
                <a
                  className={styles.website}
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <section className={styles.postsSection}>
          {loadingPosts ? (
            <p>Loading posts...</p>
          ) : postsToShow.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            postsToShow.map((post) => (
              <div
                key={post._id}
                className={styles.post}
                onClick={() => openPostModal(post)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={post.image}
                  alt="post"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    aspectRatio: "1 / 1",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))
          )}
        </section>
       
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              ← Zurück
            </button>

            <span className={styles.pageInfo}>
              Seite {currentPage} von {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
            >
              Weiter →
            </button>
          </div>
        )}

      </main>

      {isBioModalOpen && (
        <div className={styles.modalOverlay} onClick={closeBioModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeBioModal}>
              ×
            </button>
            <h3>About {username}</h3>
            <p>{bio}</p>
          </div>
        </div>
      )}

      {selectedPost && (
        <PostModal post={selectedPost} onClose={closePostModal} currentUser={user} />
      )}
    </div>
  );
}
