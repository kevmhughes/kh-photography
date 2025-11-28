import StickyLinks from "../StickyLinks/StickyLinks";
import "../About/About.css";

const Contact = () => {
  return (
    <div>
      <StickyLinks />
      <div className="about-text">
        <div className="about-text-line-one">Let’s connect.</div>
        <div className="about-text-line-two">
          For collaborations or inquiries.
        </div>
        <div className="about-text-line-three">
          <strong>email: </strong>
          kevhughes24@hotmail.com{" "}
        </div>
      </div>
    </div>
  );
};

export default Contact;
