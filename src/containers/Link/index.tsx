import { FC, FormEvent, Fragment, useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import Header from "@components/Layout/Header";
import axios from "axios";
import AWSTranslate from "@services/AWS";
import Select from "./components/Select";
import { ILanguage } from "@common/constant/language";
import Loading from "@design/Loading";

const LinkPageContainer = styled.div`
  ${tw``}
`;
const LinkBox = styled.div`
  ${tw`flex flex-col`}

  height: calc(100vh - 60px);
`;
const BoxHtml = styled.div`
  ${tw`relative w-full flex-grow`}
`;
const Iframe = styled.iframe`
  ${tw`h-full`}
  /* width */
::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
const Form = styled.form`
  ${tw`mt-10 flex items-center container mx-auto`}
`;
const InputBox = styled.div`
  ${tw`flex-grow border flex items-center`}
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;
const Input = styled.input`
  ${tw`w-full p-3 outline-none`}
`;
const ButtonBox = styled.div`
  ${tw`h-[50px]`}
`;
const Button = styled.button`
  ${tw`px-10 bg-blue-600 h-full text-white`}
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const LoadingBox = styled.div`
  ${tw`fixed w-[100vw] h-[100vh] `}
  background-color: #33333333;
`;

interface ILinkPage {}

const LinkPage: FC<ILinkPage> = () => {
  const [html, setHtml] = useState<string>();
  const iframeRef = useRef<any>();
  const [input, setInput] = useState<string>("");
  const [select, setSelect] = useState<ILanguage>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {}, []);

  const getPageApi = async (url: string) => {
    try {
      setHtml("");
      setLoading(true);
      let response = await axios.get("/api/get-page", {
        params: {
          url: url,
        },
      });

      let data = response.data;

      let doc = new DOMParser().parseFromString(data, "text/html");

      let items = Array.from(doc.getElementsByTagName("*"));

      await Promise.all(
        items.map(async (value) => {
          if (
            value?.children.length === 0 &&
            value.textContent &&
            value.tagName !== "SCRIPT" &&
            value.tagName !== "STYLE"
          ) {
            let data = await AWSTranslate.doTranslate({
              Text: value.textContent,
              SourceLanguageCode: "auto",
              TargetLanguageCode: select?.LanguageCode || "vi",
            });

            value.textContent = data.TranslatedText;
          }
        })
      );

      setLoading(false);
      setHtml(new XMLSerializer().serializeToString(doc));
    } catch (error: any) {
      setLoading(false);
      console.log(error.massage);
    }
  };

  const writeHTML = (frame: any) => {
    if (!frame) {
      return;
    }
    iframeRef.current = frame;

    iframeRef.current.contentWindow.console.error = function () {
      /* nop */
    };

    let doc = frame.contentDocument;
    doc.open();
    doc.write(html);
    doc.close();
    console.log(frame.contentDocument);

    frame.style.width = "100%";
    frame.style.height = `${frame.contentWindow.document.body?.scrollHeight}px`;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    getPageApi(input);
  };

  return (
    <Fragment>
      {loading && (
        <LoadingBox>
          <Loading />
        </LoadingBox>
      )}
      <LinkPageContainer>
        <Header />
        <LinkBox>
          <Form onSubmit={handleSubmit}>
            <InputBox>
              <Input
                onChange={(e) => setInput(e.target.value)}
                placeholder="Link translate"
              />
              <Select setSelect={setSelect} />
            </InputBox>
            <ButtonBox>
              <Button type="submit">Translate</Button>
            </ButtonBox>
          </Form>
          <BoxHtml>
            {html && (
              <Iframe src="about:blank" frameBorder="0" ref={writeHTML} />
            )}
          </BoxHtml>
        </LinkBox>
      </LinkPageContainer>
    </Fragment>
  );
};

export default LinkPage;
