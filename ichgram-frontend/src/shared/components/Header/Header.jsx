
import { useState } from "react";
import SearchPanel from "../SearchPanel/SearchPanel";
import styles from "./Header.module.css";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <header className={styles.header}>
      <h1>My App</h1>
      <button onClick={openSearch}>Search Users</button>

      {isSearchOpen && <SearchPanel onClose={closeSearch} />}
    </header>
  );
}
