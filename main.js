// função que retorna um elemento HTML por meio do querySelector
const query = (seletor) => {
    return document.querySelector(seletor)
}

// selecionando elementos HTML
const pageContent = query('html[data-contexto]')
const buttons = document.querySelectorAll('.app__card-button')
const musicInput = query('.toggle-checkbox')
const startPauseBtn = query('#start-pause')
const startPauseIcon = query('.app__card-primary-butto-icon')
const startPauseSpan = query('.primary-button__text')
const timer = query('.app__card-timer')

// constantes de áudio
const music = new Audio('./sons/luna-rise-part-one.mp3')
const startAudio = new Audio('./sons/play.wav')
const pauseAudio = new Audio('./sons/pause.mp3')
const endBeep = new Audio('./sons/beep.mp3')

// referências globais
let seconds = 1500
let toggleCondition = false
let intervalo = null

// ---- TROCA DE CONTEXTO ----

// objeto que contém os textos do título
const txts = {
    foco: 'Otimize sua produtividade,',
    focoStrong: 'mergulhe no que importa',
    short: 'Que tal dar uma respirada?',
    shortStrong: 'Faça uma pausa curta',
    long: 'Hora de voltar à superfície.',
    longStrong: 'Faça uma pausa longa'
}

// realiza a troca do texto do título de acordo com o contexto
const changeTitle = (contexto) => {

    let txt
    let strongTxt

    switch (contexto) {
        case 'foco':
            txt = txts.foco
            strongTxt = txts.focoStrong
            break
        case 'short':
            txt = txts.short
            strongTxt = txts.shortStrong
            break
        case 'long':
            txt = txts.long
            strongTxt = txts.longStrong
            break

        default:
            break
    }

    const template = `
        ${txt}<br>
        <strong class="app__title-strong">
            ${strongTxt}
        </strong>
    `
    query('.app__title').innerHTML = template
}

// troca a imagem das pessoas
const changeImage = (img) => {
    query('.app__image').setAttribute('src', `./imagens/${img}.png`)
}

// coloca a class active no button e remove o que estiver com ela, dando o efeito de que está selecionado
const changeButtonClass = (e) => {
    buttons.forEach((button) => {
        if(button.classList.contains('active')){
            button.classList.remove('active')
        }
    })
    e.target.classList.toggle('active')
}

// troca a imagem de fundo de acordo com o contexto
const changeBackgorund = (e) => {
    pageContent.setAttribute('data-contexto', e.target.dataset.contexto)
}

// quando o usuário clicar no button todas as funções de troca de contexto serão executadas
const changeContexto = (e) => {
    changeTitle(e.target.dataset.contexto)
    changeButtonClass(e)
    changeImage(e.target.dataset.contexto)
    changeBackgorund(e)
} 

// troca o tempo do timer de acordo com o contexto
const setTime = (e) => {
    
    if(e.target.dataset.contexto === 'foco'){
        seconds = 1500
    }
    else if(e.target.dataset.contexto === 'short'){
        seconds = 300
    }
    else{
        seconds = 900
    }
    showTime()
}

// atribui a cada button a função 'changeContexto', sendo ativada com o evento 'click'
buttons.forEach((element) => {
    element.addEventListener('click', changeContexto)
})

// adiciona a função 'setTime' aos buttons
buttons.forEach((element) => {
    element.addEventListener('click', setTime)
})

// ---- TOGGLE DA MÚSICA ----

// aciona e pausa a música de acordo com o toggle
const musicFunc = () => {
    if(music.paused){
        music.play()
    }
    else{
        music.pause()
    }
}

// ouve eventos do toggle, executando a função 'musicFunc'
musicInput.addEventListener('change', musicFunc)

// ---- TEMPORIZADOR ----

// a cada intervalo definido na função 'start', retira 1 segundo da variável 'seconds' e mostra o seu novo valor na tela
// quando seconds for menor ou igual a 0, a função finalizar será executada
const decorrerTempo = () => {
    if(seconds <= 0){
        finalizar()
        return 
    }
    seconds -= 1
    showTime()
}

// responsável pelo intervalo de tempo e por pausar o tempo caso intervalo seja diferente de null
const start = () => {
    if(intervalo){
        zerarTempo()
        intervalo = null
    }
    intervalo = setInterval(decorrerTempo, 1000)
}

// interrompe o intervalo
const zerarTempo = () => {
    clearInterval(intervalo)
    intervalo = null
}

// quando intervalo chegar a 0, um beep tocará, aparecerá um alert, indicando o término e o tempo será reiniciado
const finalizar = () => {
    endBeep.play()
    alert('Tempo finalizado!!')
    const activeFocus = pageContent.getAttribute('data-contexto') == 'foco'
    if(activeFocus){
        const event = new CustomEvent('finishedFocus')
        document.dispatchEvent(event)
    }
    zerarTempo()
    endBeep.pause()
    endBeep.currentTime = 0
    toggle()
}

// alterna entre correr o tempo e pausar o tempo, fazendo tembém alterações no button
const toggle = () => {

    toggleCondition = !toggleCondition
    if(toggleCondition){
        startPauseIcon.setAttribute('src', './imagens/pause.png')
        startPauseSpan.innerText = 'Pausar'
        startAudio.play()
        start()
    }
    if(toggleCondition === false){
        startPauseIcon.setAttribute('src', './imagens/play_arrow.png')
        startPauseSpan.innerText = 'Começar'
        pauseAudio.play()
        zerarTempo()
    }
}

// formata a variável 'seconds' para o formato de tempo e o renderiza na tela
const showTime = () => {
    const tempo = new Date(seconds * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    timer.innerHTML = `${tempoFormatado}`
}

// executa a função 'showTime' automaticamente ao entrar no site
showTime()

// ouve eventos de click do button startPauseBtn e executa a função 'toggle'
startPauseBtn.addEventListener('click', toggle)




