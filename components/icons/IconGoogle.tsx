// ./components/icons/IconGoogle.tsx
import { Image } from "react-native";
import { ImageType } from "../../types/types";

const IconGoogle = ({ width, height, tintColor, style }: ImageType) => {
  return (
    <Image
      source={require("../../assets/google-icon.png")}
      style={[{ width: width, height: height, tintColor: tintColor }, style]}
    />
  );
};

export default IconGoogle;
