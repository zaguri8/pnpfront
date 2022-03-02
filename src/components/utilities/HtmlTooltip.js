import { styled } from "@mui/styles";
import { Tooltip,tooltipClasses } from "@mui/material";
export const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'orange',
      color: 'white',
      maxWidth: 220,
      fontSize: '16px'
    },
  }));