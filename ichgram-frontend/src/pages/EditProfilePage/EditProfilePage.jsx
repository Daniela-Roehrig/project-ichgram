
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import styles from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const { user, updateUserProfile, changePassword } = useUser(); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p>Lade Benutzerdaten...</p>
      </div>
    );
  }

  const [avatar, setAvatar] = useState(user.avatar || "");
  const [username, setUsername] = useState(user.username || "");
  const [website, setWebsite] = useState(user.website || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/upload/avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Avatar-Upload fehlgeschlagen");

    const data = await res.json();
    const fullUrl = data.url.startsWith("http")
      ? data.url
      : `http://localhost:3000${data.url}`;
    return fullUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      let avatarUrl = avatar;

      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        avatarUrl = uploadedUrl.replace(/^https?:\/\/[^/]+/, "");
      }

      await updateUserProfile({
        avatar: avatarUrl,
        username,
        website,
        bio,
      });

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          alert("Neue Passwörter stimmen nicht überein.");
          return;
        }

        await changePassword(currentPassword, newPassword);
      }

      navigate("/profile");
    } catch (error) {
      alert("Fehler beim Speichern des Profils: " + error.message);
      console.error(error);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading}>Edit Profile</h1>

      <div className={styles.avatarSection}>
        <img
          src={avatar || "/default-avatar.png"}
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.avatarInfo}>
          <h4>Change Profile Picture</h4>
          <button type="button" onClick={triggerFileInput} className={styles.changeButton}>
            Change
          </button>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSave}>
        <label>
          Username
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          Website
          <input
            className={styles.input}
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </label>

        <label>
          About
          <textarea
            className={styles.textarea}
            maxLength={150}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div className={styles.charCount}>{bio.length}/150</div>
        </label>

        <h3>Change Password</h3>
        <label>
          Current Password
          <input
            className={styles.input}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>

        <label>
          New Password
          <input
            className={styles.input}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>

        <label>
          Confirm New Password
          <input
            className={styles.input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        <button className={styles.saveButton} type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
