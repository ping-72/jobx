import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading, CheckIcon } from "@nextui-org/react"; // Using NextUI for icons

const VerificationPage = () => {
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Simulate email verification API call
                await new Promise((resolve) => setTimeout(resolve, 3000)); // Mocking API delay
                setIsVerified(true);
                setTimeout(() => {
                    navigate("/home");
                }, 5000); // Redirect after 5 seconds
            } catch (error) {
                console.error("Verification failed", error);
                // Handle error (e.g., navigate to an error page)
            }
        };

        verifyEmail();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {!isVerified ? (
                <div className="flex flex-col items-center">
                    <Loading size="xl" color="primary" />
                    <p className="mt-4 text-lg text-gray-700">Verifying your email...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <CheckIcon size={60} color="green" />
                    <p className="mt-4 text-lg text-gray-700">Email verified successfully!</p>
                </div>
            )}
        </div>
    );
};

export default VerificationPage;
