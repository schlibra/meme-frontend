let width = window.innerWidth
const displayUtil = {
    width: window.innerWidth,
    isXs: width <= 767,
    isSm: width >= 768 && width <= 991,
    isMd: width >= 992 && width <= 1199,
    isLg: width >= 1200
}
window.addEventListener("resize", ()=>{
    width = window.innerWidth
    displayUtil.width = window.innerWidth
    displayUtil.isXs = width < 767
    displayUtil.isSm = width >= 768 && width <= 991
    displayUtil.isMd = width >= 992 && width <= 1199
    displayUtil.isLg = width >= 1200
})
export default displayUtil