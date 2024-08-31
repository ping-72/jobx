import { useState } from "react";
import { loginFields } from "../../constants/formFields";
import FormAction from "../FormAction";
import InputField from "../Input";
import NotificationBanner from "../NotificationBanner";
import useNotification from "../../services/useNotification";
import { loginUserAPI } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Ruthi_logo from "../../assets/Ruthi_logo.png";
import wavesNegative from "../../assets/wavesNegative.svg";

// import {Input} from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const { setToken, setUserInfo } = useAuth();
  const [loginState, setLoginState] = useState(fieldsState);
  const navigate = useNavigate();

  const { notification, showNotification, closeNotification } =
    useNotification();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    loginUserAPI(loginState, showNotification, setToken, setUserInfo, navigate);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-bl from-orange-500 to-blue-500">
      {notification && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <div class="custom-shape-divider-bottom-1725100452">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>

      {/* Left Side Content*/}
      <div className="w-full lg:w-1/2 text-white p-4 lg:p-6 flex flex-col items-center justify-center z-10">
        <div className="flex items-center mr-16">
          <img
            src={Ruthi_logo}
            alt="Ruthi Logo"
            className="w-24 lg:w-36 h-auto mb-3"
          />
          <h1 className="text-4xl lg:text-8xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-blue-900 font-mono">
            Ruthi
          </h1>
        </div>
        <p className="text-base lg:text-xl max-w-xs lg:max-w-sm leading-relaxed text-start">
          Welcome back! Please enter your details.
        </p>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative">
        <div className="relative p-4 lg:p-6 rounded-lg w-full max-w-md z-10 lg:mr-8 shadow-lg bg-white opacity-90">
          <h2 className="text-2xl lg:text-3xl font-bold text-blue-700 mb-4">
            Sign In
          </h2>
          <form className="space-y-3 mb-2">
            {fields.map((field) => (
              <InputField
                key={field.id}
                handleChange={handleChange}
                value={loginState[field.id]}
                labelText={field.labelText}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={field.placeholder}
                error={field.error}
                errorMessage={field.errorMessage}
              />
            ))}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-2 sm:mb-0">
                <Checkbox defaultSelected radius="sm" color="primary" size="sm">
                  Remember me
                </Checkbox>
              </div>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>
            <FormAction
              handleClick={handleClick}
              text="Sign In"
              customStyles="w-full bg-blue-600 hover:bg-blue-700 text-white"
            />
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Not a user?{" "}
            <a
              href="/signup"
              className="text-blue-700 font-semibold"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
