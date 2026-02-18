import StickyLinks from "../StickyLinks/StickyLinks";
import "../About/About.css";

const Contact = () => {
  return (
    <div>
      <StickyLinks />
      <div className="about-text" style={{marginTop: "5rem"}}>
        If you have questions about prints, licensing, or coming-up photography
        tours, feel free to reach out!
      </div>
    </div>
  );
};

export default Contact;
