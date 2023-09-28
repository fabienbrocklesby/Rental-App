import React from 'react';
import { Link } from "react-router-dom";

import '../css/Home.css';

const LandingPage = () => {
  return (
    <div className="landing-page pb-2">
      <div fluid className="d-flex flex-column justify-content-center custom-bottom-margin align-items-center text-center text-white homepage-landing" style={{
        minHeight: "60vh",
        backgroundImage: `url("../images/background.jpg")`,
        backgroundRepeat: "repeat",
      }}>
        <div className="bg-primary m-4 p-5 rounded-3 shadow-sm bg-opacity-75">
          <h1 className="font-weight-bold" style={{ fontSize: "60px" }}>
            Kia Ora!
          </h1>
          <p className="lead">Welcome to New Zealand's Premier Rental Marketplace</p>
        </div>
      </div>
      <div className="text-center text-primary justify-content-center" style={{marginTop: "7.5vh", minHeight: "25vh"}}>
        <h2 className="font-weight-bold" style={{fontSize: "60px"}}>Discover Endless Possibilities</h2>
        <p className="lead mt-2 container">
          Discover endless opportunities to elevate your experiences with EZGear. Whether you're on a trip or simply looking to try something new, our rental marketplace offers you a gateway to explore a wide range of high-quality items. From adventure gear to cutting-edge electronics, you can easily rent the items you need for your next adventure without the commitment of ownership. Imagine enjoying thrilling activities during your holiday or experimenting with the latest technology, all while reducing clutter and minimizing your environmental impact. With a diverse selection at your fingertips, you're just a click away from embracing the extraordinary.
        </p>
        <Link as="Link" to="/items" className="btn btn-primary mt-2">Browse Items Now!</Link>
      </div>
      <div className="container" style={{minHeight: "25vh"}}>
        <div className="container bg-white p-0 rounded shadow mt-5" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
          <div className="text-center bg-primary py-3 rounded-top">
            <h1 className="text-white">Check It Out</h1>
          </div>
          <div className="d-flex justify-content-center p-4">
            <Link as="Link" to="/login" className="btn btn-primary mx-2">Login</Link>
            <Link as="Link" to="/register" className="btn btn-primary mx-2">Register</Link>
          </div>
        </div>
      </div>
      <div className="text-center text-primary justify-content-center mt-4" style={{marginTop: "7.5vh", minHeight: "25vh"}}>
        <h2 className="font-weight-bold" style={{fontSize: "60px"}}>Unused Stuff Laying Around Your House?</h2>
        <p className="lead mt-2 container">
          Unlock the potential of your extra belongings and turn them into a steady source of passive income with EZGear. Our premier rental marketplace provides a seamless platform for individuals to showcase their unused items and share them with others. From outdoor equipment to gadgets and more, you can easily list your items and contribute to a sustainable sharing economy. Make the most of what you have while helping others find what they're looking for. Join us today and embark on a journey to maximize the value of your possessions.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
