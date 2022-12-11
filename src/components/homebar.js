import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Parse from "parse/dist/parse.min.js";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import logo from "./Images/logo_s.jpg";
import { ShoppingBag, ShoppingCart } from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 10,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
// Added "Sell" here
// const pages = ["Home", "Shop by Category", "Orders & Returns"];

function Homebar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [toSignup, setToSignup] = React.useState(false);
  const [toLogin, setToLogin] = React.useState(false);
  const [toCart, setToCart] = React.useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toSell, setToSell] = React.useState(false);

  const isloggedInUser = localStorage.getItem("user");
  const isUserAdmin = localStorage.getItem("admin");
  const [isLoggedin, setIsLoggedin] = useState(isloggedInUser);
  console.log("isLoggedin", isLoggedin);

  //
  // Added this hook
  //

  const navigate = useNavigate();
  const cart = () => navigate("/cart");
  const signup = () => navigate("/sell");
  const login = () => navigate("/login");
  const sell = () => navigate("/sell");
  const profile = () => navigate("/profile");
  const admin = () => navigate("/admin");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed ✅");
      navigate("/searchresult", {
        state: {
          searchResult: document.getElementById("searchResult").value,
        },
      });
    }
  };

  const doUserLogOut = async function () {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = await Parse.User.current();

      if (currentUser === null) {
        localStorage.setItem("user", "0");
        localStorage.setItem("admin", "0");
        alert("Success! No user is logged in anymore!");
        setIsLoggedin("0");
      }
      // Update state variable holding current user
      getCurrentUser();
      navigate("/");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  // Function that will return current user and also update current username
  const getCurrentUser = async function () {
    const currentUser = await Parse.User.current();
    // Update state variable holding current user
    setCurrentUser(currentUser);
    return currentUser;
  };

  if (toLogin) {
    navigate("/login");
  }

  if (toSignup) {
    navigate("/signup");
  }

  if (toCart) {
    navigate("/cart");
  }

  if (isLoggedin === "1") {
    if (isUserAdmin === "1") {
      var settings = ["Admin", "Logout"];
      var pages = [
        "Home",
        "Shop by Category",
        "Orders & Returns",
        "Sell",
        "Profile",
      ];
    } else {
      var settings = ["Logout"];
      var pages = [
        "Home",
        "Shop by Category",
        "Orders & Returns",
        "Sell",
        "Profile",
      ];
    }
  } else {
    var settings = ["Login", "Sign Up"];
    var pages = ["Home", "Shop by Category", "Orders & Returns"];
  }

  //
  // Added so that when true will move to sell
  //

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const clickedSetting = (event) => {
    const res = event.target;
    console.log(res.textContent);
    if (res.textContent === "Login") {
      navigate("/login");
    }
    if (res.textContent === "Sign Up") {
      setToSignup(true);
      // navigate("/signup");
    }
    if (res.textContent === "Logout") {
      doUserLogOut();
    }
    if (res.textContent === "Admin") {
      navigate("/Admin");
    }

    // res.textContent;
  };

  const handleClickedPage = (event) => {
    const res = event.target;
    console.log(res.textContent);
    if (res.textContent === "Home") {
      navigate("/");
    }
    if (res.textContent === "Shop by Category") {
      navigate("/");
    }
    if (res.textContent === "Sell") {
      navigate("/Sell");
    }
    if (res.textContent === "Profile") {
      navigate("/Profile");
    }
    if (res.textContent === "Orders & Returns") {
      navigate("/");
    }
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const gotoCart = () => {
    setToCart(true);
  };
  //
  // Sets the hook to true to initate the if statement from above and navigate to sell page
  //
  const gotoSell = () => {
    setToSell(true);
  };

  return (
    <AppBar position="static" style={{ background: "#362419" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
          <img src={logo} alt="Logo" width="50" height="50" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={[
              {
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "verdana",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                margin: 2,
              },
              {
                "&:hover": {
                  color: "#E1AD01",
                },
              },
            ]}
          >
            Lasso
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              fontFamily="verdana"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                //
                // Change this frome handleCloseNavMenu to goToSell to initate the change of pages when clicked
                //
                onClick={handleClickedPage}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              id="searchResult"
              onKeyDown={handleKeyDown}
            />
          </Search>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={clickedSetting}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Shopping cart">
              <IconButton onClick={cart} sx={{ p: 2 }}>
                <Avatar>
                  <ShoppingCart />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Homebar;
