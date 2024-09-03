"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconUserBolt,
  IconPlus,
  IconBook,
  IconDeviceDesktop,
  IconBriefcase
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../ui/lib/utils";
import Ruthi_Logo from "../assets/Ruthi_Logo.svg";
import BasicInformationForm from "./ProfilePageComponents/BasicInformationForm";
import Education from "./ProfilePageComponents/Education";
import ExperienceForm from "./ProfilePageComponents/ExperienceForm";

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Basic Information");

  const links = [
    {
      label: "Basic Information",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Education",
      href: "#",
      icon: (
        <IconBook className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Experience",
      href: "#",
      icon: (
        <IconBriefcase className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Technical Skills",
      href: "#",
      icon: (
        <IconDeviceDesktop className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Add more",
      href: "#",
      icon: (
        <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "http://localhost:3000/",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={() => setSelectedSection(link.label)}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Roshan Chenna",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Dashboard selectedSection={selectedSection} />
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img
        src={Ruthi_Logo}
        alt="Ruthi Logo"
        className="h-5 w-6 object-cover rounded-br-lg rounded-tr-sm rounded-lg rounded-bl-sm flex-shrink-0"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Ruthi
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img
        src={Ruthi_Logo}
        alt="Ruthi Logo"
        className="h-5 w-6 object-cover rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
      />
    </Link>
  );
};


const Dashboard = ({ selectedSection }) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {(() => {
          switch (selectedSection) {
            case "Basic Information":
              return <BasicInformationForm />;
            case "Education":
              return <Education />;
            case "Experience":
              return <ExperienceForm />;
            // ... other cases ...
            default:
              return <BasicInformationForm />;
          }
        })()}
      </div>
    </div>
  );
};
