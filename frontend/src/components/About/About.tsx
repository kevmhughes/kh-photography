import StickyLinks from "../StickyLinks/StickyLinks";
import "./About.css";
/* import Face from "../../assets/kevinhughes_face.png" */
import Body from "../../assets/kevinhughes_body.png";
import Trees from "../../assets/trees.png";

const About = () => {
  return (
    <div>
      <StickyLinks />
      <div className="about-container">
        <div className="about-images-container">
          <img
            src={Body}
            alt="Image of the website owner"
            className="slide-in-face body"
          />
          <img
            src={Trees}
            alt="Image of trees behind the website owner"
            className="slide-in-face-two trees"
          />
        </div>

        <div className="about-text">
          <div className="about-text-line-one">I’m a passionate</div>
          <div className="about-text-line-two">nature photographer</div>
          <div className="about-text-line-three">
            drawn to enigmatic creatures
          </div>
          <div className="about-text-line-four">of all shapes and sizes.</div>
          <div className="about-text-line-five">I capture those fleeting moments</div>
          <div className="about-text-line-six">where nature tells subtle stories</div>
          <div className="about-text-line-seven">revealing the hidden poetry of the wild.</div>
        </div>
      </div>
    </div>
  );
};

export default About;
