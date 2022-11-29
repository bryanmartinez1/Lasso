import React, { Component } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export class NavBar extends Component {
  render() {
    return (
      <nav className="nav">
        <Link to="/" className="site-title">
          <div class="logo-image">
            <img src="lasso_logo.png" class="img-fluid" />
          </div>
        </Link>
        <ul>
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/profile">Profile</CustomLink>
          <CustomLink to="/sell">Sell</CustomLink>
          <CustomLink to="/strikes">Strikes</CustomLink>
          <CustomLink to="/shopping_cart">ShoppingCart</CustomLink>
        </ul>
      </nav>
    );
  }
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default NavBar;
