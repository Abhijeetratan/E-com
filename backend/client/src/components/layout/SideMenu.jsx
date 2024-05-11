import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function SidebarMenu() {
  const menuItems = [
    {
      label: "Profile",
      url: "/me/profile",
      icon: "fas fa-user",
    },
    {
      label: "Update Profile",
      url: "/me/update_profile",
      icon: "fas fa-user",
    },
    {
      label: "Upload Profile",
      url: "/me/upload_avatar",
      icon: "fas fa-user",
    },
    {
      label: "Update Password",
      url: "/me/update_password",
      icon: "fas fa-user",
    },
  ];
  const location = useLocation();

  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

  const handleMenuItemClick =(menuItemsUrl)=>{
    setActiveMenuItem(menuItemsUrl)
  }

  return (
    <div className="list-group mt-5 pl-4">
      {menuItems.map((menuItem, index) => (
        <Link
          key={index}
          to={menuItem.url}
          className={`fw-bold list-group-item list-group-item-action d-flex align-items-center ${activeMenuItem.includes( menuItem.url) ? "active" : ""}`}
          onClick={() => handleMenuItemClick(menuItem.url)}

          aria-current={activeMenuItem.includes(menuItem.url)? "true":"false"}
        >
          <i className={`${menuItem.icon} fa-fw pe-2`}></i> {menuItem.label}
        </Link>
      ))}
    </div>
  );
}

export default SidebarMenu;
