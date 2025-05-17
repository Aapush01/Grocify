import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="bg-amber-300 w-full p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
        <p>© All rights are reserved 2025</p>
        <div className="flex gap-4 text-2xl">
          <a href="#" className="hover:text-[#316ff6]"><FaFacebook /></a>
          <a href="#" className="hover:text-[#0A66C2]"><FaLinkedin /></a>
          <a href="#" className="hover:text-[#7b3d3d]"><FaSquareXTwitter /></a>
          <a href="#" className="hover:text-[#E1306C]"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
