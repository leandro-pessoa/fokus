// selecionando elementos HTML
const form = query('.app__form-add-task')
const addTaskBtn = query('.app__button--add-task')
const cancelBtn = query('.app__form-footer__button--cancel')
const textArea = query('.app__form-textarea')
let tasksList = query('.app__section-task-list')
const liEmpty = query('.app__section-task-list-empty')
const activeTask = query('.app__section-active-task-description')
const deleteFinishedsBtn = query('#btn-remover-concluidas')
const deleteAllBtn = query('#btn-remover-todas')

// referências globais
let tasks = JSON.parse(localStorage.getItem('tasks')) || []
let selectedTask = null
let liSelectedTask = null

// atualiza o localStorage quando solicitada
const updateTasks = (task) => {
    localStorage.setItem('tasks', JSON.stringify(task))
}

// faz a alternância da visibilidade do formulário
const apearAndCloseAddForm = () => {
    form.classList.toggle('hidden')
    textArea.value = ''
}

// realiza a adição de uma nova tarefa na aplicação
const saveTask = (e) => {
    e.preventDefault()

    const description = textArea.value
    const id = 9999999 * Math.random()
    const finished = false

    const task = {
        id: id,
        description: description,
        finished: finished
    }

    tasks.push(task)
    liEmpty.classList.add('hidden')
    showTasks(task)
    updateTasks(tasks)
    apearAndCloseAddForm()
}

// responsável por renderizar cada tarefa na tela de acordo com sua descrição
const showTasks = (task) => {

    // li
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    // svg
    const svg = document.createElement('svg')
    const template = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    svg.innerHTML = template

    // p
    const p = document.createElement('p')
    p.classList.add('app__section-task-list-item-description')
    p.textContent = task.description

    // button
    const button = document.createElement('button')
    button.classList.add('app__button-edit')

    // faz a troca da descrição da tarefa
    button.onclick = () => {
        const newDescription = prompt('Qual é o novo nome da tarefa?')
        if(newDescription){
            p.textContent = newDescription
            tasks.forEach((item) => {
                if(item.id === task.id){
                    let index = tasks.indexOf(item)
                    tasks.splice(index, 1)
                    tasks.splice(index, 0, {id: task.id, description: newDescription, finished: task.finished})
                }
            })
            updateTasks(tasks)
        }
    }

    // img
    const img = document.createElement('img')
    img.setAttribute('src', './imagens/edit.png')
    button.append(img)

    // li
    li.append(svg)
    li.append(p)
    li.append(button)

    // se a task não estiver finalizada ...
    if(!task.finished){

        // torna a tarefa ativa, adicionando a descrição ao topo da lista e alterando seu estilo
        // o que dá um efeito de focus ao elemento da lista
        li.onclick = () => {
            const tasksListItems = document.querySelectorAll('.app__section-task-list-item')
            tasksListItems.forEach((item) => {
                item.classList.remove('app__section-task-list-item-active')
            })
            
            if(selectedTask == task.id){
                activeTask.textContent = ''
                selectedTask = null
                liSelectedTask = null
                return 
            }
    
            selectedTask = task.id
            liSelectedTask = li
            activeTask.textContent = task.description
            li.classList.add('app__section-task-list-item-active')
        }
    }

    // se a task estiver finalizada ...
    if(task.finished){
        li.classList.add('app__section-task-list-item-complete')
        button.setAttribute('disabled', 'true')
    }

    // ul
    tasksList.append(li)

}

// finaliza a tarefa, adicionando um fundo verde a ela e desabilitando o botão de edição
// além disso, altera no localStorage a condição de finalizada para verdadeiro
const finishTask = () => {
    if(selectedTask && liSelectedTask){
        liSelectedTask.classList.remove('app__section-task-list-item-active')
        liSelectedTask.classList.add('app__section-task-list-item-complete')
        liSelectedTask.querySelector('button').setAttribute('disabled', 'true')
        activeTask.textContent = ''
        tasks.forEach((task) => {
            if(task.id == selectedTask){
                const index = tasks.indexOf(task)
                tasks.splice(index, 1)
                tasks.splice(index, 0, {id: task.id, description: task.description, finished: true})
            }
        })
        updateTasks(tasks)
    }   
}

// (modo 1) caso haja tarefas finalizadas, exclui elas
// (modo 2) exclui todas as tarefas existentes
const deleteTasks = (finishedOnly) => {
    const seletor = finishedOnly ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    const element = document.querySelectorAll(seletor)
    element.forEach(element => {
        element.remove()
    })

    tasks = finishedOnly ? tasks.filter(task => !task.finished) : []
    updateTasks(tasks)

    if(!finishedOnly){
        liEmpty.classList.remove('hidden')
    }
}

// executa a função 'showTasks', verificando se há alguma task salva
// se não houver, uma mensagem aparecerá, mostrando que a lista está vazia
const render = () => {
    if(tasks.length >= 1){
        tasks.forEach((task) => {
            showTasks(task)
        })
        liEmpty.classList.add('hidden')
    }
    else{
        liEmpty.classList.remove('hidden')
    }
}

// executa a função 'render' automaticamente ao entrar na página
render()

// listeners de evento
addTaskBtn.addEventListener('click', apearAndCloseAddForm)
cancelBtn.addEventListener('click', apearAndCloseAddForm)
form.addEventListener('submit', saveTask)
document.addEventListener('finishedFocus', finishTask)
deleteFinishedsBtn.addEventListener('click', ()=>deleteTasks(true))
deleteAllBtn.addEventListener('click', ()=>deleteTasks(false))


