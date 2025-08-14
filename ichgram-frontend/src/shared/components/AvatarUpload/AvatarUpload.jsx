import React, { useState } from 'react';
import styles from './AvatarUpload.module.css';

export default function AvatarUpload() {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Bitte ein Bild auswählen.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

  };

  return (
    <div className={styles.container}>
      <label htmlFor="avatarInput" className={styles.label}>
        Wähle dein Avatarbild
      </label>
      <input
        id="avatarInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.input}
      />
      {preview && (
        <img
          src={preview}
          alt="Avatar Vorschau"
          className={styles.avatarPreview}
        />
      )}
    </div>
  );
}
