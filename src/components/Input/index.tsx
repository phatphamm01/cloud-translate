import { ChangeEvent, FC, MutableRefObject, RefObject } from "react";
import Loading from "@design/Loading";
import tw from "twin.macro";
import Control from "./components/Control";
import styled from "styled-components";

const InputContainer = styled.div`
  ${tw`min-h-[360px] border shadow-lg rounded-xl overflow-hidden`}
`;
const InputBox = styled.div`
  ${tw`h-full flex flex-col`}
`;
const InputMain = styled.div`
  ${tw`relative flex-grow`}
`;
const InputText = styled.textarea<{ resize: boolean }>`
  ${tw`w-full h-full outline-none p-4 text-lg font-medium text-gray-600`}
  resize: ${({ resize }) => (resize ? "vertical" : "none")};
`;

interface IInput {
  micIcon?: boolean;
  volIcon?: boolean;
  resize?: boolean;
  eventPoiter?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  loading?: boolean;
}

const Input: FC<IInput> = ({
  micIcon,
  volIcon,
  resize = false,
  eventPoiter = false,
  placeholder = "...",
  onChange = () => {},
  value,
  loading = false,
}) => {
  return (
    <InputContainer>
      <InputBox>
        <InputMain>
          <InputText
            value={value}
            disabled={eventPoiter}
            resize={resize}
            onChange={onChange}
            placeholder={placeholder}
          />

          {loading && <Loading />}
        </InputMain>
        <Control micIcon={micIcon} volIcon={volIcon} />
      </InputBox>
    </InputContainer>
  );
};

export default Input;
