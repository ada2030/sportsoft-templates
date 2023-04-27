todoMain();

function todoMain() {
  const DEFAULT_OPTION = "Выберите категорию";
  
  let inputElem,
    inputElem2,
    dateStartInput,
    dateEndInput,
    addButton,
    selectElem,
    todoList = [],
    calendar,
    calendarForm,
    formClose;
  
  getElements();
  addListeners();
  initCalendar();
  load();
  renderRows();
  updateSelectOptions();
  
  function getElements() {
    inputElem = document.getElementsByTagName("input")[0];
    inputElem2 = document.getElementsByTagName("input")[1];
    dateStartInput = document.getElementById("dateStartInput");
    dateEndInput = document.getElementById("dateEndInput");
    addButton = document.getElementById("addBtn");
    selectElem = document.getElementById("categoryFilter");
    calendarForm = document.getElementById("form");
    formClose = document.getElementById("form-close");
  }
  
  function addListeners() {
    addButton.addEventListener("click", addEntry, false);
    selectElem.addEventListener("change", filterEntries, false);
  }
  
  function addEntry(event) {
    event.preventDefault();
    
    let inputValue = inputElem.value;
    inputElem.value = "";
    
    let inputValue2 = inputElem2.value;
    inputElem2.value = "";
    
    let dateStartValue = dateStartInput.value;
    dateStartInput.value = "";
  
    let dateEndValue = dateEndInput.value;
    dateEndInput.value = "";

    let color;

    if (inputValue2 === 'Поле 1') {
      color = "#000000";
    } else if (inputValue2 === 'Поле 2') {
      color = "#ff0000";
    }
    
    let obj = {
      id: _uuid(),
      todo: inputValue,
      category: inputValue2,
      dateStart: dateStartValue,
      dateEnd: dateEndValue,
      color: color,
      done: false,
    };
    
    rendowRow(obj);
    
    todoList.push(obj);
    
    save();
    
    updateSelectOptions();
    
    
    
  }
  
  function filterEntries() {
    let selection = selectElem.value;
    
    let trElems = document.getElementsByTagName("tr");
    for(let i = trElems.length - 1; i > 0; i--){
      trElems[i].remove();
    }
  
    calendar.getEvents().forEach(event=>event.remove());
    
    if (selection == DEFAULT_OPTION) {
      todoList.forEach( obj => rendowRow(obj) );
    } else {
      todoList.forEach( obj => {
        if( obj.category == selection ){
          rendowRow(obj);
        }
      });
    }
  }
  
  function updateSelectOptions() {
    let options = [];
    
    todoList.forEach((obj)=>{
      options.push(obj.category);
    });
    
    let optionsSet = new Set(options);
    
    selectElem.innerHTML = "";
    
    let newOptionElem = document.createElement('option');
    newOptionElem.value = DEFAULT_OPTION;
    newOptionElem.innerText = DEFAULT_OPTION;
    selectElem.appendChild(newOptionElem);
    
    for (let option of optionsSet) {
      let newOptionElem = document.createElement('option');
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      selectElem.appendChild(newOptionElem);
    }
    
    
  }
  
  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);
  }
  
  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    if (todoList == null)
      todoList = [];
  }
  
  function renderRows() {
    todoList.forEach(todoObj => {
      rendowRow(todoObj);
    })
  }
  
  function rendowRow({ todo: inputValue, category: inputValue2, id, dateStart, dateEnd, color, done }) {
    
    let table = document.getElementById("todoTable");
    
    let trElem = document.createElement("tr");
    table.appendChild(trElem);
    
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.addEventListener("click", checkboxClickCallback, false);
    checkboxElem.dataset.id = id;
    let tdElem1 = document.createElement("td");
    tdElem1.appendChild(checkboxElem);
    trElem.appendChild(tdElem1);
    
    let dateElem = document.createElement("td");
    let dateObj = new Date(dateStart);
    let formattedDate = dateObj.toLocaleString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    
    dateElem.innerText = formattedDate;
    trElem.appendChild(dateElem);
    
    let tdElem2 = document.createElement("td");
    tdElem2.innerText = inputValue;
    trElem.appendChild(tdElem2);
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = inputValue2;
    tdElem3.className = "categoryCell";
    trElem.appendChild(tdElem3);
    
    let spanElem = document.createElement("span");
    spanElem.innerText = "удалить";
    spanElem.className = "material-icons";
    spanElem.addEventListener("click", deleteItem, false);
    spanElem.dataset.id = id;
    let tdElem4 = document.createElement("td");
    tdElem4.appendChild(spanElem);
    trElem.appendChild(tdElem4);
    
    checkboxElem.type = "checkbox";
    checkboxElem.checked = done;
    if (done) {
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }
    
    addEvent({
      id: id,
      title: inputValue,
      start: new Date(dateStart),
      end: new Date(dateEnd),
      color: color
    });
    
    function deleteItem() {
      trElem.remove();
      updateSelectOptions();
      
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id)
          todoList.splice(i, 1);
      }
      save();
  
      calendar.getEventById(this.dataset.id).remove();
    }
    
    function checkboxClickCallback() {
      trElem.classList.toggle("strike");
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id)
          todoList[i]["done"] = this.checked;
      }
      save();
    }
  }
  
  function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  
  function initCalendar() {
    var calendarEl = document.getElementById('calendar');
  
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      initialDate: moment().format("YYYY-MM-DD"),
      validRange: {
        start: moment().format("YYYY-MM-DD")
      },
      aspectRatio: 3,
      customButtons: {
        myCustomButton: {
          text: 'Свободные часы',
          click: function() {
            calendarEl.classList.toggle("calendar-free");
          }
        }
      },
      headerToolbar: {
        left: 'prevYear,prev,next,nextYear today myCustomButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      footerToolbar: {
        left: 'prevYear,prev,next,nextYear today myCustomButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      titleFormat: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      themeSystem: 'bootstrap4',
      stickyHeaderDates: true,
      stickyFooterScrollbar: true,
      slotEventOverlap: false,
      allDaySlot: false,
      scrollTime: '07:00:00',
      navLinks: true,
      weekNumbers: true,
      weekText: "Week",
      weekNumberFormat: {
        week: 'short'
      },
      selectable: true,
      selectMirror: true,
      dateClick: function(info) {
        calendarForm.style.display="block";
        formClose.addEventListener('click', function (event) {
          event.preventDefault();
          calendarForm.style.display="none";
        })
      },
      select: function(info) {
        calendarForm.style.display="block";
        dateStartInput.value=new Date(info.startStr).toISOString().slice(0, -8);
        dateEndInput.value=new Date(info.endStr).toISOString().slice(0, -8);
        formClose.addEventListener('click', function (event) {
          event.preventDefault();
          calendarForm.style.display="none";
        })
      },
      events: [],
      locale: 'ru',
      eventClick: function(info) {
        alert('Название события: ' + info.event.title+';');
        alert('Так же при клике можно вывести модальное окно c данными события');
      }
    });
  
    calendar.render();
  }
  
  function addEvent(event) {
    calendar.addEvent(event)
    calendarForm.style.display="none";
  }
}
