'use strict';
const options = document.querySelector('.options')
const optionIcon = document.querySelectorAll('.optionIcon')
const optionBox = document.querySelectorAll('.optionBox')
const add = document.querySelector('.add')
const history = document.querySelector('.history')
const search = document.querySelector('.search')
const xuanxiangBox = document.querySelector('.xuanxiangBox')
const optionList = document.querySelector('.optionList')
const contentBox = document.querySelector('.contentBox')
let doneVoice = document.querySelector('.doneVoice')
let cancelVoice = document.querySelector('.cancelVoice')
const saveState = {
    optionListIsOn : false,
    heightGTwidth : false,
    widthGTheight : false,
    addTargetBox: false,
}
xuanxiangBox.onclick = ()=>{
    if (!saveState.optionListIsOn){
        saveState.optionListIsOn = true
        xuanxiangBox.style.transform = 'rotate(-90deg)'
        xuanxiangBox.style.backgroundColor = '#909399'
        reSizeBox()
    }else{
        xuanxiangBox.style.transform = 'rotate(0deg)'
        xuanxiangBox.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
        saveState.optionListIsOn = false
        reSizeBox()
    }
}
window.onload = ()=>{
    reSize()
    showTarget()
}
window.onresize=()=>{
    reSize()
}
function reSize(){
    if (window.innerHeight > window.innerWidth) {
        if (!saveState.heightGTwidth){
            saveState.heightGTwidth = true;
            saveState.widthGTheight = false;
            reSizeBox()
        }
    }else{
        if (!saveState.widthGTheight){
            saveState.widthGTheight = true;
            saveState.heightGTwidth = false
            reSizeBox()
        }
    }
}
function reSizeBox(){
    if (saveState.optionListIsOn == true) {
        if (window.innerHeight >= window.innerWidth) {
            optionsBoxSize('8vh')
            optionsFont('6vh')
            optionList.style.width = '26vh'
        } else {
            optionsBoxSize('6.5vw')
            optionsFont('5vw')
            optionList.style.width = '20.5vw'
        }
    } else {
        optionList.style.width = '0px'
        optionList.style.overflow = 'hidden'
        if (window.innerHeight >= window.innerWidth) {
            optionsBoxSize('7vh')
            optionsFont('5vh')
        } else {
            optionsBoxSize('6vw')
            optionsFont('4vw')
        }
    }
}
function optionsFont(size){
    optionIcon.forEach((item) => {
        item.style.fontSize = size;
    })
}
function optionsBoxSize(size){
    optionBox.forEach((item) => {
        item.style.width = item.style.height = item.style.lineHeight =  size;
    })
}
add.addEventListener('click', throttle(()=>{
    if (saveState.addTargetBox){
        let addTargetBox = document.querySelector('.addTargetBox')
        setTimeout(() => {
            addTargetBox.style.boxShadow = 'none'
            addTargetBox.style.backgroundColor = '';
            addTargetBox.style.opacity = '0'
            contentBox.style.filter = 'blur(0px)'
            add.style.transform = 'rotate(0)'
            setTimeout(() => {
                cover.remove()
                saveState.addTargetBox = false;
                add.classList.remove('optionsBoxFocus')
            }, 300)
        }, 0)
        return;
    }
    saveState.addTargetBox = true;
    add.classList.add('optionsBoxFocus')
    add.style.transform = 'rotate(-45deg)'
    const div = document.createElement('div')
    div.classList.add('addTarget')
    const addTargetBox = document.createElement('div')
    addTargetBox.classList.add('addTargetBox')
    div.innerHTML = `
        <h2>Add Target</h2>
            <div class="addInput">
                <input class="targetValue" type="text" placeholder="事項" >
            </div>
            <div class="targetType">
                <select name="pets" class="typeList">
                    <option disabled value="">請選擇事件類型</option>
                    <option value="work">工作</option>
                    <option value="study">學習</option>
                    <option value="life" selected>生活</option>
                    <option value="relationship">感情</option>
                    <option value="Chill">休閒</option>
                    <option value="urgent">緊急</option>
                </select>
            </div>
            <div class="submitBox">
                send
            </div>
            <div class="addExitBox">
                exit
            </div>
    `
    div.style.opacity = '0';
    let cover = createCover()
    document.body.append(cover)
    cover.append(addTargetBox)
    addTargetBox.append(div)
    contentBox.style.filter = 'blur(5px)'
    setTimeout(() => {
        addTargetBox.style.backgroundColor = 'white';
        addTargetBox.style.boxShadow = '0 3px 5px 1px black';
        div.style.opacity = '1'
    }, 0)
    let targetValue = document.querySelector('.targetValue')
    const submitBtn = document.querySelector('.submitBox')
    const addExitBox = document.querySelector('.addExitBox')
    addExitBox.onclick = throttle(()=>{
            addTargetBox.style.boxShadow = 'none'
            addTargetBox.style.backgroundColor = '';
            div.style.opacity = '0'
            contentBox.style.filter = 'blur(0px)'
            add.style.transform = 'rotate(0)'
            add.classList.remove('optionsBoxFocus')
            setTimeout(() => {
                cover.remove()
                saveState.addTargetBox = false;
                add.style.transform = 'rotate(0)'
                add.classList.remove('optionsBoxFocus')
            }, 300)
    },300)
    submitBtn.onclick = throttle((event) => {
        if (!targetValue.value) {
            return
        }
        addTargetBox.style.filter = 'blur(5px)'
        if (localStorage.getItem('Target') && JSON.parse(localStorage.getItem('Target')).length !== 0) {
            let previousTarget = JSON.parse(localStorage.getItem('Target'))
            let length = previousTarget.length
            let index = previousTarget[length-1].rank
            const newTarget = getTarget(index+1)
            previousTarget[length] = newTarget
            localStorage.setItem('Target', JSON.stringify(previousTarget))
        } else {
            const newTarget = []
            newTarget.push(getTarget(0))
            localStorage.setItem('Target', JSON.stringify(newTarget))
        }
        sendSuccess()
        function removeDiv(){
            setTimeout(() => {
                addTargetBox.style.boxShadow = 'none'
                addTargetBox.style.backgroundColor = '';
                div.style.opacity = '0'
                contentBox.style.filter = 'blur(0px)'
                add.style.transform = 'rotate(0)'
                add.classList.remove('optionsBoxFocus')
                cover.remove()
                setTimeout(()=>{
                    saveState.addTargetBox = false;
                }, 300)
            }, 1000)
        }
        removeDiv()
    },300)
}, 300))
function getTarget(index) {
    let targetValue = document.querySelector('.targetValue')
    let target = {}
    const type = getType()
    let value = { value: targetValue.value }
    const done = { done: false }
    const time = getTime()
    let rank = { rank: index }
    target = Object.assign(value, type, time, done, rank)
    return target
}
function getType() {
    const typeList = document.querySelector('.typeList')
    const index = typeList.selectedIndex
    return { type: typeList[index].value }
}
function getTime(){
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    let day = now.getDate()
    day = day < 10 ? '0' + day : day
    let hour = now.getHours()
    hour = hour < 10 ? '0' + hour : hour
    let minute = now.getMinutes()
    minute = minute < 10 ? '0' + minute : minute
    const ms = now.getTime()
    const time = `${year}年${month}月${day}日${hour}時${minute}分`
    return { time: [time, ms]}
}
function sendSuccess(){
    let noContent = document.querySelector('.noContent')
    if (noContent) {
        noContent.remove()
    }
    let cover = createCover()
    let div = document.createElement('div')
    Object.assign(div.style,{
        position:'fixed',
        bottom: '40vh',
        width: '100vw',
        height: '20vh',
        backgroundColor:'#2C3532',
        transition: 'all .3s',
        overflow:'hidden',
        textAlign: 'center',
        lineHeight: '20vh',
        color:'#fff',
        fontSize:'40px',
        opacity:'0',
    })
    div.textContent = '提交成功'
    div.style.userSelect = 'none'
    document.body.append(cover)
    cover.append(div)
    setTimeout(()=>{
        div.style.opacity = '.9'
        setTimeout(() => {
            div.style.opacity = '0'
            setTimeout(() => {
                cover.remove()
            }, 300)
        }, 1000)
    }, 0)
    showTarget()
}
function throttle(fn, delay) {
    let timer = null
    return function () {
        if (timer) {
            return
        }
        fn()
        timer = setTimeout(() => {
            timer = null
        }, delay)
    }
}
