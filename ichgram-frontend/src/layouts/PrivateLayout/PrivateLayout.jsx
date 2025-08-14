import { Outlet } from "react-router-dom";
import Sidebar from "../../modules/Sidebar/Sidebar";
import "./PrivateLayout.module.css";

const PrivateLayout = ({ onCreateClick }) => {
  return (
    <div className="private-layout">
      <Sidebar onCreateClick={onCreateClick} />
      <main className="private-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;

