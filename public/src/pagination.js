const paginateWorkLog = (obj) => { // 출입이력 페이지네이션
    let splitDate = obj.createdAt.split(' ')
    let splitOutTime = obj.updatedAt.split(' ')
    let workFile = []
    if (obj.files.length > 0) {
        for (let i = 0; i < obj.files.length; i++) {
            workFile.push(obj.files[i].fileName)
        }

    }

    const div = document.createElement('div')
    const date_li = document.createElement('div')
    const in_li = document.createElement('div')
    const out_li = document.createElement('div')
    const out_btn = document.createElement('button')
    const company_li = document.createElement('div')
    const accessNum_li = document.createElement('div')
    const accessObj_li = document.createElement('div')
    const confirmName_li = document.createElement('div')
    const fileName_li = document.createElement('div')

    div.classList.add('lb-item', 'fl')
    date_li.classList.add('item_wd', 'col-1')
    in_li.classList.add('item_wd', 'col-1')
    out_li.classList.add('item_wd', 'col-1')
    out_btn.classList.add('item_wd', 'col-1', 'btn', 'btn-primary')
    company_li.classList.add('item_wd', 'col-1')
    accessNum_li.classList.add('item_wd', 'col-1')
    accessObj_li.classList.add('item_wd', 'col-1')
    confirmName_li.classList.add('item_wd', 'col-1')
    fileName_li.classList.add('item_wd', 'col-2')

    date_li.textContent = splitDate[0]
    in_li.textContent = splitDate[1]
    obj.createdAt !== obj.updatedAt ? out_li.textContent = splitOutTime[1] : out_btn.textContent = '입실 중'
    company_li.textContent = obj.company
    accessNum_li.textContent = obj.accessNum
    accessObj_li.textContent = obj.accessObj
    confirmName_li.textContent = obj.confirmName
    workFile.length > 0 ? fileName_li.textContent = workFile[0] : fileName_li.textContent = '없음'

    div.appendChild(date_li)
    div.appendChild(in_li)
    obj.createdAt !== obj.updatedAt ? div.appendChild(out_li) : div.appendChild(out_btn)
    div.appendChild(company_li)
    div.appendChild(accessNum_li)
    div.appendChild(accessObj_li)
    div.appendChild(confirmName_li)
    div.appendChild(fileName_li)

    // 각 출입이력 클릭 시 화면 마스킹 및 퇴실 버튼 활성화
    out_btn.addEventListener('click', function () {
        $('#list').empty()
        isIn = out_btn.textContent

        outMasking()

        workTarget.value = obj.workTarget;
        company.value = obj.company;
        accessNum.value = obj.accessNum;
        object.value = obj.accessObj;
        represent.value = obj.representName;
        confirm.value = obj.confirmName;
        out_createdAt = date_li.textContent + ' ' + in_li.textContent

        for (let i = 0; i < workFile.length; i++) {
            createListItem(i, workFile[i])
        }
    })

    return div
}

const renderPageLogs = (logs) => {
    let result = document.createElement('div');
    for (let i = 0; i < logs.length; i++) {
        result.appendChild(paginateWorkLog(logs[i]))
    }
    isIn = null
    return result
}