import AWS from "aws-sdk";
import { ITranslateTextPayload } from "./interface";

AWS.config.region = "us-east-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-1:e8ecc73b-676d-46f8-89ba-e957866f07e6",
});

const AWSTranslate = (function () {
  const translate = new AWS.Translate({ region: AWS.config.region });
  const polly = new AWS.Polly();

  const doTranslate = (payload: ITranslateTextPayload) => {
    if (!payload.Text) {
      throw "Vui lòng nhập đầu vào";
    }

    return translate.translateText(payload).promise();
  };

  return {
    doTranslate: doTranslate,
  };
})();

export default AWSTranslate;
