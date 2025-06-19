import React, { useContext, useState } from "react";
import logo from "../assets/logo_home_rm.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    try {
      if (isCreateAccount) {
        // register API
        const response = await axios.post(`${backendURL}/register`, {
          name,
          email,
          password,
        });
        if (response.status === 201) {
          setName("");
          setEmail("");
          setPassword("");
          toast.success("Account created successfully.");
          navigate("/");
        } else {
          toast.error("Email already exists!");
        }
      } else {
        // login API
        const response = await axios.post(`${backendURL}/login`, {
          email,
          password,
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
          getUserData();
          const fullName = response.data.name || "User"; // fallback if name not found
          const firstName = fullName.split(" ")[0];
          setName("");
          setEmail("");
          setPassword("");
          toast.success(`Welcome Back ${firstName}!`);
          navigate("/");
        } else {
          toast.error("Email/Password incorrect");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // linear-gradient(90deg,#6a5af9,#8268f9)
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center shadow-lg"
      style={{
        minHeight: "50vh",
        background:
          "linear-gradient(90deg,rgb(97, 173, 227),rgb(120, 128, 218))",
        border: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "30px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "24px",
            textDecoration: "none",
          }}
        >
          <img src={logo} alt="logo" height={32} width={32} />
          <span className="fw-bold fs-4 text-light">Secure</span>
        </Link>
      </div>

      {/* Login Card */}
      <div
        className="card p-4 w-full shadow-lg"
        style={{ maxWidth: "600px", width: "100%", borderRadius: "15px" }}
      >
        <h2 className="text-center mb-4">
          {isCreateAccount ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={onSubmitHandler}>
          {isCreateAccount && (
            <div className="mb-3 shadow-md rounded-lg p-2 bg-gray-800">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="form-control flex-1 px-4 text-base"
                placeholder="Enter fullname"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          )}

          <div className="flex gap-3 flex-col">
            <div className="mb-3 shadow-md rounded-lg p-2 bg-gray-800">
              <label htmlFor="email" className="form-label">
                Email Id
              </label>
              <input
                type="text"
                id="email"
                className="form-control flex-1 px-4 text-base"
                placeholder="Enter email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="mb-3 shadow-md rounded-lg p-2 bg-gray-800">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control flex-1 px-4 text-base"
                placeholder="******"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            {!isCreateAccount && (
              <div className="flex d-flex justify-content-between mb-3">
                <Link to={"/reset-password"} className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100 p-2"
              disabled={loading}
            >
              {/* {isCreateAccount ? "Sign Up" : "Login"} */}
              {loading ? "Loading..." : isCreateAccount ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <p className="mb-0">
            {isCreateAccount ? (
              <>
                Already have an account ?
                <span
                  onClick={() => setIsCreateAccount(false)}
                  className="text-decoration-underline px-2"
                  style={{ cursor: "pointer" }}
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have an account ?
                <span
                  onClick={() => setIsCreateAccount(true)}
                  className="text-decoration-underline px-2"
                  style={{ cursor: "pointer" }}
                >
                  Sign Up
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
