

import axios from "axios";
export default function ServerRequest<T>(path: string, body: any, success: (any: T) => void, error: (error: any) => void) {
    axios.post("https://www.nadavsolutions.com/gserver/" + path,
        { ...body, credentials: { key: "N_O_R_M_M_A_C_D_O_N_A_L_D" } })
        .then(result => success(result.data))
        .catch(er => error(er))
}