import { React } from "react";
import "../styles/admin.css";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { ProSidebarProvider } from "react-pro-sidebar";

function Admin() {
  return (
    <section>
      <ProSidebarProvider>
        <Sidebar className="sidebar">
          <Menu>
            <MenuItem>
              <Link id="RouterNavLink" to="/">
                Home
              </Link>
            </MenuItem>
            <MenuItem>
              <Link id="RouterNavLink" to="/usersList">
                Users
              </Link>
            </MenuItem>
            <MenuItem>
              <Link id="RouterNavLink" to="/admin">
                return
              </Link>
            </MenuItem>
          </Menu>
        </Sidebar>
      </ProSidebarProvider>
    </section>
  );
}

export default Admin;
