todoMain();

function todoMain() {
  const DEFAULT_OPTION = "Выберите категорию";
  const holidays = [moment('2023-05-04','YYYY-MM-DD'), moment('2023-04-05','YYYY-MM-DD'), moment('2023-05-07','YYYY-MM-DD')];
  
  let eventName,
    eventCategory,
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
    eventName = document.getElementById("eventName");
    eventCategory = document.getElementById("eventCategory");
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
    
    let eventNameValue = eventName.value;
    eventName.value = "";
    
    let categoryValue = eventCategory.value;
    eventCategory.value = "";
    
    let dateStartValue = dateStartInput.value;
    dateStartInput.value = "";
  
    let dateEndValue = dateEndInput.value;
    dateEndInput.value = "";

    let color;

    if (categoryValue === 'Поле 1') {
      color = "#000000";
    } else if (categoryValue === 'Поле 2') {
      color = "#ff0000";
    }
    
    let obj = {
      id: _uuid(),
      todo: eventNameValue,
      category: categoryValue,
      dateStart: dateStartValue,
      dateEnd: dateEndValue,
      color: color
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
  
  function rendowRow({todo: eventNameValue, category: categoryValue, id, dateStart, dateEnd, color}) {
    
    let table = document.getElementById("todoTable");
    
    let trElem = document.createElement("tr");
    table.appendChild(trElem);
    
    let dateElem = document.createElement("td");
    let dateObj = new Date(dateStart);
    dateElem.innerText = dateObj.toLocaleString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    trElem.appendChild(dateElem);
    
    let tdElem2 = document.createElement("td");
    tdElem2.innerText = eventNameValue;
    trElem.appendChild(tdElem2);
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = categoryValue;
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
    
    addEvent({
      id: id,
      title: eventNameValue,
      start: new Date(dateStart),
      end: new Date(dateEnd),
      color: color
    });
    
    function deleteItem() {
      trElem.remove();
      updateSelectOptions();
      
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id === this.dataset.id)
          todoList.splice(i, 1);
      }
      save();
  
      calendar.getEventById(this.dataset.id).remove();
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
      select: function(info) {
        for(let i = 0; i < holidays.length; i++) {
          if (holidays[i]._d.getFullYear()+'-'+(holidays[i]._d.getMonth()+1)+'-'+holidays[i]._d.getDate() === info.start.getFullYear()+'-'+(info.start.getMonth()+1)+'-'+info.start.getDate()) {
            alert('Не рабочий день');
            return;
          }
          calendarForm.style.display = "flex";
          dateStartInput.value = new Date(info.startStr).toISOString().slice(0, -8);
          dateEndInput.value = new Date(info.endStr).toISOString().slice(0, -8);
          formClose.addEventListener('click', function (event) {
            event.preventDefault();
            calendarForm.style.display="none";
          })
        }
      },
      timeZone: 'UTC',
      events: [],
      locale: 'ru',
      eventClick: function(info) {
        alert('Название события: ' + info.event.title+';');
        alert('Так же при клике можно вывести модальное окно c данными события');
      },
      datesSet: function (view) {
        let holidayMoment;
        for(let i = 0; i < holidays.length; i++) {
          holidayMoment = holidays[i];
          if (view.view.type === 'timeGridDay') {
            if (holidayMoment._d.getFullYear()+'-'+(holidayMoment._d.getMonth()+1)+'-'+holidayMoment._d.getDate() === view.start.getFullYear()+'-'+(view.start.getMonth()+1)+'-'+view.start.getDate()) {
              $("td.fc-timegrid-slot-lane").addClass('holiday');
            } else {
              $("td.fc-timegrid-slot-lane").removeClass('holiday');
            }
          } else {
            $("td[data-date=" + holidayMoment.format('YYYY-MM-DD') + "]").addClass('holiday');
          }
        }
      }
    });
  
    calendar.render();
  }
  
  function addEvent(event) {
    calendar.addEvent(event)
    calendarForm.style.display="none";
  }
}
