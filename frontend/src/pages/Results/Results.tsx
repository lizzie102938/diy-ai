import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getYouTubeEmbedUrl } from '../../utils/getEmbedUrl';
import classes from './Results.module.css';
import ReactMarkdown from 'react-markdown';

function Results() {
  const location = useLocation();
  const labels = useMemo(() => location.state?.labels || [], [location.state]);

  const [responseText, setResponseText] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAIResponse() {
      setLoading(true);
      setResponseText('');
      setVideoUrl(null);
      try {
        const prompt = `Please explain how to install this. Format your answer with bullet points, numbered steps, or paragraphs as appropriate. Start the answer with "Here are the steps you need to follow:". The item labels are: ${labels.join(
          ', '
        )}`;
        const res = await axios.post('http://localhost:5000/api/openai', {
          prompt,
          labels,
        });
        setResponseText(res.data.text);
        setVideoUrl(res.data.videoUrl);
      } catch (error) {
        console.error(error);
        setResponseText('Failed to get response from AI');
      } finally {
        setLoading(false);
      }
    }

    if (labels.length > 0) {
      fetchAIResponse();
    }
  }, [labels]);

  const embedUrl = getYouTubeEmbedUrl(videoUrl || '');

  return (
    <div className={classes.resultsContainer}>
      <div className={classes.leftSide}>
        <h1>Build Instructions</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{<ReactMarkdown>{responseText}</ReactMarkdown>}</p>
        )}
      </div>
      <div className={classes.rightSide}>
        <div className={classes.videoContainer}>
          {embedUrl ? (
            <div className={classes.video}>
              <iframe
                width="560"
                height="315"
                src={embedUrl}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className={classes.video}></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Results;
