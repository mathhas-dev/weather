import { observable } from 'mobx'
import * as modules from 'modules'

export default observable({
    get modulos() {
        return ({ ...modules })
    }
})