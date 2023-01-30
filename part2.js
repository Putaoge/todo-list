function showTarget(){
    if (document.querySelector('.contentList')){
        document.querySelector('.contentList').remove()
    }
    let div = document.createElement('div')
    if(!localStorage.getItem('Target') || getTargetInfo()==false){
        div.classList.add('noContent')
        let p = document.createElement('p')
        p.textContent = 'no list yet'
        div.append(p)
        contentBox.append(div)
        return 
    }

    let ul = document.createElement('ul')
    ul.classList.add('contentList')
    let Target = getTargetInfo().reverse()
    let tempStr = ``
    let tempArr = []
    Target.forEach((item, index)=>{
        if(item.done === true){
            tempArr.push(index)
        }
        let text = 
        `<li class="contentItem">
                <div class="targetText">
                    <p class="date">${item.time[0]}  類型: ${item.type}</p>
                    <p class="text">${item.value}</p>
                </div>
                <span 
                class="iconfont icon-icon chooseMenu doneOrFalse-${item.rank}"></span>
            </li>`  
        tempStr += text
    })
    ul.innerHTML = tempStr
    tempArr.forEach(item=>{
        setDoneState(ul.childNodes[item], Target[item].costTime)
    })
    
    

    
    contentBox.append(ul)
    setMenuEvent()
}

function getTargetInfo(){
    if (!localStorage.getItem('Target')){
        return
    }
    return JSON.parse(localStorage.getItem('Target'))
}
function setMenuEvent(){
    let aChooseMenu = document.querySelectorAll('.chooseMenu')
    aChooseMenu.forEach(item=>{
        item.onclick = (event)=>{
            createOptionsWindow(event)
        }
    })
}
function createOptionsWindow(event){
    let contentItem = event.target.parentNode
    let cover = createCover()
    cover.innerHTML = 
    `
        <div class="DoneOrCancelBox">
            <div class="doneKey">
                <span class="iconfont icon-wancheng"></span>
                完成
            </div>
            <div class="deleteKey">
                <span class="iconfont icon-quxiao"></span>
                刪除
            </div>
            <span class="iconfont icon-quxiao1"></span>
        </div>
    `
    document.body.append(cover)
    contentBox.style.filter = 'blur(5px)'
    let cancel =  document.querySelector('.icon-quxiao1')
    let deleteKey = document.querySelector('.deleteKey')
    let doneKey = document.querySelector('.doneKey')
    let rank = event.target.classList[3].split('-')[1]
    let targetInfo = getTargetInfo()
    let index;
    for (let i = 0; i < targetInfo.length; i++){
        if (targetInfo[i].rank == rank){
            index = i
        }
    }
    cancel.onclick = (event)=>{
        exit()
    }
    deleteKey.onclick = (event)=>{
        exit()
        cancelVoice.play()
        delTarget(contentItem, index)
    }
    doneKey.onclick = (event)=>{
        exit()
        doneVoice.play()
        if (contentItem.classList.contains('successTarget')) {
            return;
        }
        let costTime = getDiffTime(targetInfo[index].time[1])
        setDoneState(contentItem, costTime)
        targetInfo[index].done = true
        targetInfo[index].costTime = costTime
        localStorage.setItem('Target', JSON.stringify(targetInfo))
    }
    function exit(){
        cover.remove()
        contentBox.style.filter = 'blur(0px)'
    }
}
function delTarget(contentItem, index){
    contentItem.classList.add('leaveMove')
    setTimeout(()=>{
        contentItem.remove()
        delTargetInfo(index)
        showTarget()
    },1000)
}
function delTargetInfo(index){
    let target = getTargetInfo()
    target.splice(index,1)
    localStorage.setItem('Target', JSON.stringify(target))
}
function setDoneState(contentItem, costTime){
    contentItem.classList.add('successTarget')
    let span = document.createElement('span')
    span.className = "iconfont icon-wancheng1"
    Object.assign(span.style,{
        position: 'absolute',
        right: '10px',
        bottom: '0px',
        userSelect : 'none',
    })
    let p = document.createElement('p')
    p.textContent = `用時: ${costTime}`
    p.classList.add('costTime')
    contentItem.append(span,p)
}
function createCover(){
    let div = document.createElement('div')
    div.classList.add('cover')
    return div
}
function getDiffTime(previousTime){
    let now = +new Date()
    let diff = now - previousTime
    let msOneDay = 1000 * 60 * 60 * 24
    let msOneHour = 1000 * 60 * 60
    let msOneMinute = 1000 * 60
    let msOneSecond = 1000
    let result = ``;
    let Days, Hours, Minutes, Seconds
    if(diff > msOneDay){
        Days = ~~(diff / msOneDay)
        diff -= Days * msOneDay
        Hours = ~~(diff / msOneHour)
        diff -= Hours * msOneHour
        Minutes = ~~(diff / msOneMinute)
        diff -= Minutes * msOneMinute
        Seconds = ~~(diff / msOneSecond)
        result = `${Days}天 ${Hours}小時 ${Minutes}分鐘 ${Seconds}秒`
    }else if(diff > msOneHour){
        Hours = ~~(diff / msOneHour)
        diff -= Hours * msOneHour
        Minutes = ~~(diff / msOneMinute)
        diff -= Minutes * msOneMinute
        Seconds = ~~(diff / msOneSecond)
        result = `${Hours}小時 ${Minutes}分鐘 ${Seconds}秒`
    }else if(diff>msOneMinute){
        Minutes = ~~(diff / msOneMinute)
        diff -= Minutes * msOneMinute
        Seconds = ~~(diff / msOneSecond)
        result = `${Minutes}分鐘${Seconds}秒`
    } else if (diff > msOneSecond){
        Seconds = ~~(diff / msOneSecond)
        result = `${Seconds}秒`
    }else if(diff){
        result = `你好, 穿越者`
    }else{
        result = `太快啦`
    }
    return result
}
let fakeTime = +new Date('2023/01/31')
