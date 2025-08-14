import { useState } from 'react';
import Navigation from '../pages/Navigation';
import Footer from './Footer/Footer';
import CreateModal from './Sidebar/CreateModal/CreateModal';
import MessagesModal from './MessagesModal/MessagesModal';
import SearchPanel from './SearchPanel/SearchPanel';

function App() {

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleCreateClick = () => setIsCreateOpen(true);
  const handleMessagesClick = () => setIsMessagesOpen(true);
  const handleSearchClick = () => setIsSearchOpen(true);

  const handleCloseCreate = () => setIsCreateOpen(false);
  const handleCloseMessages = () => setIsMessagesOpen(false);
  const handleCloseSearch = () => setIsSearchOpen(false);

  return (
    <>
      <div style={{ marginLeft: '245px' }}>
        <Navigation onCreateClick={handleCreateClick} />

        <Footer
          onCreateClick={handleCreateClick}
          onMessagesClick={handleMessagesClick}
          onSearchClick={handleSearchClick}
        />
      </div>

      {isCreateOpen && <CreateModal onClose={handleCloseCreate} />}
      {isMessagesOpen && <MessagesModal onClose={handleCloseMessages} />}
      {isSearchOpen && <SearchPanel onClose={handleCloseSearch} />}
    </>
  );
}

export default App;
