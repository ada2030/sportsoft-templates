bookMain();

function bookMain() {
  const CLIENT =  {
    id:  _uuid(),
    name: "Имя клиента 1"
  }
  const CLIENTS =  [{
    id:  _uuid(),
    name: "Имя клиента 1"
  },
  {
    id:  _uuid(),
    name: "Имя клиента 1"
  }]
  const COST = 1500;
  const REFEREE = "Имя Судьи";
  const holidays = [moment('2023-05-04','YYYY-MM-DD'), moment('2023-04-05','YYYY-MM-DD'), moment('2023-05-07','YYYY-MM-DD'), moment('2023-05-11','YYYY-MM-DD')];

  let placeName,
      fieldName,
      dateStartInput,
      dateEndInput,
      bookType,
      amountPaid,
      addButton,
      bookList = [],
      calendar,
      calendarForm,
      formClose;
  
  getElements();
  addListeners();
  initCalendar();
  load();
  renderRows();
  
  function getElements() {
    placeName = document.getElementById("placeName");
    fieldName = document.getElementById("fieldName");
    dateStartInput = document.getElementById("dateStartInput");
    dateEndInput = document.getElementById("dateEndInput");
    bookType = document.getElementById("bookType");
    addButton = document.getElementById("addBtn");
    calendarForm = document.getElementById("form");
    formClose = document.getElementById("form-close");
    amountPaid = document.getElementById("amountPaid");
  }
  
  function addListeners() {
    addButton.addEventListener("click", addEntry, false);
  }
  
  function addEntry(event) {
    event.preventDefault();
    
    let placeNameValue = placeName.value;
    placeName.value = "";
    
    let fieldNameValue = fieldName.value;
    fieldName.value = "";
    
    let dateStartValue = dateStartInput.value;
    dateStartInput.value = "";
  
    let dateEndValue = dateEndInput.value;
    dateEndInput.value = "";

    let bookTypeValue = bookType.value;
    bookType.value = "";

    console.log(amountPaid.value);

    let amountPaidValue = amountPaid.value;
    amountPaid.value = "";

    let color;

    if (fieldNameValue === 'Поле 1') {
      color = "#000000";
    } else if (fieldNameValue === 'Поле 2') {
      color = "#ff0000";
    } else if (fieldNameValue === '1/2 Поля 1') {
      color = "#6ca992";
    } else if (fieldNameValue === '1/2 Поля 2') {
      color = "#c39797";
    }
    
    let obj = {
      id: _uuid(),
      place: placeNameValue,
      field: fieldNameValue,
      dateStart: dateStartValue,
      dateEnd: dateEndValue,
      client: (bookTypeValue === "Чемпионат") ? CLIENTS.map(elem => elem.name).join(",") : CLIENT.name,
      amountPaid: amountPaidValue,
      bookType: bookTypeValue,
      referee: (bookTypeValue === "Чемпионат") ? REFEREE : 'Нет судьи',
      color: color
    };
    
    renderRow(obj);
    
    bookList.push(obj);
    
    save();
  }
  
  function save() {
    let stringified = JSON.stringify(bookList);
    localStorage.setItem("bookList", stringified);
  }
  
  function load() {
    let retrieved = localStorage.getItem("bookList");
    bookList = JSON.parse(retrieved);
    if (bookList == null)
      bookList = [];
  }
  
  function renderRows() {
    bookList.forEach(bookItem => {
      renderRow(bookItem);
    })
  }
  
  function renderRow(obj) {

    let table = document.getElementById("bookTable");

    let trElem = document.createElement("tr");
    table.appendChild(trElem);

    let dateElem = document.createElement("td");
    let dateObj = new Date(obj.dateStart);
    dateElem.innerText = dateObj.toLocaleString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    trElem.appendChild(dateElem);
    let tdElem1 = document.createElement("td");
    tdElem1.innerText = obj.client;
    trElem.appendChild(tdElem1);
    let tdElem2 = document.createElement("td");
    tdElem2.innerText = obj.place;
    trElem.appendChild(tdElem2);
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = obj.field;
    tdElem3.className = "categoryCell";
    trElem.appendChild(tdElem3);

    let spanElem = document.createElement("span");
    spanElem.innerText = "удалить";
    spanElem.className = "material-icons";
    spanElem.addEventListener("click", deleteItem, false);
    spanElem.dataset.id = obj.id;
    let tdElem4 = document.createElement("td");
    tdElem4.appendChild(spanElem);
    trElem.appendChild(tdElem4);

    addEvent({
      id: obj.id,
      title: obj.client,
      start: new Date(obj.dateStart),
      end: new Date(obj.dateEnd),
      color: obj.color,
      extendedProps: {
        bookType: obj.bookType,
        place: obj.place,
        field: obj.field,
        referee: obj.referee,
        amountPaid: obj.amountPaid
      }
    });
    
    function deleteItem() {
      trElem.remove();
      
      for (let i = 0; i < bookList.length; i++) {
        if (bookList[i].id === this.dataset.id)
          bookList.splice(i, 1);
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
        calendarFree: {
          text: 'Свободные часы',
          click: function() {
            calendarEl.classList.toggle("calendar-free");
            calendar.setOption('eventsColor', '#378006');
          }
        },
        changeInterval: {
          text: 'Изменить интервал',
          click: function() {
            if (calendar.getOption('slotDuration') === '01:00:00') {
              calendar.setOption('slotDuration', '00:10:00');
            } else {
              calendar.setOption('slotDuration', '01:00:00');
            }
          }
        }
      },
      headerToolbar: {
        left: 'prevYear,prev,next,nextYear today calendarFree changeInterval',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      footerToolbar: {
        left: 'prevYear,prev,next,nextYear today calendarFree changeInterval',
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
          } else {
            initForm(info)
          }
        }
      },
      timeZone: 'UTC',
      events: [],
      locale: 'ru',
      slotDuration: '01:00:00',
      eventClick: function(info) {
        console.log(info.event);
        alert('Тип: ' + info.event.extendedProps.bookType+'; Клиент: ' + info.event.title+'; Судья: ' + info.event.extendedProps.referee+'; Сумма к оплате: ' + info.event.extendedProps.amountPaid+'; Оплачено: ' + info.event.extendedProps.amountPaid+'; Ссылка на карточку заказа: тут будет ссылка;');
        alert('Так же при клике можно вывести модальное окно c данными события');
      },
      datesSet: function (view) {
        let holidayMoment;
        for(let i = 0; i < holidays.length; i++) {
          holidayMoment = holidays[i];
          if (view.view.type === 'timeGridDay') {
            if (holidayMoment._d.getFullYear()+'-'+(holidayMoment._d.getMonth()+1)+'-'+holidayMoment._d.getDate() === view.start.getFullYear()+'-'+(view.start.getMonth()+1)+'-'+view.start.getDate()) {
              $("td.fc-timegrid-slot-lane").addClass('holiday');
              return;
            } else {
              $("td.fc-timegrid-slot-lane").removeClass('holiday');
            }
          } else {
            $("td.fc-timegrid-slot-lane").removeClass('holiday');
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

  function initForm (info) {
    calendarForm.style.display = "flex";
    dateStartInput.value = new Date(info.startStr).toISOString().slice(0, -8);
    dateEndInput.value = new Date(info.endStr).toISOString().slice(0, -8);
    let start = Date.parse(dateStartInput.value);
    let end = Date.parse(dateEndInput.value);
    let totalHours = NaN;
    if (start < end) {
      totalHours = Math.floor((end - start) / 1000 / 60 / 60);
    }

    amountPaid.value = totalHours * COST;

    formClose.addEventListener('click', function (event) {
      event.preventDefault();
      calendarForm.style.display="none";
    })
  }
}
