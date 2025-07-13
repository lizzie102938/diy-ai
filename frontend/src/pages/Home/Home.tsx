import toolsIcon from '../../assets/tools.svg';
import classes from './Home.module.css';
import { Button } from '../../components/index';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) return alert('Please select an image first');

    setLoading(true);
    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];

        const response = await axios.post('http://localhost:5000/api/analyze', {
          base64Image: base64String,
        });

        const labelAnnotations = response.data.labelAnnotations || [];
        const detectedLabels = labelAnnotations.map(
          (label: unknown) => (label as { description: string }).description
        );

        navigate('/results', { state: { labels: detectedLabels } });
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

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
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <div className={classes.preview}>
              <img src={preview} alt="Preview" width={200} />
            </div>
          )}
        </div>
        <div className={classes.switchContainer}>
          {/* <div>
            <Button
              label={'Fix'}
              onClick={handleAnalyzeClick}
              disabled={loading}
            />
          </div> */}
          <div>
            <Button
              label={'Build'}
              onClick={handleAnalyzeClick}
              disabled={loading}
            />
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Home;
