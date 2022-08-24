import { styled } from "@mui/styles";
import { Tooltip, tooltipClasses } from "@mui/material";
import { DARK_BLACK } from "../../settings/colors";
export const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: DARK_BLACK,
    color: 'white',
    maxWidth: 220,
    direction: 'rtl',
    fontSize: '16px'
  },
}));