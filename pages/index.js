import { useState } from 'react';

export default function TextToImage() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('कृपया कोई description लिखें');
      return;
    }

    setLoading(true);
    setError('');
    setImage(null);

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
    } catch (err) {
      setError('Image generate करने में error आई। कृपया फिर से try करें।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        Text to Image Generator
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="अपनी desired image का description लिखें... (English में)"
          rows="4"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        onClick={generateImage}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating Image...' : 'Generate Image'}
      </button>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #ef5350',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      {image && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h3>Generated Image:</h3>
          <img 
            src={image} 
            alt="Generated" 
            style={{
              maxWidth: '100%',
              maxHeight: '500px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>
      )}
    </div>
  );
}
