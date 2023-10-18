import type { IconBaseProps } from "./IconBase";
import IconBase from "./IconBase";

export const RemoveIcon = (props: IconBaseProps) => {
  return (
    <IconBase {...props}>
      <path
        d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM4 12C4 7.6 7.6 4 12 4C13.8 4 15.5 4.6 16.9 5.7L5.7 16.9C4.6 15.5 4 13.8 4 12ZM12 20C10.2 20 8.5 19.4 7.1 18.3L18.3 7.1C19.4 8.5 20 10.2 20 12C20 16.4 16.4 20 12 20Z"
        fill="currentColor"
      />
    </IconBase>
  );
};
export default RemoveIcon;
