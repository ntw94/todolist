// 1. 투두리스트 디자인
// 2. 추가 하기

let todos = [];

const todoArea = document.getElementById("todoArea");
const doingArea = document.getElementById("doingArea");
const doneArea = document.getElementById("doneArea");

const containers = document.querySelectorAll("div ul");

//초기에 드래그엔드롭 설정
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
            updateTodoCount();
        }
    });
});

getTodoListAll(); // todos 전체 데이터 불러오기
updateTodoCount();

function updateTodoCount(){
    const todoCount = document.getElementById("todoCount");
    const doingCount =  document.getElementById("doingCount") ;
    const doneCount =   document.getElementById("doneCount");

    const todoTodos = document.getElementById("todoArea").querySelectorAll("li");
    const doingTodos = document.getElementById("doingArea").querySelectorAll("li");
    const doneTodos = document.getElementById("doneArea").querySelectorAll("li");

    todoCount.innerHTML = `${todoTodos.length}개 할 일`;
    doingCount.innerHTML = `${doingTodos.length}개 실행중`;
    doneCount.innerHTML = `${doneTodos.length}개 완료`
}

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
// todos전체 불러오기
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

//sidebar에서 todo입력창
function makeTodoTagInSideBar(eventLi,todoId){
    const findTodo = todos.find((todo1)=>Number(todoId) === Number(todo1.id));
    if (!findTodo) return; // 없으면 패스

    const container = document.querySelector("#sidebar");
    container.innerHTML = "";

    const backButtonTag = document.createElement("img");
    const inputTag = document.createElement("input");
    const textareaTag = document.createElement("textarea");

    const dateContainer = document.createElement("div");
    const startLabel = document.createElement("label");
    const endLabel = document.createElement("label");

    const startDate = document.createElement("input");
    const endDate = document.createElement("input");

    const parentLi = eventLi.target.closest('li'); // 누른 li
    const dateDisplayTag = parentLi.querySelector("div"); // 자식중에 div 태그를 찾는다.

    backButtonTag.src="../img/backbutton.png";
    backButtonTag.addEventListener("click",()=>{
        toggleSidebar();
    })

    startLabel.textContent = "시작기간 ";
    endLabel.textContent = "끝기간 ";

    startDate.value= findTodo?.startDate ?? "";
    endDate.value= findTodo?.endDate ?? "";

    startDate.classList.add("input_date_type");
    endDate.classList.add("input_date_type");

    startDate.type="date";
    startDate.addEventListener("input",(event)=>{
        findTodo.startDate = event.target.value;
        localStorage.setItem("todos",JSON.stringify(todos));
        dateDisplayTag.innerHTML = getTimeFormat(findTodo);
    });

    endDate.type="date";
    endDate.addEventListener("input",(event)=>{
        findTodo.endDate = event.target.value;
        localStorage.setItem("todos",JSON.stringify(todos));
        dateDisplayTag.innerHTML = getTimeFormat(findTodo);
    })

    inputTag.value = findTodo.content;
    inputTag.classList.add("side_bar_input");
    textareaTag.value = findTodo.contentDetail;
    textareaTag.placeholder="추가내용 입력"
    
    inputTag.addEventListener("input",(event)=>{
        parentLi.querySelector("span").innerHTML = event.target.value;
        findTodo.content = event.target.value;
        localStorage.setItem("todos",JSON.stringify(todos));
    });

    textareaTag.addEventListener("input",(event)=>{
        findTodo.contentDetail = event.target.value;
        localStorage.setItem("todos",JSON.stringify(todos));
    });

    container.appendChild(backButtonTag);
    container.appendChild(inputTag);
    dateContainer.appendChild(startLabel);
    dateContainer.appendChild(startDate);
    dateContainer.appendChild(document.createElement("br"));
    dateContainer.appendChild(endLabel);
    dateContainer.appendChild(endDate);
    container.appendChild(dateContainer);
    container.appendChild(textareaTag);
}

// Todo HTML Tag 생성 및 이벤트
function makeTagTodo(item){
    const newLi = document.createElement("li");
    const newContent = document.createElement("span");
    const deleteButton = document.createElement("button");
    const dDayTag = document.createElement("div");
    
    newLi.draggable = true;
    newLi.setAttribute("stauts",item.status);
    newLi.setAttribute("id",item.id);
    newContent.innerHTML =  item.content;
    newLi.addEventListener("click",(event)=>{
        
        const todoId = event.target.getAttribute("id") === null ? 
                                    event.target.parentNode.getAttribute("id") :
                                    event.target.getAttribute("id") ; // click된 id

        makeTodoTagInSideBar(event,todoId);
        toggleSidebar();
    });

    dDayTag.innerHTML = getTimeFormat(item);


    deleteButton.innerHTML = "x";
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (event)=>{
        event.stopPropagation();

        const deleteTodo = {id:event.target.parentNode.getAttribute("id"),}
        deletTodos(deleteTodo);
        event.target.parentNode.remove();

        updateTodoCount();
    })

    newLi.appendChild(newContent);
    newLi.appendChild(deleteButton);
    newLi.appendChild(dDayTag);

    if(item.status ==='todo'){
        todoArea.appendChild(newLi);
    }else if(item.status === 'doing')
        doingArea.appendChild(newLi);
    else if(item.status === 'done'){
        doneArea.appendChild(newLi);
    }

};

function getTimeFormat(item){
    const startDate =  item?.startDate ?? "";
    const endDate = item?.endDate ?? "";

    if(startDate !== "" && endDate !== ""){
        return startDate + "~" +endDate;
    }
    if(startDate === "" && endDate !== ""){
        const now = Date.now();
        const target = new Date(endDate).getTime();

        const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

        return diff > 0 ? `D-${diff}` : diff === 0 ? "D-Day" : `D+${Math.abs(diff)}`;
    }

    if(startDate !== "" && endDate === ""){
        return startDate;
    }
    return "";
}

//검색을 위한 TodoList초기화
const makeTodoList = (todos)=>{
    todoArea.innerHTML="";
    doingArea.innerHTML = "";
    doneArea.innerHTML = "";

    todos.forEach((item)=>{
        makeTagTodo(item);
    })
};

//filter을 이용해서 입력한 값을 포함하는 TODO를 찾은 뒤 TODO 생성
const searchButton = (event)=>{
    let searchWord = event.target.value;
    if(searchWord){
        const filteredTodos = todos.filter((todo)=> todo.content.includes(searchWord));
        makeTodoList(filteredTodos);
    }else{
        makeTodoList(todos);
    }
}
//검색 event추가
document.querySelector("#searchInput").addEventListener("input",searchButton);

// 버튼과 사이드바, 배경(overlay) 요소 선택
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

overlay.addEventListener("click", toggleSidebar);

//todo 추가버튼 이벤트
const addButtons = document.querySelectorAll(".add_todo_button");
addButtons.forEach((addButton)=>{
   addButton.addEventListener("click",(event)=>{

      const statusValue =  event.target.getAttribute("status")
       const currentAreaTodos = todos.filter((todo) =>{return todo.status === statusValue}); // 현재 area에 몇개 있는지 체크
       const newTodo = {
           id : Date.now(),
           content : '',
           status: statusValue,
           order: currentAreaTodos.length,
           contentDetail:'',
       }
       addTodos(newTodo);
       makeTagTodo(newTodo);
       updateTodoCount();
   })
})

// 사이드바를 열거나 닫는 함수
function toggleSidebar() {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");  // 배경(overlay)도 토글
}

//현재 시간 표시
const timerContainer = document.getElementById("timerContainer");
setInterval(() => {
    const nowTime = new Date();
    const hour = nowTime.getHours();
    const minutes = nowTime.getMinutes();
    const second = nowTime.getSeconds();
    
    const hourFormat = nowTime.getHours() < 10 ? `0${hour}` :hour;
    const minutesFormat = nowTime.getMinutes() < 10 ? `0${minutes}` :minutes;
    const secondFormat = nowTime.getSeconds() < 10 ? `0${second}` :second;

    timerContainer.innerHTML = hourFormat+ ":" +minutesFormat+":"+secondFormat;        
}, 1000);
