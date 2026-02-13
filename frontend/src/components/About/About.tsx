import StickyLinks from "../StickyLinks/StickyLinks";
import "./About.css";

const About = () => {
  return (
    <div>
      <StickyLinks />
      <div className="about-text">
        <div className="about-text-line-one">I’m a passionate</div>
        <div className="about-text-line-two">nature photographer</div>
        <div className="about-text-line-three">drawn to enigmatic creatures</div>
        <div className="about-text-line-four">
          of all shapes and sizes.
        </div>
        <div className="slide-in">
          I capture quiet, fleeting moments
        </div>
        <div className="slide-in-two">
          where nature tells subtle stories!
        </div>
      </div>
    </div>
  );
};

export default About;
