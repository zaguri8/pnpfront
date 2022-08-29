import { v4 } from "uuid"
import { UserEnterStatistics } from "../../store/external/types"
import DataComponent from "../generics/DBComponent"
import { withHookGroup } from "../generics/withHooks"
import { PageHolder } from "../utilityComponents/Holders"


const UserStats = DataComponent<UserEnterStatistics>()
function Test() {
    return <PageHolder>
        <UserStats dft={(rt) => rt.addListenerToUserStatistics}
            render={(data) => {
                return <div>{
                    data.stats.map(stat => {
                        return <div key={v4()}>
                            {stat.date}
                        </div>
                    })
                }</div>
            }} />
    </PageHolder>
}

export default withHookGroup(Test, ['headerExt'])