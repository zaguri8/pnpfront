import { v4 } from "uuid"
import { StyleBuilder } from "../../settings/styles.builder"
import { Realtime } from "../../store/external"
import { PNPPublicRide, UserEnterStatistics } from "../../store/external/types"
import { TransactionSuccess } from "../../store/payments/types"
import DataComponent from "../generics/DBComponent"
import { withHookGroup } from "../generics/withHooks"
import { PageHolder } from "../utilityComponents/Holders"

function Test() {

    return <PageHolder>
    </PageHolder>
}

export default withHookGroup(Test, ['headerExt'])