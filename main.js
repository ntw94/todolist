// 1. 투두리스트 디자인
// 2. 추가 하기


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
           
            console.log(evt.target.getAttribute("status"));
            console.log(droppedColumn.getAttribute("status"));
            droppedElement.setAttribute("status",droppedColumn.getAttribute("status"));
            
            //evt.item.textContent = droppedElement.textContent.split(" ")[0] +" " + droppedColumn.getAttribute("status");
            // 업데이트

        }
    });
});
  
document.getElementById("todoAddButton").addEventListener("click",()=>{
    const todoValue = document.getElementById("todoInput");
    const status = document.getElementById("status");
    const statusValue = status.options[status.selectedIndex].value;

    if(!todoValue.value){ return;}

    const newLi = document.createElement("li");
    const newContent = document.createElement("span");
    const deleteButton = document.createElement("button");
    
    newLi.draggable = true;
    newLi.setAttribute("stauts",statusValue);
    newLi.setAttribute("id",Date.now());
  

    newContent.innerHTML = todoValue.value;
    
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


