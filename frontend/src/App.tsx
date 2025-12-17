import { BrowserRouter, Routes, Route } from "react-router-dom";
/* import { Analytics } from "@vercel/analytics/react"; */

import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Albums from "./components/Albums/Albums";
import Gallery from "./components/Gallery/Gallery";
import About from "./components/About/About";
import Shop from "./components/Shop/Shop";
import Product from "./components/Product/Product";
import Contact from "./components/Contact/Contact";
import Success from "./components/Success";

import { ProductProvider } from "../src/context/ProductContext";

import "./App.css";

function App() {
  return (
    <>
      <ProductProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/galleries" element={<Albums />} />
            <Route path="/gallery/:slug" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<Product />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success" element={<Success />} />
          </Routes>
          {/* <Analytics /> */}
        </BrowserRouter>
      </ProductProvider>
    </>
  );
}

export default App;
