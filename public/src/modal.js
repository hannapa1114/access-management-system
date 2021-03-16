const slideContent = document.querySelectorAll('.slide')
const slideNext = document.querySelector('#slide-next')
const slidePrev = document.querySelector('#slide-prev')

let slideIndex = 1
showSlides(slideIndex)

function plusSlides(n) {
    showSlides(slideIndex += n)
}

function currentSlide(n) {
    showSlides(slideIndex = n)
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slide")
    var dots = document.getElementsByClassName("dot")
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "")
    }
    slides[slideIndex - 1].style.display = "block"
    dots[slideIndex - 1].className += " active"
}
slideNext.addEventListener('click', () => {
    if (curIndex <= slideLen - 1) {
        slideList.style.transition = slideSpeed + "ms"
        slideList.style.transform = "translated3d(" + (slideWidth * (curIndex + 2)) + "px, 0px, 0px"
    }
})

$('#helpBtn').click(function () {
    helpModal()
})

$('#mask').click(function () {
    $(this).hide();
    $('#container_modal').css({ 'display': 'none' })
    clearInput()
})

const helpModal = () => {
    $('#container_modal').css({ 'display': 'block' })
    maskingWindow();
}

$('#out_mask').click(function () {
    $(this).hide();
    $('#out').attr('disabled', true)
    $('#out_mask').css({ 'display': 'none' })
    clearInput()
})

const outMasking = () => {
    $('#out').attr('disabled', false)
    $('#out_mask').css({ 'display': 'block' })
}

const clearOutMasking = () => {
    $('#out').attr('disabled', true)
    $('#out_mask').css({ 'display': 'none' })
    clearInput()
}

const maskingWindow = () => {
    let h = $(document).height();
    let w = $(document).width();

    $('#mask').css({ 'width': w, 'height': h })

    $('#mask').fadeIn(1000)
    $('#mask').fadeTo("slow", 0.8)
}

const clearWindow = () => {
    $('#mask').css({ 'width': 0, 'height': 0 })
    $('#mask').empty()
    clearInput()
}

const clearInput = () => {
    workTarget.value = ''
    object.value = ''
    company.value = ''
    represent.value = ''
    accessNum.value = ''
    confirm.value = ''
    workLog.value = ''
    dpfile.value = ''
    $(lf).empty()
    $('#plist-body').empty()
    $('#workTarget').css({ 'background-color': 'white' })
    $('#workTarget').attr('placeholder', '')
    $('#accessObj').css({ 'background-color': 'white' })
    $('#accessObj').attr('placeholder', '')
    $('#company').css({ 'background-color': 'white' })
    $('#company').attr('placeholder', '')
    $('#representNm').css({ 'background-color': 'white' })
    $('#representNm').attr('placeholder', '')
    $('#accessNum').css({ 'background-color': 'white' })
    $('#accessNum').attr('placeholder', '')
    $('#confirmNm').css({ 'background-color': 'white' })
    $('#confirmNm').attr('placeholder', '')
    $('#workLog').css({ 'background-color': 'white' })
    $('#workLog').attr('placeholder', ' ')
}

