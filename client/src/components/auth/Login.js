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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {notification && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <div className="w-full lg:w-[45%] bg-blue-900 text-white p-6 lg:p-12 flex flex-col items-start justify-center z-10">
        <div className="flex items-center">
          <img
            src={Ruthi_logo}
            alt="Ruthi Logo"
            className="w-20 lg:w-24 h-auto"
          />
          <h1 className="text-3xl lg:text-5xl font-bold text-start">
            Ruthi
          </h1>
        </div>
        <p className="leading-normal text-2xl text-start">
         Welcome back! Please enter your details.
        </p>
      </div>

      <div className="w-full lg:w-[55%] flex items-center justify-center p-4 lg:p-8 relative">
        <div className="fixed inset-0 overflow-hidden z-0 hidden lg:block">
          <img
            src={wavesNegative}
            alt="SVG Curve"
            className="absolute right-0 top-0 h-full w-full object-cover"
            style={{ transform: "rotate(90deg)" }}
          />
          </div>
        </div>

      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 lg:p-12 z-10">
        <div className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
            Sign In
          </h2>
          <form>
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
            <FormAction handleClick={handleClick} text="Sign In" />
          </form>
          <p className="mt-8 text-sm text-gray-600 text-center">
            Not a user?{" "}
            <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
