import React from "react";
import HeroSvg from "../assets/hero.svg";
import CandidateSvg from "../assets/candidate.svg";
import RecruiterSvg from "../assets/recruiter.svg";

const RuthiLandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold text-blue-600">Ruthi</h1>
        <div>
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full mr-2">
            Log in
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-full">
            Sign Up
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="flex flex-col md:flex-row items-center justify-between py-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">Welcome To Ruthi</h2>
            <h3 className="text-2xl font-semibold mb-4">
              Connecting Talent With Opportunity
            </h3>
            <p className="mb-6">
              At Ruthi, we bridge the gap between employers and job seekers with
              our innovative solutions. Whether you're looking to hire top
              talent or find your dream job, our platform provides a seamless,
              efficient, and fair hiring experience.
            </p>
            <button className="px-6 py-3 bg-orange-500 text-white rounded-full text-lg font-semibold">
              START NOW
            </button>
          </div>
          <div className="md:w-1/2 relative mt-8 md:mt-0">
            <img
              src={HeroSvg}
              alt="Happy job seeker"
              className="rounded-lg"
            />
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center justify-between py-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src={RecruiterSvg}
              alt="Smart Hiring Illustration"
              className="w-full"
            />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <h2 className="text-3xl font-bold mb-4">
              Your Partner in Smart Hiring
            </h2>
            <p className="mb-6">
              Our platform ensures a seamless and efficient hiring process,
              creating equal opportunities and fostering a fair recruitment
              environment for all.
            </p>
            <button className="px-6 py-3 bg-orange-500 text-white rounded-full text-lg font-semibold">
              Post Job
            </button>
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center justify-between py-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">
              Your Job Hunt Simplified
            </h2>
            <p className="mb-6">
              As a job seeker, you deserve a platform that understands your
              needs. At Ruthi, we provide the resources and support to help you
              navigate the job market and land your dream job with confidence.
            </p>
            <div className="flex space-x-4">
              <button className="px-6 py-3 border border-orange-500 text-orange-500 rounded-full text-lg font-semibold">
                Refer a Friend
              </button>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-full text-lg font-semibold">
                Register Now
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src={CandidateSvg}
              alt="Job Search Illustration"
              className="w-full"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default RuthiLandingPage;
