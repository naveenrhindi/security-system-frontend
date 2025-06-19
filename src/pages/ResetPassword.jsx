import { Await, Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo_home_rm.png";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const { getUserData, isLoggedIn, userData, backendURL } =
    useContext(AppContext);

  axios.defaults.withCredentials = true;

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        backendURL + "/send-reset-otp?email=" + email
      );
      if (response.status === 200) {
        toast.success("Password reset OTP sent successfully!");
        setIsEmailSent(true);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    const otp = inputRef.current.map((input) => input.value).join("");
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }
    setOtp(otp);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendURL + "/reset-password", {
        newPassword,
        otp,
        email,
      });
      if (response.status === 200) {
        toast.success("Password reset successfully.");
        navigate("/login");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 position-relative"
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
        <img src={logo} alt="Logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-white">Secure</span>
      </Link>

      {/* Reset password card */}
      {!isEmailSent && (
        <div
          className="rounded-4 p-5 text-center bg-white shadow-lg"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h4 className="mb-2">Reset Password</h4>
          <p className="mb-4">Enter your registered email address</p>
          <form onSubmit={onSubmitEmail}>
            <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                placeholder="Enter email address"
                style={{
                  height: "50px",
                  border: "1px solid rgba(0,0,0,0.8)",
                  borderRadius: "6px",
                  outline: "none",
                  transition: "box-shadow 0.2s ease",
                }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button
              className="btn btn-primary w-100 py-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {/* OTP Card */}
      {!isOtpSubmitted && isEmailSent && (
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
      )}

      {/* New Password form */}
      {isOtpSubmitted && isEmailSent && (
        <div
          className="rounded-4 p-4 text-center bg-white"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h4 className="p-2">New Password</h4>
          <p className="mb-4">Enter new password below</p>
          <form onSubmit={onSubmitNewPassword}>
            <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <i className="bi bi-person-fill-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                placeholder="******"
                style={{ height: "50px" }}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                value={newPassword}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
