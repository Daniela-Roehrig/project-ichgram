
import { useState } from "react";
import { X, Cloud, Smile } from "lucide-react";
import { useUser } from "../../../context/UserContext";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";


import styles from "./CreateModal.module.css";

const countWords = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
}

export default function CreateModal({ onClose }) {
    const { token, addPostToUser } = useUser();
    const [selectedFile, setSelectedFile] = useState(null);
    const [comments, setComments] = useState(["", ""]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const MAX_CHARS = 200;

    const handleCommentChange = (index, value) => {
        if (value.length <= MAX_CHARS) {
            const newComments = [...comments];
            newComments[index] = value;
            setComments(newComments);
        }
    };

    const handleShare = async () => {
        if (!selectedFile) {
            alert("Bitte wähle eine Datei aus.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append(
            "description",
            comments.filter((c) => c.trim() !== "").join("\n\n")
        );
        formData.append("image", selectedFile);

        try {
            const res = await fetch("http://localhost:3000/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                alert("Fehler: " + error.message);
                setLoading(false);
                return;
            }

            const createdPost = await res.json();
            addPostToUser(createdPost);

            // Reset
            setComments(["", ""]);
            setSelectedFile(null);
            setActiveIndex(null);
            onClose();
        } catch (err) {
            console.error("Post-Fehler:", err);
            alert("Etwas ist schiefgelaufen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X />
                    </button>
                    <h2>Create new post</h2>
                    <button
                        className={styles.shareButton}
                        onClick={handleShare}
                        disabled={loading}
                    >
                        {loading ? "Sharing..." : "Share"}
                    </button>
                </div>

                <div className={styles.body}>
                    <label htmlFor="file-upload" className={styles.uploadArea}>
                        {selectedFile ? (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Selected"
                                className={styles.previewImage}
                            />
                        ) : (
                            <>
                                <Cloud size={64} />
                                <span>Click to upload</span>
                            </>
                        )}
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                    </label>


                    {/* Details */}
                    <div className={styles.detailsArea}>
                        <p className={styles.filename}>
                            {selectedFile ? selectedFile.name : "No file selected"}
                        </p>

                        <div className={styles.commentContainer}>
                            {comments.map((comment, i) => (

                                <textarea
                                    key={i}
                                    className={styles.commentBox}
                                    placeholder="..."
                                    value={comment}
                                    onChange={(e) => handleCommentChange(i, e.target.value)}
                                    onFocus={() => setActiveIndex(i)}  // << das ist wichtig
                                />

                            ))}

                            <Smile
                                className={styles.smileIcon}
                                onClick={() => setPickerOpen((prev) => !prev)}
                            />

                            {pickerOpen && activeIndex !== null && (
                                <div className={styles.pickerWrapper}>
                                    <Picker
                                        data={data}
                                        onEmojiSelect={(emoji) => {
                                            const newComments = [...comments];
                                            newComments[activeIndex] += emoji.native;
                                            setComments(newComments);
                                        }}

                                        width={300}
                                        height={350}
                                    />
                                </div>
                            )}
                            <div className={styles.commentCounter}>
                                {activeIndex !== null &&
                                    `${activeIndex + 1}/2 ${Math.max(
                                        0,
                                        MAX_CHARS - comments[activeIndex].length
                                    )}`}
                            </div>
                        </div>
                    </div>
                </div>

                <button className={styles.closeButton} onClick={onClose}>
                    <X />
                </button>
            </div>
        </div>
    );
}
