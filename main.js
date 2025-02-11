// 1. 투두리스트 디자인
// 2. 추가 하기

let todos = [];

const todoArea = document.getElementById("todoArea");
const doingArea = document.getElementById("doingArea");
const doneArea = document.getElementById("doneArea");

const containers = document.querySelectorAll("div ul");

containers.forEach((container) => {
    new Sortable(container, {
        group: "shared",
        animation: 150,
        ghostClass: "blue-background-class",
        onEnd(evt) {
            // 드래그 종료 후, 놓은 위치의 부모 요소를 가져옵니다
            const droppedElement = evt.item; // 드래그한 아이템
            const droppedColumn = evt.to; // 드롭된 위치의 컬럼 (ul 요소)
            const updateTodo = {
                id:droppedElement.getAttribute("id"),
                status:droppedColumn.getAttribute("status"),
            }

            console.log(evt.target.getAttribute("status"));
            console.log(droppedColumn.getAttribute("status"));
            droppedElement.setAttribute("status",droppedColumn.getAttribute("status"));
            
            updateTodos(updateTodo);
            console.log(updateTodo);
            //evt.item.textContent = droppedElement.textContent.split(" ")[0] +" " + droppedColumn.getAttribute("status");
            // 업데이트

        }
    });
});

function addTodos(todo){
    todos.push(todo);
    localStorage.setItem("todos",JSON.stringify(todos));
}
function deletTodos(todo){
   todos = todos.filter((item) => {return Number(item.id) !== Number(todo.id)});
   localStorage.setItem("todos",JSON.stringify(todos));
}
function updateTodos(todo){
    const findTodo = todos.filter((item) =>Number(item.id) === Number(todo.id));

    if(findTodo[0]){
        if(todo.content){findTodo[0].content = todo.content;}
        findTodo[0].status = todo.status;
        console.log(findTodo[0]);
        localStorage.setItem("todos",JSON.stringify(todos));
    }else{
        console.log("없음");
    }
}
function getTodoListAll(){
    todos = JSON.parse(localStorage.getItem("todos"));

    //todos가 없으면 빈배열로 초기화
    if(!todos) todos = []; 

    todos.forEach((item)=>{
        const newLi = document.createElement("li");
        const newContent = document.createElement("span");
        const deleteButton = document.createElement("button");
        
        newLi.draggable = true;
        newLi.setAttribute("stauts",item.status);
        newLi.setAttribute("id",item.id);
        newContent.innerHTML =  item.content;
        
        deleteButton.innerHTML = "x";
        deleteButton.addEventListener("click", (event)=>{
            const deleteTodo = {
                id:event.target.parentNode.getAttribute("id"),
            }
            deletTodos(deleteTodo);
            event.target.parentNode.remove();
        })
    
        newLi.appendChild(newContent);
        newLi.appendChild(deleteButton);

        if(item.status ==='todo'){
            
            todoArea.appendChild(newLi);
        }else if(item.status === 'doing')
        
            doingArea.appendChild(newLi);
        else if(item.status === 'done'){
        
            doneArea.appendChild(newLi);
        }

    })
}

getTodoListAll();

document.getElementById("todoAddButton").addEventListener("click",()=>{
    const todoValue = document.getElementById("todoInput");
    const status = document.getElementById("status");
    const statusValue = status.options[status.selectedIndex].value;

    const id = Date.now();

    const newTodo = {
        id : Date.now(),
        content : todoValue.value,
        status: statusValue,
    }

    addTodos(newTodo);

    if(!todoValue.value){ return;}

    const newLi = document.createElement("li");
    const newContent = document.createElement("span");
    const deleteButton = document.createElement("button");
    
    newLi.draggable = true;
    newLi.setAttribute("stauts",newTodo.status);
    newLi.setAttribute("id",newTodo.id);

    newContent.innerHTML =  newTodo.content;
    
    deleteButton.innerHTML = "x";
    deleteButton.addEventListener("click", (event)=>{
        event.target.parentNode.remove();
    })

    newLi.appendChild(newContent);
    newLi.appendChild(deleteButton);

    todoValue.value = ""; 

    if(statusValue ==='todo'){
        todoArea.appendChild(newLi);
    }else if(statusValue === 'doing')
        doingArea.appendChild(newLi);
    else if(statusValue === 'done')
        doneArea.appendChild(newLi);
});


