// ./components/buttons/ButtonGoogleSignIn.tsx
import { mouseEvents } from "../../hooks/mouseEvents";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import "../../styles/css/form.css";
import IconGoogle from "../icons/IconGoogle";

type ButtonGoogleSignInProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  caption: string;
};

const ButtonGoogleSignIn: React.FC<ButtonGoogleSignInProps> = ({
  onClick,
  caption,
}) => {
  const { handleMouseEnter, handleMouseLeave } = mouseEvents();
  const {
    buttonBorderColor,
    buttonBorderRadius,
    buttonBorderStyle,
    buttonBorderWidth,
    themeBackgroundColor,
    themeHeaderTextColor,
  } = useGlobalStyles();

  return (
    <button
      className="form-googleSignInButton"
      onClick={onClick}
      style={{
        color: themeHeaderTextColor,
        backgroundColor: themeBackgroundColor,
        borderColor: buttonBorderColor,
        borderRadius: buttonBorderRadius,
        borderStyle: buttonBorderStyle,
        borderWidth: buttonBorderWidth,
      }}
      onMouseEnter={() => handleMouseEnter(".form-googleSignInButton")}
      onMouseLeave={() => handleMouseLeave(".form-googleSignInButton")}
    >
      <IconGoogle width={15} height={15} />
      <span>{caption}</span>
    </button>
  );
};

export default ButtonGoogleSignIn;
