import { myMockResponse } from '@/myMockDog';
import { ImageSizes } from '@/app/hooks/useFetchOpenAIImage';

export const fetchFromChatGPTAPI = async (
  myPrompt: string,
  sizing: ImageSizes,
) => {
  console.log('Prompt received by mock API:', myPrompt);

  // Uncomment and use this code when you want to fetch from the actual API
  const myActualDog = await fetch(
    'https://api.openai.com/v1/images/generations',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          // 'Bearer sk-proj-',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: myPrompt,
        n: 1,
        size: sizing,
        style: 'vivid',
      }),
    },
  );

  const data = await myActualDog.json();
  console.log(data.data[0].url);
  const myResp = data;
  // return myMockResponse;

  // const myResp = await new Promise((resolve) => {
  //   setTimeout(() => {
  //     // This simulates the response we would get from the ChatGPT API
  //     resolve(myMockResponse);
  //   }, 1000);
  // });
  //
  return myResp;
};
