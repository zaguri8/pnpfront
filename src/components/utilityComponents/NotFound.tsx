import { SECONDARY_WHITE } from "../../settings/colors";
import { NOTFOUND } from "../../settings/strings";

export default function NotFound(props: { lang: string }) {
    return <h1 style={{ color: SECONDARY_WHITE }}>{NOTFOUND(props.lang)}</h1>;
  }
  
