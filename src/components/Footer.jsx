import React from "react";
import { Link, NavLink } from "react-router-dom";
import b_r_estate_logo from '../assets/b_r_estate_logo.png'

const Footer = () => {
  return (
    <>
      <footer className="bg-slate-50 rounded-lg shadow dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <NavLink
           
            to={'/'}
              className="flex items-center mb-4 sm:mb-0 space-x-1 rtl:space-x-reverse"
            >
              <img
                src={b_r_estate_logo}
                className="h-16 w-32"
                alt="B R Estate"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-slate-700">
                Bharat Real Estate
              </span>
            </NavLink>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
                <Link to={'/'} className="hover:underline me-4 md:me-6">
                  Home
                </Link>
              </li>
              <li>
                <Link to={'/about'} className="hover:underline me-4 md:me-6">
                  About
                </Link>
              </li>
              <li>
                <Link to={'/contactUs'} className="hover:underline me-4 md:me-6">
                  Contact Us
                </Link>
              </li>
              
              
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <Link to={'/'} className="hover:underline">
              Bharat Real Estate™
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
