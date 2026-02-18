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
          <div className="about-text-line-one">
            <div>I’m a passionate</div>
            <div>nature photographer</div>
            <div>drawn to enigmatic creatures</div>
            <div>of all shapes and sizes.</div>
          </div>
          <div className="about-text-line-two">
            <div>I capture fleeting moments</div>
            <div>where nature tells subtle stories</div>
            <div>revealing the hidden poetry of the wild.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
