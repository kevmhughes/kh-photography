import Logo from "../../assets/logo.svg"
import "./Loader.css"

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={Logo} alt="Spinner icon" className="spinner-icon" />
    </div>
  )
}

export default Loader
