import { ILanguage } from "@common/constant/language";
import ChangeLanguage from "@components/ChangeLanguage";
import Input from "@components/Input";
import Header from "@components/Layout/Header";
import AWSTranslate from "@services/AWS";
import { ITranslateTextPayload } from "@services/AWS/interface";
import { useRouter } from "next/dist/client/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";

const HomeContainer = styled.div`
  ${tw`mb-20`}
`;

const HomeBox = styled.div`
  ${tw`container mx-auto`}
`;

const TranslateBox = styled.div`
  ${tw`w-full grid lg:grid-cols-2 gap-14`}
`;

interface IHome {}

const HomePage: FC<IHome> = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>();
  const [selectInput, setSelectInput] = useState<ILanguage>();
  const [selectOutput, setSelectOutput] = useState<ILanguage>();

  const timer = useRef<any>(null);

  useEffect(() => {
    let url = new URL(location.origin + router.asPath);
    let text = url.searchParams.get("text");

    setInput(text || "Hello world! Who I am.");
  }, []);

  useEffect(() => {
    let url = new URL(location.origin + router.asPath);
    let query: any = handleInitQuery(url);
    console.log(query);

    if (input?.trim() !== "") {
      query.text = input;
    }

    if (selectInput && selectOutput) {
      handleCallApi();

      router.replace({
        query: query,
      });
    }
  }, [input]);

  useEffect(() => {
    if (input) return;
    clearTimeout(timer.current);
    setOutput("");
  }, [input]);

  useEffect(() => {
    handleCallApi();
  }, [selectInput]);

  useEffect(() => {
    handleCallApi();
  }, [selectOutput]);

  const handleInitQuery = (url: URL) => {
    let from = url.searchParams.get("from");
    let to = url.searchParams.get("to");

    return {
      from: selectInput?.LanguageCode || from,
      to: selectOutput?.LanguageCode || to,
    };
  };

  const handleCallApi = () => {
    if (input.trim() === "") return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoading(true);

      let payload: ITranslateTextPayload = {
        Text: input,
        SourceLanguageCode: selectInput?.LanguageCode || "auto",
        TargetLanguageCode: selectOutput?.LanguageCode || "vi",
      };

      handleTranslateApi(payload);
    }, 300);
  };

  const handleChangeOutput = (data: string) => {
    if (input !== "") {
      setOutput(data);
    }
  };

  const handleTranslateApi = async (payload: ITranslateTextPayload) => {
    let data = await AWSTranslate.doTranslate(payload);

    handleChangeOutput(data.TranslatedText);

    setLoading(false);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <HomeContainer>
      <Header />
      <ChangeLanguage
        getSelectInput={setSelectInput}
        getSelectOutput={setSelectOutput}
      />
      <HomeBox>
        <TranslateBox>
          <Input
            value={input}
            onChange={handleChangeInput}
            volIcon
            placeholder="Vui lòng nhập văn bản vào đây ..."
          />
          <Input
            loading={loading}
            value={output}
            eventPoiter={true}
            volIcon
            placeholder=""
          />
        </TranslateBox>
      </HomeBox>
    </HomeContainer>
  );
};

export default HomePage;
