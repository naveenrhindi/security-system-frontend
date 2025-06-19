import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo_home_rm.png";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const { getUserData, isLoggedIn, userData, backendURL } =
    useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, "");
    e.target.value = val;
    if (val && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
    paste.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });
    const next = paste.length < 6 ? paste.length : 5;
    inputRef.current[next].focus();
  };

  const handleVerify = async () => {
    const otp = inputRef.current.map((input) => input.value).join("");
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }
    setLoading(true);
    console.log("OTP sent:", otp);
    try {
      const response = await axios.post(
        backendURL + "/verify-otp",
        { otp },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        getUserData();
        navigate("/");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Failed to verify the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div
      className="email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{
        background:
          "linear-gradient(90deg,rgb(97, 173, 227),rgb(120, 128, 218))",
        borderRadius: "none",
      }}
    >
      <Link
        to={"/"}
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
      >
        <img src={logo} alt="logo" height={32} width={32} />
        <span className="fw-bold fs-4 text-light">Secure</span>
      </Link>

      {/* Email Verification Card */}
      <div
        className="p-5 shadow-lg rounded-lg"
        style={{
          width: "400px",
          background: "white",
          borderRadius: "15px",
        }}
      >
        <h4 className="text-center mb-4 fw-bold">Email Verify OTP</h4>
        <p className="text-center mb-4">Enter the 6-digit code</p>

        <div className="d-flex justify-content-between gap-2 mb-4 text-center text-white-50 mb-2">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="form-control text-center fs-4 otp-input"
              ref={(el) => (inputRef.current[i] = el)}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              style={{
                border: "1px solid rgba(0,0,0,0.2)",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "6px",
                outline: "none",
                transition: "box-shadow 0.2s ease",
              }}
            />
          ))}
        </div>

        <button
          className="btn btn-primary w-100 fw-semibold"
          disabled={loading}
          onClick={handleVerify}
        >
          {loading ? "Verifying..." : "Verify email"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
