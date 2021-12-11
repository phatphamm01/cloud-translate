import { Microphone2, VolumeHigh } from "iconsax-react";
import { FC } from "react";
import styled from "styled-components";
import tw from "twin.macro";

const ControlContainer = styled.div`
  ${tw`w-full h-16`}
`;
const ControlBox = styled.div`
  ${tw`bg-gray-100 h-full flex justify-between px-4 items-center`}
`;

const ControlLeft = styled.div`
  ${tw`flex gap-4`}
`;
const ControlRight = styled.div`
  ${tw``}
`;
const IconBox = styled.div`
  ${tw`shadow p-2 rounded-full`}
`;

interface IControl {
  micIcon?: boolean;
  volIcon?: boolean;
}

const Control: FC<IControl> = ({ micIcon, volIcon }) => {
  return (
    <ControlContainer>
      <ControlBox>
        <ControlLeft>
          {micIcon && (
            <IconBox>
              <Microphone2 size="28" color="#535353" />
            </IconBox>
          )}
          {volIcon && (
            <IconBox>
              <VolumeHigh size="28" color="#535353" />
            </IconBox>
          )}
        </ControlLeft>
        <ControlRight></ControlRight>
      </ControlBox>
    </ControlContainer>
  );
};

export default Control;
