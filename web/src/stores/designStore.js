import { observable } from 'mobx'

const designStore = observable({
    screenSize: {
        x: 0,
        y: 0
    }
})

const updateScreenSize = () => {
    designStore.screenSize.x = window.innerWidth
    designStore.screenSize.y = window.innerHeight
}

window.addEventListener('resize', updateScreenSize)
window.addEventListener('load', updateScreenSize)

export default designStore