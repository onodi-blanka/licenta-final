import React, { useEffect, useState } from 'react';
import { myMockResponse } from '../myMockDog';

interface Dalle3MockAPIProps {
  searchQuery: string;
  setCurrentImage: (image: string) => void;
}
// Mock function to simulate fetching from ChatGPT API

const Dalle3MockAPI: React.FC<Dalle3MockAPIProps> = ({
  searchQuery,
  setCurrentImage,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      handleFetchImage(searchQuery);
    }
  }, [searchQuery]);

  const handleFetchImage = async (query: string) => {
    setLoading(true);
    const response: any = await fetchFromChatGPTAPI(query);
    console.log(response);
    //setImage(response.myMockResponse.data[0].url);
    setLoading(false);
    setCurrentImage(response.data[0].url);
  };

  return (
    <div className="p-4">
      {/* <button
        onClick={() => handleFetchImage(searchQuery)}
        className="p-2 bg-blue-500 text-white rounded"
        disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Image'}
      </button> */}
      {image && (
        <div className="mt-4">
          <img src={image} alt="Generated" className="w-full rounded" />
        </div>
      )}
    </div>
  );
};

export default Dalle3MockAPI;
