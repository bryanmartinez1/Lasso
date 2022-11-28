import { React } from "react";
import "../styles/home.css";
import { useNavigate, Navigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { ProSidebarProvider } from "react-pro-sidebar";

function Admin() {
  return (
    <section>
      <ProSidebarProvider>
        <Sidebar>
          <Menu>
            <SubMenu label="Charts">
              <MenuItem> Pie charts </MenuItem>
              <MenuItem> Line charts </MenuItem>
            </SubMenu>
            <MenuItem>Documentation</MenuItem>
            <MenuItem>Calendar</MenuItem>
          </Menu>
        </Sidebar>
      </ProSidebarProvider>
      <div align="center">
        Stuff goes here conditionally based on MenuItem clicks
      </div>
    </section>
  );
}
export default Admin;
