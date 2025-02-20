
let board = [];
let todos = [];


const todoArea = document.getElementById("todoArea");
const doingArea = document.getElementById("doingArea");
const doneArea = document.getElementById("doneArea");
const boardButtonArea = document.getElementById("boards");
const containers = document.querySelectorAll("div ul");

// 버튼과 사이드바, 배경(overlay) 요소 선택
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

initialize(); // 시작함수

function updateTodoCount(){
    const todoCount = document.getElementById("todoCount");
    const doingCount =  document.getElementById("doingCount") ;
    const doneCount =   document.getElementById("doneCount");

    const todoTodos = document.getElementById("todoArea").querySelectorAll("li");
    const doingTodos = document.getElementById("doingArea").querySelectorAll("li");
    const doneTodos = document.getElementById("doneArea").querySelectorAll("li");

    todoCount.innerHTML = `${todoTodos.length}개`;
    doingCount.innerHTML = `${doingTodos.length}개`;
    doneCount.innerHTML = `${doneTodos.length}개`
}

function addTodos(todo){

    const selectedBoard = document.querySelector(".active");
    if(!selectedBoard) return;

    const findBoard = board.find((item) => Number(item.board_id) === Number(selectedBoard.getAttribute("board_id")));
    findBoard.todos.push(todo);

    localStorage.setItem("board",JSON.stringify(board));
}

function deleteTodo(todo){
    const selectedBoard = document.querySelector(".active");

    if(!selectedBoard) return;

    const findBoard = board.find((item) => Number(item.board_id) === Number(selectedBoard.getAttribute("board_id")));
    console.log(findBoard);

    findBoard.todos = findBoard.todos.filter((item) => Number(item.id) !== Number(todo.id)); // 삭제 완료
    localStorage.setItem("board", JSON.stringify(board)); // board update
}
function updateTodos(todo){
    const findTodo = todos.find((todo1)=>Number(todo.id) === Number(todo1.id));

    if(findTodo){
        findTodo.status = todo.status; // 상태값만 변경
        localStorage.setItem("board",JSON.stringify(board));
    }
}

// todos전체 불러오기
function getTodoListAll(){

    todos.sort((a,b) =>{
        return Number(a.order)-Number(b.order);
    })

    todos.forEach((item)=>{
        makeTagTodo(item);
    })
}

function addBoard(item,todos_title,board_id){
    const newBoard = {
        todos : [],
        todos_title,
        board_id:board_id,
    }
    board.push(newBoard);
    localStorage.setItem("board",JSON.stringify(board));
}

function updateBoard(boardId, name){
    const findBoard = board.find((item)=>{return Number(item.board_id)  === Number(boardId)});
    if(findBoard){
        findBoard.todos_title = name;
        localStorage.setItem("board",JSON.stringify(board));
    }
}

//sidebar에서 todo입력창
function makeTodoTagInSideBar(eventLi,todoId){

    const selectedBoard = document.querySelector(".active");
    if(!selectedBoard) return;

    const findBoard = board.find((item) => Number(item.board_id) === Number(selectedBoard.getAttribute("board_id")));
  
    const findTodo = findBoard.todos.find((todo1)=>Number(todoId) === Number(todo1.id));
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

    backButtonTag.src="img/backbutton.png";
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
        localStorage.setItem("board",JSON.stringify(board));
        dateDisplayTag.innerHTML = getTimeFormat(findTodo);
    });

    endDate.type="date";
    endDate.addEventListener("input",(event)=>{
        findTodo.endDate = event.target.value;
        localStorage.setItem("board",JSON.stringify(board));
        dateDisplayTag.innerHTML = getTimeFormat(findTodo);
    })

    inputTag.value = findTodo.content;
    inputTag.classList.add("side_bar_input");
    textareaTag.value = findTodo.contentDetail;
    textareaTag.placeholder="추가내용 입력"
    
    inputTag.addEventListener("input",(event)=>{
        parentLi.querySelector("span").innerHTML = event.target.value;
        findTodo.content = event.target.value;
        localStorage.setItem("board",JSON.stringify(board));

    });

    textareaTag.addEventListener("input",(event)=>{
        findTodo.contentDetail = event.target.value;
        localStorage.setItem("board",JSON.stringify(board));
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

    inputTag.focus();
}

// Todo HTML Tag 생성 및 이벤트
function makeTagTodo(item){
    const newLi = document.createElement("li");
    const newContent = document.createElement("span");
    const deleteButton = document.createElement("input");
    const dDayTag = document.createElement("div");
    
    //newLi.draggable = true;
    newLi.setAttribute("stauts",item.status);
    newLi.setAttribute("id",item.id);
    newContent.innerHTML =  item.content;
    newContent.addEventListener("click",(event)=>{

        event.preventDefault();
        event.stopImmediatePropagation();

        const todoId = event.target.getAttribute("id") === null ? 
                                event.target.parentNode.getAttribute("id") :
                                event.target.getAttribute("id") ; // click된 id

        makeTodoTagInSideBar(event,todoId);
        toggleSidebar();
    })
    newLi.addEventListener("click",(event)=>{
        
        // const todoId = event.target.getAttribute("id") === null ? 
        //                             event.target.parentNode.getAttribute("id") :
        //                             event.target.getAttribute("id") ; // click된 id

        // makeTodoTagInSideBar(event,todoId);
        // toggleSidebar();
    });

    dDayTag.innerHTML = getTimeFormat(item);


    deleteButton.value = "x";
    deleteButton.classList.add("deleteButton");
    deleteButton.type="button"
    deleteButton.addEventListener("click", (event)=>{
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation();
        
        const containerLi= event.target.closest("li");
        console.log(containerLi);
        if(!containerLi) return;

        const delTodo = {id:containerLi.getAttribute("id"),}
        deleteTodo(delTodo);
        containerLi.remove();

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

}

function getTimeFormat(item){
    const startDate =  item?.startDate ?? "";
    const endDate = item?.endDate ?? "";

    if(startDate !== "" && endDate !== "") return startDate + "~" +endDate;
    
    if(startDate === "" && endDate !== ""){ // 끝나는 기간만 입력했을때
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
//검색input 이벤트 설정
document.querySelector("#searchInput").addEventListener("input",searchButton);

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

    const year = nowTime.getFullYear();
    const month = nowTime.getMonth()+1 < 10 ? `0${nowTime.getMonth()+1}` :nowTime.getMonth()+1;
    const day = nowTime.getDate();

    const hour = nowTime.getHours();
    const minutes = nowTime.getMinutes();
    const second = nowTime.getSeconds();
    
    const hourFormat = nowTime.getHours() < 10 ? `0${hour}` :hour;
    const minutesFormat = nowTime.getMinutes() < 10 ? `0${minutes}` :minutes;
    const secondFormat = nowTime.getSeconds() < 10 ? `0${second}` :second;

    timerContainer.innerHTML = year +"-"+month+"-"+day + " " +hourFormat+ ":" +minutesFormat+":"+secondFormat;
}, 1000);


// board 버튼 불러오기
function getBoardButtonList(){

    const container = document.querySelector("#boards");

    board.forEach((item, index) => {
        const isActive = index === 0;
        createBoardButton(item.board_id, item?.todos_title ?? '', isActive, container);
    });

    //만든 input 크기 자동 조절
    const inputs = document.querySelectorAll("#boards .board_input");
    console.log(inputs);
    inputs.forEach((input)=>{
        input.style.width = input.scrollWidth+"px";
    })

}

function initDisplay(){
    todoArea.innerHTML="";
    doingArea.innerHTML = "";
    doneArea.innerHTML = "";
}

function hideTodoBoard(){
    document.getElementById("todo-board").classList.add("hide");
    document.getElementById("emptyMessage").classList.remove("hide");
}
function visibleTodoBoard(){
    document.getElementById("todo-board").classList.remove("hide");
    document.getElementById("emptyMessage").classList.add("hide");
}

function initialize(){

    board = JSON.parse(localStorage.getItem("board")); // 데이터 로딩

    if(!board) { // 기존 데이터가 없다면
        board = [];
        todos = [];
        makeTagBoardButton();
    }else{
        todos = board[0]?.todos ?? [];

        if(board.length === 0)
            hideTodoBoard();
        getTodoListAll(); // todos 전체 데이터 불러오기
        getBoardButtonList();
    }


    //초기 드래그엔드롭 설정
    containers.forEach((container) => {
        new Sortable(container, {
            group: "shared",
            animation: 150,
            ghostClass: "blue-background-class",
            delay: 200, // 터치 후 200ms 후에 드래그 시작
            delayOnTouchOnly: true, 
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

    updateTodoCount();

    //사이드바 이벤트 설정
    overlay.addEventListener("click", toggleSidebar);

    //board 추가하는 작업
    document.querySelector(".add_board_button").addEventListener("click",()=>{
        makeTagBoardButton();
        visibleTodoBoard();
    });
}

// boardButton Tag 생성
function makeTagBoardButton(){
    const boardContainer = document.getElementById("boards");
    const boardId = Date.now();
    const boardName = board.length;
    let isActive = false;

    if(board.length === 0) {
        isActive = true;
    }
    addBoard(todos,boardName,boardId);(todos,boardName,boardId);
    createBoardButton(boardId, boardName, isActive, boardContainer);
}


// 보드 버튼을 생성하는 함수
function createBoardButton(boardId, boardName, isActive, container) {
    const buttonContainer = document.createElement("div");
    const boardInputButton = document.createElement("input");
    const deleteBoardButton = document.createElement("input");

    deleteBoardButton.value = "x";
    deleteBoardButton.type = "button";
    deleteBoardButton.classList.add("deleteBoardButton");
    deleteBoardButton.setAttribute("board_id",boardId);
    deleteBoardButton.addEventListener("click",(event)=>{
       
        const boardId = event.target.getAttribute("board_id");
        board = board.filter((item) => Number(item.board_id) !== Number(boardId));

        const closestDiv = event.target.closest('div') //가장 가까운 div를 찾아서 삭제
        closestDiv.remove();

        localStorage.setItem("board",JSON.stringify(board));

        boardButtonArea.innerHTML=""; //
        initDisplay();
        getBoardButtonList();

        if(board.length === 0){
           hideTodoBoard();
        }
    })

    boardInputButton.setAttribute("board_id", boardId);
    boardInputButton.setAttribute("todos_title", boardName);
    boardInputButton.classList.add("board_input");
    boardInputButton.value = boardName;


    if (isActive) boardInputButton.classList.add("active");

    // 클릭 이벤트
    boardInputButton.addEventListener("click", (event) => {
        const boards = document.querySelector(".active");
        if (boards) boards.classList.remove("active");

        event.target.classList.add("active");
        event.target.type = "text";

        todoArea.innerHTML = "";
        doingArea.innerHTML = "";
        doneArea.innerHTML = "";

        // todo 값 넣기
        const findBoard = board.find((item) => Number(item.board_id) === Number(event.target.getAttribute("board_id")));
        if (findBoard) {
            todos = findBoard.todos;
            getTodoListAll();
        }
    });

    // 입력 이벤트
    boardInputButton.addEventListener("input", (event) => {
        const textWidthSpan = document.getElementById('textWidthSpan');
        textWidthSpan.textContent = event.target.value;
        const textWidth = textWidthSpan.offsetWidth;
        event.target.style.width = `${textWidth}px`;

        const boardId = event.target.getAttribute("board_id");
        if (boardId)
            updateBoard(boardId, event.target.value);
    });

    // 블러 이벤트
    boardInputButton.addEventListener("blur", (event) => {
        event.target.type = "button";
        event.target.style.minWidth = "32px";
    });

    buttonContainer.style.position="relative";

    buttonContainer.appendChild(boardInputButton);
    buttonContainer.appendChild(deleteBoardButton);
    container.appendChild(buttonContainer);

}





