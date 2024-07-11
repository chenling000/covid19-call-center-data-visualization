import { IconButton, Tooltip } from "@mui/material";
import { FC, ReactNode } from "react";

interface TooltipIconButtonProps {
  tooltipText: string;
  onClick: () => void;
  disabled: boolean;
  icon: ReactNode;
}

const TooltipIconButton: FC<TooltipIconButtonProps> = (props) => {
  const { tooltipText, onClick, disabled, icon } = props;
  return (
    <Tooltip title={tooltipText}>
      <IconButton size="large" onClick={onClick} disabled={disabled}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default TooltipIconButton;
