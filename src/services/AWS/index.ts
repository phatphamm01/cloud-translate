import { ITranslateTextPayload } from './interface';
import axios from 'axios';

const AWSTranslate = (function () {
  const doTranslate = (
    payload: ITranslateTextPayload
  ): Promise<{ text: string }> => {
    if (!payload.Text) {
      throw 'Vui lòng nhập đầu vào';
    }

    return new Promise(async (resolve) => {
      try {
        const data = await axios.get('https://translate-api-nu.vercel.app/', {
          params: {
            text: payload.Text,
            from: payload.SourceLanguageCode,
            to: payload.TargetLanguageCode,
          },
        });
        resolve(data.data);
      } catch (error) {
        resolve({ text: 'fail' });
      }
    });
  };

  return {
    doTranslate: doTranslate,
  };
})();

export default AWSTranslate;
