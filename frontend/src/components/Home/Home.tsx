import { FaPlus } from 'react-icons/fa6';
import toolsIcon from '../../assets/tools.svg';
import classes from './Home.module.css';

function Home() {
  return (
    <div className={classes.home}>
      <div className={classes.leftSide}>
        <div>
          <h1 className={classes.title}>DIY-AI</h1>

          <h3>
            UPLOAD A PHOTO OF YOUR DIY ISSUE OR AMBITION AND WE WILL HELP YOU
            STEP-BY-STEP
          </h3>
        </div>
        <div>
          <img
            src={toolsIcon}
            alt="Tools Icon"
            className="tools-icon"
            width={300}
          />
        </div>
      </div>
      <div className={classes.rightSide}>
        <div className={classes.photoUpload}>
          <FaPlus color="black" size={60} />
          <p>Upload a photo</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
