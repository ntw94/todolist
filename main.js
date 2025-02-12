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
                status:droppedColumn.getAttribute("status"), // 바뀌는 위치
            }

            // order 순서초기화
            const curAreaTodos = document.querySelectorAll("#"+droppedColumn.id + " li");            
            curAreaTodos.forEach((todoTag,index)=>{
                const findTodo  = todos.find((todo)=>{return Number(todo.id) === Number(todoTag.getAttribute("id"))});
                if(!findTodo?.order) findTodo.order = index; // 없으면 생성
                else findTodo.order = index;                        //index값 초기화
            })
            
            droppedElement.setAttribute("status",droppedColumn.getAttribute("status")); // 요소 태그 변경
            
            updateTodos(updateTodo);

        }
    });
});

function addTodos(todo){
    todos.push(todo);
    localStorage.setItem("todos",JSON.stringify(todos));
}
function deletTodos(todo){
   todos = todos.filter((item) => Number(item.id) !== Number(todo.id));
   localStorage.setItem("todos",JSON.stringify(todos));
}
function updateTodos(todo){
    const findTodo = todos.find((todo1)=>Number(todo.id) === Number(todo1.id));

    if(findTodo){
        // if(todo.content){findTodo.content = todo.content;}
        findTodo.status = todo.status; // 상태값만 변경
        localStorage.setItem("todos",JSON.stringify(todos));
    }
}
function getTodoListAll(){
    todos = JSON.parse(localStorage.getItem("todos"));

    //todos가 없으면 빈배열로 초기화
    if(!todos) todos = []; 

    todos.sort((a,b) =>{
        return Number(a.order)-Number(b.order);
    })

    todos.forEach((item)=>{
        makeTagTodo(item);
    })
}

document.getElementById("todoAddButton").addEventListener("click",()=>{
    const todoValue = document.getElementById("todoInput");
    const status = document.getElementById("status");
    const statusValue = status.options[status.selectedIndex].value;

    const id = Date.now();

    const currentAreaTodos = todos.filter((todo) =>{return todo.status === statusValue}); // 현재 area에 몇개 있는지 체크
    console.log(currentAreaTodos);

    const newTodo = {
        id : Date.now(),
        content : todoValue.value,
        status: statusValue,
        order: currentAreaTodos.length,
    }

    if(!todoValue.value){ return;}

    addTodos(newTodo);
    makeTagTodo(newTodo);
    todoValue.value = "";
});

function makeTodoTagInSideBar(todo){
    const sidebarContainer = document.getElementById("sidebar");
    const h2Tag = document.createElement("h2");
    const pTag = document.createElement("p");
    
}
// Todo HTML Tag 생성 및 이벤트
function makeTagTodo(item){
    const newLi = document.createElement("li");
    const newContent = document.createElement("span");
    const deleteButton = document.createElement("button");
    
    newLi.draggable = true;
    newLi.setAttribute("stauts",item.status);
    newLi.setAttribute("id",item.id);
    newContent.innerHTML =  item.content;
    newLi.addEventListener("click",(event)=>{
        
        transferDataToSidebar();
        toggleSidebar();

    })

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

}

const makeTodoList = (todos)=>{
    todoArea.innerHTML="";
    doingArea.innerHTML = "";
    doneArea.innerHTML = "";

    todos.forEach((item)=>{
        makeTagTodo(item);
    })
}

const searchButton = (event)=>{
    let searchWord = event.target.value;
    if(searchWord){
        const filteredTodos = todos.filter((todo)=> todo.content.includes(searchWord));
        makeTodoList(filteredTodos);
    }else{
        makeTodoList(todos);
    }

}
document.querySelector("#searchInput").addEventListener("input",searchButton);

 // 버튼과 사이드바, 배경(overlay) 요소 선택
 const sidebar = document.getElementById("sidebar");
 const overlay = document.getElementById("overlay");

 // 사이드바를 열거나 닫는 함수
 function toggleSidebar() {
   sidebar.classList.toggle("open");
   overlay.classList.toggle("show");  // 배경(overlay)도 토글
 }

 overlay.addEventListener("click", toggleSidebar);
getTodoListAll();

