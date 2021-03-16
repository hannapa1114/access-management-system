const workTarget = document.getElementById('workTarget')
const company = document.getElementById('company')
const accessNum = document.getElementById('accessNum')
const ctime = document.getElementById('ctime')
const object = document.getElementById('accessObj')
const represent = document.getElementById('representNm')
const confirm = document.getElementById('confirmNm')
const workLog = document.getElementById('workLog')
const searchFile = document.getElementById('searchFile')
const dpfiles = document.getElementById('dpfile')
const setfile = document.getElementById('setfile')
const lf = document.getElementById('list')
const inBtn = document.getElementById('in')
const outBtn = document.getElementById('out')
const checkBtn = document.getElementById('checkAccess')
const fd = document.getElementById('foreDate')
const pd = document.getElementById('postDate')
const logBody = document.getElementById('logbody')

// list 파일 렌더 tempFile 삭제시 남은 파일 uploadFile upload 대기 파일 isIn 퇴실 시 입실 중 확인 변수 
let list = [], tempFile = [], uploadFile = [], isIn = null;
let out_createdAt = '';

// event
// 검색 버튼 이벤트
searchFile.addEventListener('change', function () {
    getFileName();
})

// 첨부 버튼 이벤트
setfile.addEventListener('click', function () {
    if (searchFile.files.length > 0 && dpfiles.value !== '파일 선택') {

        // uploadFile = searchFile.files

        for (let i = 0; i < searchFile.files.length; i++) {
            tempFile.push(searchFile.files[i])
        }
        uploadFile = tempFile
        $(lf).empty();
        for (let i = 0; i < searchFile.files.length; i++) {
            list.push(searchFile.files[i].name)
        }
        renderList();
        dpfiles.value = '파일 선택'
        searchFile.type = 'radio'
        searchFile.type = 'file'
    } else {
        alert('선택된 파일이 없습니다')
    }
})
// 신규 버튼 이벤트
inBtn.addEventListener('click', function () {
    //입력 필드 색 초기화
    $('#workTarget').css({ 'background-color': 'white' })
    $('#accessObj').css({ 'background-color': 'white' })
    $('#company').css({ 'background-color': 'white' })
    $('#representNm').css({ 'background-color': 'white' })
    $('#accessNum').css({ 'background-color': 'white' })
    $('#confirmNm').css({ 'background-color': 'white' })
    $('#workLog').css({ 'background-color': 'white' })

    // 유효성 검사
    if (workTarget.value === '' || object.value === '' || company.value === '' || represent.value === '' || accessNum.value <= 0 || confirm.value === '' || workLog.value === '') {
        if (workTarget.value === '') {
            $('#workTarget').css({ 'background-color': '#FFFFBF' })
            $('#workTarget').attr('placeholder', '필수 입력칸입니다')
        }
        if (object.value === '') {
            $('#accessObj').css({ 'background-color': '#FFFFBF' })
            $('#accessObj').attr('placeholder', '필수 입력칸입니다')
        }
        if (company.value === '') {
            $('#company').css({ 'background-color': '#FFFFBF' })
            $('#company').attr('placeholder', '필수 입력칸입니다')
        }
        if (represent.value === '') {
            $('#representNm').css({ 'background-color': '#FFFFBF' })
            $('#representNm').attr('placeholder', '필수 입력칸입니다')
        }
        if (accessNum.value === '') {
            $('#accessNum').css({ 'background-color': '#FFFFBF' })
            $('#accessNum').attr('placeholder', '필수 입력칸입니다')
        }
        if (confirm.value === '') {
            $('#confirmNm').css({ 'background-color': '#FFFFBF' })
            $('#confirmNm').attr('placeholder', '필수 입력칸입니다')
        }
        if (workLog.value === '') {
            $('#workLog').css({ 'background-color': '#FFFFBF' })
            $('#workLog').attr('placeholder', '필수 입력칸입니다')
        }
    } else {

        const form = new FormData();

        form.append('workTarget', workTarget.value)
        form.append('accessObj', object.value)
        form.append('company', company.value)
        form.append('representName', represent.value)
        form.append('accessNum', accessNum.value)
        form.append('confirmName', confirm.value)
        form.append('workLog', workLog.value)
        form.append('createdAt', getTodayDateTime())
        for (let i = 0; i < uploadFile.length; i++) {
            form.append('file' + String(i), uploadFile[i])
        }

        fetchPost('http://10.32.50.99/access/in', form)

        setTimeout(init, 1000)



        list = [], tempFile = [], uploadFile = []
        clearInput()

    }
})
// 퇴실 버튼 이벤트
outBtn.addEventListener('click', function () {
    if (isIn === '입실 중') {
        const form = new FormData();

        form.append('workTarget', workTarget.value)
        form.append('accessObj', object.value)
        form.append('company', company.value)
        form.append('representName', represent.value)
        form.append('accessNum', accessNum.value)
        form.append('confirmName', confirm.value)
        form.append('workLog', workLog.value)
        form.append('createdAt', out_createdAt)
        form.append('updatedAt', getTodayDateTime())
        form.append('accessDate', getTodayDate())


        fetchPost('http://10.32.50.99/access/out', form)

        setTimeout(init, 500)

        clearOutMasking()

    } else {
        alert('입실중이 아닙니다')
    }



})

//function
// 첨부할 파일명 tag 생성
const createListItem = (index, filename) => {

    const div = document.createElement('div')
    const col1 = document.createElement('div')
    const col2 = document.createElement('div')
    const check = document.createElement('input')

    check.type = 'checkbox'
    check.classList.add('col-1', 'mt-1', 'checkbox')

    div.classList.add('row', 'border-bottom')
    col1.className = 'col-2'
    col2.className = 'col-7'

    col1.textContent = index + 1
    col2.textContent = filename

    div.appendChild(check)
    div.appendChild(col1)
    div.appendChild(col2)

    check.addEventListener('click', function () {
        div.classList.toggle('on')
    })

    lf.appendChild(div)
}
// 생성된 파일명 렌더
const renderList = () => {
    for (let i = 0; i < list.length; i++) {
        createListItem(i, list[i])
    }

}

const getFileName = () => {
    const fileList = searchFile.files
    let fileListArray = []
    for (let key in fileList) {
        if (key <= fileList.length)
            fileListArray.push(fileList[key].name)
    }

    const result = fileListArray.reduce((a, c) => {
        if (a === '') {
            a = a + c
            return a
        }
        a = a + ', ' + c
        return a
    })
    dpfiles.value = result

}

const setTempFile = () => {
    uploadFile = searchFile.files

    for (let i = 0; i < searchFile.files.length; i++) {
        tempFile.push(searchFile.files[i])
    }

}

// 서약서 
const createPledge = (person) => {
    const div = document.createElement('div')
    const name = document.createElement('div')
    const position = document.createElement('div')
    const birth = document.createElement('div')

    name.textContent = person.name
    position.textContent = person.position
    birth.textContent = person.birth

    div.className = 'around'


    div.appendChild(name)
    div.appendChild(position)
    div.appendChild(birth)

    const pbody = document.getElementById('plist-body')
    pbody.appendChild(div)
}

const getTodayDate = () => {
    let today = new Date();
    let y = today.getFullYear();
    let m = String(today.getMonth() + 1).padStart(2, '0');
    let d = String(today.getDate()).padStart(2, '0');

    let ymd = y + '-' + m + '-' + d;
    return ymd;
}

const getTodayDateTime = () => {
    let today = new Date();
    let y = today.getFullYear();
    let m = String(today.getMonth() + 1).padStart(2, '0');
    let d = String(today.getDate()).padStart(2, '0');
    let h = String(today.getHours()).padStart(2, '0');
    let mi = String(today.getMinutes()).padStart(2, '0');
    let s = String(today.getSeconds()).padStart(2, '0');

    let ymd = y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
    return ymd;
}

const getOneMonthAgo = () => {
    let today = new Date();
    let ago = new Date(today.setMonth(today.getMonth() - 1))
    let y = ago.getFullYear();
    let m = String(ago.getMonth() + 1).padStart(2, '0');
    let d = String(ago.getDate()).padStart(2, '0');

    let ymd = y + '-' + m + '-' + d;
    return ymd;
}

const fetchPost = (url = '', formData) => {
    return fetch(url, {
        method: 'POST',
        body: formData,
    })
}

const checkAccess = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

const initWorkLog = () => {
    $('#logbody').empty()
    checkAccess('http://10.32.50.99/access/log', {
        accessDate: getTodayDate()
    })
        .then(res => res.json())
        .then(data => {
            console.log('data', data)
            data ? renderWorkLogs(data) : alert('출입이력이 없습니다')
        })
}

const init = () => {
    $('#pagination').pagination({
        dataSource: function (done) {
            $.ajax({
                type: 'GET',
                url: 'http://10.32.50.99/access/log',
                success: function (res) {
                    done(res)
                }
            })
        },
        pageSize: 5,
        pageRange: null,
        showPageNumbers: true,
        callback: (data, pagination) => {
            var html = renderPageLogs(data)
            $('#logbody').html(html)
        }

    })
}

init();