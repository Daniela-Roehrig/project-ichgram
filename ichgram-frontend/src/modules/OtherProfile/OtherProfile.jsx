import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../Profile/Profile.module.css";
import OtherPostModal from "../OtherPostModal/OtherPostModal";
import { useUser } from "../../context/UserContext";
import FollowButton from "../../shared/components/FollowButton/FollowButton";
import MessagesModal from "../MessagesModal/MessagesModal";

export default function OtherProfile() {
    const { id } = useParams();
    const { user: currentUser } = useUser();
    const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isBioModalOpen, setIsBioModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowBack, setIsFollowBack] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [selectedMessageUser, setSelectedMessageUser] = useState(null);


    const isOwnProfile = currentUser?._id === id;


    const handleOpenMessagesModal = () => {
        setIsMessagesModalOpen(true);
    };

    const handleCloseMessagesModal = () => {
        setIsMessagesModalOpen(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoadingUser(true);
            try {
                const res = await axios.get(`http://localhost:3000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setUser(res.data);

                const currentUserFollows = res.data.followers?.includes(currentUser._id);
                setIsFollowing(currentUserFollows);

                const userFollowsCurrentUser = res.data.following?.includes(currentUser._id);
                setIsFollowBack(userFollowsCurrentUser);

            } catch (err) {
                console.error(err);
                setError("User nicht gefunden");
            } finally {
                setLoadingUser(false);
            }
        };

        const fetchPosts = async () => {
            setLoadingPosts(true);
            try {
                const res = await axios.get(`http://localhost:3000/api/posts/user/${id}`, {
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

        fetchUser();
        fetchPosts();
    }, [id, currentUser._id]);


    const handleFollowToggle = async () => {
        try {
            const res = await axios.post(
                `http://localhost:3000/api/follow/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const updatedFollowers = res.data.followers || [];

            setIsFollowing(updatedFollowers.some(followerId => followerId.toString() === currentUser._id));

            setUser((prevUser) => ({
                ...prevUser,
                followers: updatedFollowers,
            }));
        } catch (err) {
            console.error("Fehler beim Follow/Unfollow:", err);
        }
    };

    if (loadingUser) return <p>Loading user...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return null;

    const {
        avatar,
        username,
        website,
        bio,
        followers = [],
        following = [],
        profileStyle,
    } = user;

    const postsToShow = Array.isArray(posts)
        ? posts
            .filter((post) => post.image) 
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6)
        : [];


    const openOtherPostModal = (post) => setSelectedPost(post);
    const closeOtherPostModal = () => setSelectedPost(null);

    return (
        <div className={styles.layout}>
        
            {profileStyle?.headerImage && (
                <div className={styles.headerImageWrapper}>
                    <img
                        src={profileStyle.headerImage}
                        alt="header"
                        className={styles.headerImage}
                    />
                </div>
            )}

            <main className={styles.main}>
          
                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={avatar?.startsWith("http") ? avatar : `http://localhost:3000${avatar}`}
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
                            {isOwnProfile ? (
                                <>
                                    <button className={styles.editButton}>Edit Profile</button>
                                    <button className={styles.logoutButton}>Logout</button>
                                </>
                            ) : (
                                <div className={styles.actionButtons}>
                                    <FollowButton
                                        currentUserId={currentUser._id}
                                        targetUserId={id}
                                        initialIsFollowing={isFollowing}
                                        initialFollowers={followers}
                                        onFollowChange={(nowFollowing, updatedFollowers) => {
                                            setIsFollowing(nowFollowing);
                                            setUser((prev) => ({
                                                ...prev,
                                                followers: updatedFollowers,
                                            }));
                                        }}
                                    />
                                    <button
                                        className={styles.messageButton}
                                        onClick={handleOpenMessagesModal}>
                                        Message
                                    </button>



                                    {isFollowBack && isFollowing && (
                                        <div className={styles.followBackInfo}>
                                            <span>You follow each other</span>
                                        </div>
                                    )}
                                </div>

                            )}
                        </div>
                        <div className={styles.stats}>
                            <span>{postsToShow.length} posts</span>
                            <span>{followers.length} followers</span>
                            <span>{following.length} following</span>
                        </div>
                        <p className={styles.bio}>
                            {bio?.split("\n").slice(0, 3).join("\n")}
                            {bio && bio.split("\n").length > 3 && <span className={styles.more}>... more</span>}
                        </p>
                        {website && (
                            <a
                                href={website.startsWith("http") ? website : `https://${website}`}
                                className={styles.website}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {website}
                            </a>
                        )}
                    </div>
                </div>

       
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
                                onClick={() => openOtherPostModal(post)}
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
            </main>

            {isMessagesModalOpen && (
                <MessagesModal onClose={handleCloseMessagesModal} preselectedUser={user} />
            )}

            {selectedPost && (
                <OtherPostModal
                    post={selectedPost}
                    onClose={closeOtherPostModal}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}
