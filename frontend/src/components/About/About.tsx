import StickyLinks from "../StickyLinks/StickyLinks";
import "./About.css";

const About = () => {
  return (
    <div>
      <StickyLinks />
      <div className="about-text">
        <div className="about-text-line-one">I’m a passionate</div>
        <div className="about-text-line-two">nature photographer</div>
        <div className="about-text-line-three">drawn to enigmatic postures</div>
        <div className="about-text-line-four">
          and how light shapes emotion.
        </div>
        {/* <div className="slide-in">
          I capture quiet, fleeting moments
        </div>
        <div className="slide-in-two">
          where nature wants to tell its subtle story
        </div> */}
      </div>
    </div>
  );
};

export default About;
