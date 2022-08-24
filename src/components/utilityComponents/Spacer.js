import { v4 } from "uuid";

export default function Spacer({ offset }) {
    const getSpace = () => <br key={v4()} />
    const getSpaces = () => {
        const spaces = []
        do {
            spaces.push(getSpace())
            offset--
        } while (offset > 0);
        return spaces
    }

    return <div>{getSpaces()}</div>
}