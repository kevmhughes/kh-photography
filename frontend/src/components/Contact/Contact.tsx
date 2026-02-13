import StickyLinks from "../StickyLinks/StickyLinks";
import "../About/About.css";

const Contact = () => {
  return (
    <div>
      <StickyLinks />
      <div className="about-text">
        <div className="about-text-line-one">If you have questions about prints, </div>
        <div className="about-text-line-two">licensing, or future photography tours,</div>
        <div className="about-text-line-three">
          feel free to reach out!
        </div>
        <div className="about-text-line-four">
          <strong>kevhughes24@hotmail.com</strong>
        </div>
      </div>
    </div>
  );
};

export default Contact;
