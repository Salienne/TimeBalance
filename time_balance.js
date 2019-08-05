// ==UserScript==
// @name     InsertTimeBalance
// @version  1
// @grant    none
// @include  https://uuos9.plus4u.net/*
// @run-at-document-end
// ==/UserScript==


function isPublicHoliday(date) {
    var currentYear = new Date().getFullYear()
    var PUBLIC_HOLIDAYS = [
      new Date(currentYear, 0, 1).getTime(), 
      new Date(currentYear, 4, 1).getTime(), 
      new Date(currentYear, 4, 8).getTime(), 
      new Date(currentYear, 6, 5).getTime(), 
      new Date(currentYear, 6, 7).getTime(), 
      new Date(currentYear, 8, 28).getTime(), 
      new Date(currentYear, 9, 28).getTime(), 
      new Date(currentYear, 10, 17).getTime(), 
      new Date(currentYear, 11, 24).getTime(), 
      new Date(currentYear, 11, 25).getTime(), 
      new Date(currentYear, 11, 26).getTime(),
      // Velikonoce
      new Date(2020, 3, 10).getTime(), 
      new Date(2020, 3, 13).getTime(), 
      new Date(2021, 3, 2).getTime(), 
      new Date(2021, 3, 5).getTime(),
      new Date(2022, 3, 15).getTime(), 
      new Date(2022, 3, 18).getTime()
    ]
    return PUBLIC_HOLIDAYS.includes(date.getTime())
  }

  var MONTH_MAP = {
      "Leden": 0,
      "Únor": 1,
      "Březen": 2,
      "Duben": 3,
      "Květen": 4,
      "Červen": 5,
      "Červenec": 6,
      "Srpen": 7,
      "Září": 8,
      "Říjen": 9,
      "Listopad": 10,
      "Prosinec": 11,
      "January": 0,
      "February": 1,
      "March": 2,
      "April": 3,
      "May": 4,
      "June": 5,
      "July": 6,
      "August": 7,
      "September": 8,
      "October": 9,
      "November": 10,
      "December": 11
  }
  
  function daysInMonth(iYear, iMonth) {
    console.log("year: " + iYear)
    console.log("month: " + iMonth)
    return 32 - new Date(iYear, iMonth, 32).getDate()
  }
  
  function isWeekday(date) {
    var day = date.getDay()
    return day !=0 && day !=6 && !isPublicHoliday(date)
  }
  
  function getWeekdaysInMonth(year, month) {
    var days = daysInMonth(year, month)
    var weekdays = 0
    for(var i = 0; i < days; i++) {
      if (isWeekday(new Date(year, month, i+1))) {
        weekdays++
      }
    }
    return weekdays;
  }
  
  function getWeekdaysInMonthTillDay(year, month, day) {
    console.log("[getWeekdaysInMonthTillDay] year: " + year)
    console.log("[getWeekdaysInMonthTillDay] month: " + month)
    console.log("[getWeekdaysInMonthTillDay] day: " + day)
    var weekdays = 0
    for(var i = 0; i < day; i++) {
      if (isWeekday(new Date(year, month, i+1))) {
        weekdays++
      }
    }
    if (month === 6 && year === 2019) {
      weekdays -= 2
    }
    // if (isWeekday(new Date())) {
    //   return weekdays - 1;
    // } else {
    //   return weekdays;
    // }
    return weekdays
  }
  
/*   function recalculate(val) {
    var currentDate = new Date()
    var workDaysPassed = getWeekdaysInMonthTillDay(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    var balance = -1 * ((workDaysPassed * 8) - val)
    var divBalance = document.getElementById("div-work-hour-balance")
    divBalance.innerHTML = balance
    if (balance > 0) {
      divBalance.style.color="green"
    } else {
      divBalance.style.color="red"
    }
  } */
  
  function clear(elem) {
    elem.value = "";
  }
  
  function clearInput() {
    document.getElementsByTagName("input").value = ""
  }

  function getWorkHoursForCurrentMonth() {
    console.log("getting work hours for current month")
    var currentDate = new Date()
    var currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    var workDaysPassed = getWeekdaysInMonthTillDay(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    var reportedDays = Array.from(
        document.getElementsByClassName("uu5-bricks-text uu5-common-text uu-specialistwtm-worker-monthly-detail-grid-panel-day-date uu5-bricks-text-nesting-level-small-box")
    )
        .map(e => e.innerHTML.trim())
        .map(s => {
            var regex = /.*;(\d+\.\d+\.\d+)/g
            var match = regex.exec(s.trim())
            var dateArr = match[1].split(".")
            return new Date(
                dateArr[2], 
                parseInt(dateArr[1]) - 1, 
                dateArr[0]
            )
        })
    		.map(d => d.getTime())
        .sort()
    var lastDate = reportedDays[reportedDays.length - 1]
    console.log("unmodified workDays: " + workDaysPassed)
    console.log("reported days: " + reportedDays)
    console.log("lastDate: " + lastDate)
    console.log("currentDate: " + currentDay)
    console.log("currentDay === lastDate: " + (currentDay.getTime() === lastDate))
    if (
      !(lastDate === currentDay.getTime()) && isWeekday(currentDay)
    ) {
      	console.log("modifiyng workDays")
        workDaysPassed = workDaysPassed - 1
    }
    console.log("final workDays: " + workDaysPassed)
    return workDaysPassed
  }
  
  function getWorkHoursForSelectedMonth() {
    console.log("getting work hours for other month")
    var reportedDays = Array.from(
        document.getElementsByClassName("uu5-bricks-text uu5-common-text uu-specialistwtm-worker-monthly-detail-grid-panel-day-date uu5-bricks-text-nesting-level-small-box")
    )
        .map(e => e.innerHTML.trim())
        .map(s => {
            var regex = /.*;(\d+\.\d+\.\d+)/g
            var match = regex.exec(s.trim())
            var dateArr = match[1].split(".")
            return new Date(
                dateArr[2], 
                parseInt(dateArr[1]) - 1, 
                dateArr[0]
            )
        })
        .sort()
    var lastDate = reportedDays[0]
    var lastDayOfSelectedMonth = new Date(
        new Date(
            lastDate.getFullYear(), lastDate.getMonth() + 1, 1
        ).getTime() - 3600000
    )
    var workDaysPassed = getWeekdaysInMonthTillDay(
        lastDayOfSelectedMonth.getFullYear(), 
        lastDayOfSelectedMonth.getMonth(), 
        lastDayOfSelectedMonth.getDate()
    )
    return workDaysPassed
  }

  function allThatJazz() {
    var currDate = new Date()
    var selectedMonthArr = document.getElementsByClassName("uu5-bricks-text uu5-common-text uu-specialistwtm-worker-monthly-detail-top-month-dropdown-value uu5-bricks-text-nesting-level-inline")[0]
        .innerHTML.split(" ")
    var selectedMonth = new Date(selectedMonthArr[1], MONTH_MAP[selectedMonthArr[0]], 1)
    var currentMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1)
    var workDaysPassed = 0
    if (selectedMonth.getTime() === currentMonth.getTime()) {
        workDaysPassed = getWorkHoursForCurrentMonth()
    } else {
        workDaysPassed = getWorkHoursForSelectedMonth()
    }

    var totalTimeElem = document.getElementsByClassName("uu5-bricks-span uu-specialistwtm-worker-monthly-detail-top-total-time")[0] 
    var totalTimeStr = totalTimeElem.innerHTML
    var m = totalTimeStr.match(/^(\d+)h (\d+)m$/)
    var minutes = (parseInt(m[1]) * 60 + parseInt(m[2])) / 60
    
    var workHoursBalanceSpan = document.createElement("span")
    var labelSpan = document.createElement("span")
    labelSpan.classList = "uu5-bricks-span uu5-bricks-lsi-item uu5-bricks-lsi uu-specialistwtm-worker-monthly-detail-top-total-time-label"
    labelSpan.id = "blablabla-inner-inner"
    labelSpan.innerHTML = "ČASOVÁ BILANCE:"
    var timeBalance = minutes - (workDaysPassed * 8)
    
    var absBalance = Math.abs(timeBalance)
    var formattedBalance = Math.floor(absBalance) + "h " + ((absBalance % 1) * 60) + "m"
    
    workHoursBalanceSpan.classList = totalTimeElem.classList
    if (timeBalance >= 0) {
        workHoursBalanceSpan.innerHTML = formattedBalance
        workHoursBalanceSpan.style = "color: #4caf50"
    } else {
        workHoursBalanceSpan.innerHTML = "- " + formattedBalance
        workHoursBalanceSpan.style = "color: red"
    }
    
    document.getElementsByClassName("uu5-common-div uu-specialistwtm-worker-monthly-detail-top-time-column")[0].appendChild(
      labelSpan
    )
    document.getElementsByClassName("uu5-common-div uu-specialistwtm-worker-monthly-detail-top-time-column")[0].appendChild(
      workHoursBalanceSpan
    )
  }

//   function registerSelectedMonthReader() {
//     console.log("registering listener")
//     var monthOptions = document.getElementsByClassName("color-schema-custom uu5-bricks-link uu5-bricks-dropdown-item-link")
//     if (!monthOptions || monthOptions.length < 1) {
//         console.error("didn't find the month selector")
//         return
//     }
//     console.log("months len: " + monthOptions.length)

//     var monthSelectionHandler = function (event) {
//         console.log("type: " + typeof event.srcElement)
//         var selectedMonthElement = event.srcElement
//         console.log(selectedMonthElement.innerHTML)
//     }

//     Array.of(monthOptions).forEach(
//         m => m.addEventListener("click", monthSelectionHandler)
//     )
//   }

  function callIfReady(started) {
    var totalTimeElems = document.getElementsByClassName("uu5-bricks-span uu-specialistwtm-worker-monthly-detail-top-total-time")
    if (totalTimeElems.length === 0) {
        if (new Date().getTime() < (started + 300000)) {
            console.log("jeste nic... ")
            setTimeout(callIfReady, 2000, started)
        } else {
            console.error("...tak to se uz nedockame :-(")
        }
    } else {
        // registerSelectedMonthReader()
        allThatJazz()
    }
  }



/*=========================
 * 
 * MAIN
 *
 ========================*/
  var start = new Date().getTime()
  setTimeout(callIfReady, 1000, start)
