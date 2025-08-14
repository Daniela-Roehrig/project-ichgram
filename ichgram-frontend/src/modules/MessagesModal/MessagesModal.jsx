import { useEffect, useState, useRef } from "react";
import styles from "./MessagesModal.module.css";
import socket from "../../socket";
import { useUser } from "../../context/UserContext";
import getAvatarUrl from "../../shared/components/Avatar/AvatarUrl";


const MessagesModal = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const { user: currentUser } = useUser();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on("connect", () => console.log("Socket verbunden:", socket.id));
        socket.on("disconnect", (reason) => console.log("Socket getrennt:", reason));
        socket.on("connect_error", (err) => console.error("Verbindungsfehler:", err));

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
        };
    }, []);

    useEffect(() => {
        if (!currentUser?._id) return;

        const handleConnect = () => {
            socket.emit("register_user", currentUser._id);
        };

        socket.on("connect", handleConnect);

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
        };
    }, [currentUser?._id]);


    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/users");
                if (!res.ok) throw new Error("API Fehler " + res.status);
                const data = await res.json();
                const userList = Array.isArray(data) ? data : data.users || [];
                setUsers(userList);
                if (userList.length > 0) setSelectedUser(userList[0]);
            } catch (err) {
                console.error("Fetch error:", err);
                setUsers([]);
            }
        };
        loadUsers();
    }, []);


    const fetchMessages = async () => {
        if (!selectedUser?._id || !currentUser?._id) return;

        try {
            const res = await fetch(
                `http://localhost:3000/api/messages/${selectedUser._id}?currentUserId=${currentUser._id}`
            );
            if (!res.ok) throw new Error("Fehler beim Abrufen der Nachrichten");
            const data = await res.json();

            setMessages(data.messages || []);
        } catch (err) {
            console.error("❌ Fehler beim Laden der Nachrichten:", err);
            setMessages([]);
        }
    };

    function formatTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

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
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedUser?._id, currentUser?._id]);


    useEffect(() => {
        const handleReceive = (msg) => {
         
            const msgId = msg.id || msg._id;
            if (!msgId) return;

            setMessages((prev) => {
                if (prev.some((m) => (m.id || m._id) === msgId)) return prev;
                return [...prev, msg];
            });
        };

        socket.off("receive_message"); 
        socket.on("receive_message", handleReceive);

        return () => {
            socket.off("receive_message", handleReceive);
        };
    }, [selectedUser?._id, currentUser?._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

        const handleClearChat = async () => {
        if (!selectedUser?._id || !currentUser?._id) return;

        try {
            await fetch(
                `http://localhost:3000/api/messages/${selectedUser._id}?currentUserId=${currentUser._id}`,
                { method: "DELETE" }
            );
            await fetchMessages();
        } catch (err) {
            console.error("Fehler beim Löschen des Chats:", err);
        }
    };
    useEffect(() => {
      
    }, []);

  
    const handleSendMessage = async () => {
        if (!selectedUser?._id || !input.trim()) {
            alert("Empfänger und Nachricht dürfen nicht leer sein.");
            return;
        }

        if (!currentUser?._id) {
            alert("Benutzer nicht eingeloggt.");
            return;
        }

        const payload = {
            senderId: currentUser._id,
            receiverId: selectedUser._id,
            text: input,
        };

        try {
            const res = await fetch("http://localhost:3000/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Fehler beim Senden");

            const data = await res.json();
            setMessages((prev) => [...prev, data]);
            setInput("");

            socket.emit("send_message", data);

        } catch (err) {
            console.error("Fehler beim Senden:", err);
        }
    };


    const getAvatarUrl = (avatar) => {
        if (!avatar) return "/default-avatar.png";
        return avatar.startsWith("http")
            ? avatar
            : `http://localhost:3000${avatar}`;
    };

    const filteredMessages = messages.filter(
        (msg) =>
            (msg.senderId === currentUser?._id && msg.receiverId === selectedUser?._id) ||
            (msg.senderId === selectedUser?._id && msg.receiverId === currentUser?._id)
    );


    return (
        <div className={styles.overlay}>

            <div className={styles.sidebar}>
                <button onClick={onClose} className={styles.closeBtn}>
                    ✖
                </button>
                <h3 className={styles.userListTitle}>Followings</h3>
                {users.map((user, index) => (
                    <div
                        key={user._id || user.username || index}
                        className={`${styles.userItem} ${selectedUser?._id === user._id ? styles.userItemActive : ""}`}
                        onClick={() => setSelectedUser(user)}
                    >
                        <img
                            src={getAvatarUrl(user.avatar)}
                            alt={`${user.username} Avatar`}
                            className={styles.avatar} 
                        />
                        {user.fullname} (@{user.username})
                    </div>

                ))}
            </div>


            <div className={styles.chatWindow}>
                {selectedUser ? (
                    <>
                  
                        <div className={styles.chatHeader}>
                            <div className={styles.chatUserInfoH}>
                                <img
                                    src={getAvatarUrl(selectedUser.avatar)}
                                    alt={`${selectedUser.fullname} Avatar`}
                                    className={styles.chatAvatarH}
                                />
                                <div className={styles.chatUsername}>{selectedUser.username}</div>
                            </div>
                            <button onClick={handleClearChat} className={styles.clearChatBtn}>
                                🧹
                            </button>
                        </div>

                        <div className={styles.messagesContainer}>
                            <div className={styles.chatInfoTop}>
                                <div className={styles.chatUserInfo}>
                                    <img
                                        src={getAvatarUrl(selectedUser.avatar)}
                                        alt={`${selectedUser.fullname} Avatar`}
                                        className={styles.chatAvatar}
                                    />
                                    <div>
                                        <div className={styles.chatUsername}>{selectedUser.username}</div>
                                        <div className={styles.chatName}>{selectedUser.fullname}</div>
                                    </div>
                                </div>

                                <div className={styles.chatMeta}>
                                    <button className={styles.viewProfileBtn}>View Profile</button>
                                    <div className={styles.chatTime}>
                                        {new Date().toLocaleDateString("de-DE")} ·{" "}
                                        {new Date().toLocaleTimeString("de-DE", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>

                            {filteredMessages.map((msg, index) => {
                                const isOwnMessage = msg.senderId === currentUser?._id;
                                const avatarUrl = getAvatarUrl(isOwnMessage ? currentUser.avatar : selectedUser.avatar);
                                const time = formatTimeAgo(msg.createdAt || msg.timestamp);

                                return (
                                    <div
                                        key={`${msg.senderId}-${msg.receiverId}-${msg.timestamp}-${index}`}
                                        className={isOwnMessage ? styles.messageSentWrapper : styles.messageReceivedWrapper}
                                    >

                                        <div className={styles.messageMeta}>
                                            {isOwnMessage ? (
                                                <>
                                                    <div className={styles.messageTime} style={{ marginRight: "8px" }}>{time}</div>
                                                    <img src={avatarUrl} alt="Avatar" className={styles.messageAvatar} />
                                                </>
                                            ) : (
                                                <>
                                                    <img src={avatarUrl} alt="Avatar" className={styles.messageAvatar} />
                                                    <div className={styles.messageTime}>{time}</div>
                                                </>
                                            )}
                                        </div>

                                        <div className={styles.messageBubble}>{msg.text}</div>
                                    </div>
                                );
                            })}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className={styles.chatFooter}>
                            <input
                                type="text"
                                placeholder="Nachricht schreiben..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                className={styles.chatInput}
                            />
                            <button onClick={handleSendMessage} className={styles.sendButton}>
                                Senden
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: "20px" }}>Bitte wähle einen Nutzer aus der Liste</div>
                )}
            </div>
        </div>
    );
};

export default MessagesModal;
