import { BrowserRouter, Routes, Route } from "react-router-dom";
/* import { Analytics } from "@vercel/analytics/react"; */

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Albums from "./components/Albums/Albums";
import Gallery from "./components/Gallery/Gallery";
import About from "./components/About/About";
import Shop from "./components/Shop/Shop";
import Contact from "./components/Contact/Contact";

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galleries" element={<Albums />} />
          <Route path="/gallery/:id" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        {/* <Analytics /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
