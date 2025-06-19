import React, { useContext, useEffect, useRef, useState } from "react";
import logo_home from "../assets/logo_home.jpg";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
  const navigate = useNavigate();
  const { userData, backendURL, setIsLoggedIn, setUserData } =
    useContext(AppContext);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout api
  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendURL + "/logout");
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        backendURL + "/send-otp"
        // {},
        // { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/email-verify");
        toast.success("OTP has been sent successfully.");
      } else {
        toast.error("Unable to send OTP!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <nav
      className="navbar bg-white px-5 py-4 d-flex justify-content-between 
    align-items-center shadow-sm"
    >
      <div className="d-flex align-items-center gap-2">
        <img src={logo_home} alt="logo" width={32} height={32} />
        <span className="fw-bold fs-4 text-dark">Secure</span>
      </div>

      {/* showing profile, dropdown when user is logged in */}
      {userData ? (
        <div
          className="position-relative"
          ref={dropDownRef}
          style={{ display: "inline-block" }} // make sure it wraps around contents properly
          onMouseEnter={() => setDropDownOpen(true)}
          // onMouseLeave={() => setDropDownOpen(false)}
        >
          <div
            className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
              userSelect: "none",
            }}
            // onClick={() => setDropDownOpen((prev) => !prev)}
            onClick={() => setDropDownOpen(false)} // <-- Close on click
          >
            {userData.name[0].toUpperCase()}
          </div>

          {dropDownOpen && (
            <div
              className="position-absolute shadow bg-light rounded p-2"
              style={{
                top: "50px",
                right: 0,
                zIndex: 100,
              }}
            >
              {!userData.isAccountVerified && (
                <div
                  className="dropdown-item py-1 px-2"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={sendVerificationOtp}
                >
                  Verify Email
                </div>
              )}
              <div
                className="dropdown-item py-1 px-2 text-danger"
                style={{
                  cursor: "pointer",
                }}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="btn btn-outline-dark rounded-pill px-3"
          onClick={() => navigate("/login")}
        >
          Login <i className="bi bi-arrow-right ms-2"></i>
        </div>
      )}
    </nav>
  );
};

export default Menubar;
