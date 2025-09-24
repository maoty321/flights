const menuBar = document.getElementById('menu-btn')
const navLinks = document.getElementById('nav-links')
const menuBarIcon = menuBar.querySelector('i')
const  onewayBtn = document.getElementById('onewayBtn')
const  roundtipBtn = document.getElementById('roundtipBtn')

const  oneway= document.getElementById('oneway')
const  roundtip= document.getElementById('roundtip')

menuBar.addEventListener('click', function(e) {
    navLinks.classList.toggle('open')

    const isOpen = navLinks.classList.contains('open')

    menuBarIcon.setAttribute("class", isOpen ? 'ri-close-line' : 'ri-menu-line')
})

navLinks.addEventListener('click', (e)=> {
    navLinks.classList.remove('open')
    menuBarIcon.setAttribute('class', 'ri-menu-line');
})



roundtipBtn.addEventListener('click', function(e) {
    oneway.style.display = 'none'
    roundtip.style.display = 'block'

     roundtipBtn.classList.add('active')
    onewayBtn.classList.remove('active')
})

onewayBtn.addEventListener('click', function(e) {
    oneway.style.display = 'block'
    roundtip.style.display = 'none'

    onewayBtn.classList.add('active')
    roundtipBtn.classList.remove('active')
})








