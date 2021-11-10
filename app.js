function solve() {
    const myForm = document.getElementById("myForm");
    const csvFile = document.getElementById("csvFile");
    const timeUnitsButton = document.getElementById('timeUnitsButton')
    myForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = csvFile.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            const data = csvToArray(text);
            localStorage.setItem('data', JSON.stringify(data));
        };
        reader.readAsText(input);
        timeUnitsButton.addEventListener('click', (e) => {
            e.preventDefault();
            const data = localStorage.getItem('data')
            const parsedData = JSON.parse(data);

            const weekButton = document.getElementById('chooseWeekButton')
            const monthButton = document.getElementById('chooseMonthButton')
            const dayButton = document.getElementById('chooseDayButton')
            const chooseColorButton = document.getElementById('chooseColorButton');


            let unit = document.getElementById('timeLineUnits');
            var value = unit.options[unit.selectedIndex].value;
            let finishedTasks = 0;
            let startedTasks = 0;

            if (value == 'month') {
                let workMonts = document.getElementById('workMonhts');
                workMonts.style.display = 'block';
                document.getElementById('workWeeks').style.display = 'none';
                document.getElementById('workDays').style.display = 'none';
                monthButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    let month = document.getElementById('workMonthValue').value;
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    let currentMonth = months[month - 1];
                    parsedData.forEach(element => {
                        let elementEndDate = element[Object.keys(element)[Object.keys(element).length - 1]]
                        let elementStartDate = element['Start Date'];

                        let elementEndDateToDate = elementEndDate?.length == 20 ? new Date(elementEndDate) : undefined;
                        let elementStartDateToDate = elementStartDate?.length == 19 ? new Date(elementStartDate) : undefined;

                        if (elementStartDateToDate?.getDay() === 6) {
                            elementStartDateToDate.setDate(elementStartDateToDate.getDate() + 2);
                        }
                        if (elementStartDateToDate?.getDay() === 0) {
                            elementStartDateToDate.setDate(elementStartDateToDate.getDate() + 1);
                        }
                        if (elementEndDateToDate?.getDay() === 6) {
                            elementEndDateToDate.setDate(elementEndDateToDate.getDate() - 1);
                        }
                        if (elementEndDateToDate?.getDay() === 0) {
                            elementEndDateToDate.setDate(elementEndDateToDate.getDate() - 2);
                        }

                        if (elementEndDateToDate?.getMonth() == month) {
                            finishedTasks++;
                        }
                        if (elementStartDateToDate?.getMonth() == month) {
                            startedTasks++;
                        }
                    })
                    createDomElement(startedTasks, finishedTasks, currentMonth)
                    finishedTasks = 0;
                    startedTasks = 0;
                })
            } if (value == 'week') {
                let workWeeks = document.getElementById('workWeeks');
                workWeeks.style.display = 'block';
                document.getElementById('workMonhts').style.display = 'none';
                document.getElementById('workDays').style.display = 'none';

                weekButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    let startOfWeek = document.getElementById('startOfWeek').value;
                    parsedData.forEach(element => {
                        let elementEndDate = element[Object.keys(element)[Object.keys(element).length - 1]]?.split(' ')[0];
                        let elementStartDate = element['Start Date']?.split(' ')[0];

                        let startOfWeekInputToDate = new Date(startOfWeek);

                        let elementEndDateToDate = elementEndDate?.length == 10 ? new Date(elementEndDate) : undefined;
                        let elementStartDateToDate = elementStartDate?.length == 10 ? new Date(elementStartDate) : undefined;

                        if (startOfWeekInputToDate.getTime() == elementStartDateToDate?.getTime()) {
                            startedTasks++;
                        }
                        if (startOfWeekInputToDate.getTime() == elementEndDateToDate?.getTime()) {
                            finishedTasks++;
                        }

                        for (let index = 0; index <= 4; index++) {
                            if (startOfWeekInputToDate.setDate(startOfWeekInputToDate.getDate() + index) == elementStartDateToDate?.getTime()) {
                                startedTasks++;
                            }
                            if (startOfWeekInputToDate.setDate(startOfWeekInputToDate.getDate() + index) == elementEndDateToDate?.getTime()) {
                                finishedTasks++;
                            }
                        }
                    });
                    createDomElement(startedTasks, finishedTasks, startOfWeek)
                    finishedTasks = 0;
                    startedTasks = 0;
                })
            } if (value == 'day') {
                let workDays = document.getElementById('workDays');
                workDays.style.display = 'block';
                document.getElementById('workMonhts').style.display = 'none';
                document.getElementById('workWeeks').style.display = 'none';

                dayButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    let startDay = document.getElementById('fromDay').value;
                    let endDay = document.getElementById('toDay').value;
                    let startOfPeriod = new Date(startDay);
                    let endOfPeriod = new Date(endDay);
                    const diffTime = Math.abs(startOfPeriod - endOfPeriod);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    parsedData.forEach(element => {
                        let elementEndDate = element[Object.keys(element)[Object.keys(element).length - 1]]?.split(' ')[0];
                        let elementStartDate = element['Start Date']?.split(' ')[0];

                        let elementEndDateToDate = elementEndDate?.length == 10 ? new Date(elementEndDate) : undefined;
                        let elementStartDateToDate = elementStartDate?.length == 10 ? new Date(elementStartDate) : undefined;


                        if (startOfPeriod.getTime() == elementStartDateToDate?.getTime()) {
                            startedTasks++;
                        }
                        if (startOfPeriod.getTime() == elementEndDateToDate?.getTime()) {
                            finishedTasks++;
                        }
                        for (let index = 0; index <= diffDays; index++) {
                            if (startOfPeriod.setDate(startOfPeriod.getDate() + index) == elementStartDateToDate?.getTime()) {
                                startedTasks++;
                            }
                            if (startOfPeriod.setDate(startOfPeriod.getDate() + index) == elementEndDateToDate?.getTime()) {
                                finishedTasks++;
                            }
                        }
                    });
                    createDomElement(startedTasks, finishedTasks, startDay, endDay)
                    finishedTasks = 0;
                    startedTasks = 0;
                })
            }
        })
        chooseColorButton.addEventListener('click', (e) => {
            e.preventDefault();
            let finishedValue = document.getElementById('finishedColor').value;
            let inProgressColorValue = document.getElementById('inProgressColor').value;

            let finishedBar = document.querySelectorAll('td')[0];
            finishedBar.style.backgroundColor = finishedValue;

            let inProgressBar = document.querySelectorAll('td')[1];
            inProgressBar.style.backgroundColor = inProgressColorValue;


            let finishedTitle = document.querySelectorAll('th')[0];
            finishedTitle.style.color = finishedValue;

            let inProgressTitle = document.querySelectorAll('th')[1];
            inProgressTitle.style.color = inProgressColorValue;
        })
    });


    function csvToArray(str, delimiter = ",") {
        const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");
        const arr = rows.map(function (row) {
            const values = row.split(delimiter);
            const el = headers.reduce(function (object, header, index) {
                object[header] = values[index];
                return object;
            }, {});
            return el;
        });
        return arr;
    }

    function createDomElement(startedTasks, finishedTasks, start, end) {
        document.getElementById('tableBody').innerHTML = '';

        let tableBody = document.getElementById('tableBody');

        let tr = document.createElement('tr');
        tr.classList.add('qtr');
        tr.setAttribute('id', 1);

        let th = document.createElement('th');
        th.textContent = `From ${start}${end == undefined ? '' : ` to ${end}`}`

        let startedTasksTd = document.createElement('td');
        startedTasksTd.classList.add('sent', 'bar');
        startedTasksTd.style.marginBottom = `10px`;
        startedTasksTd.innerHTML = `<p>${startedTasks}</p>`

        let finishedTasksTd = document.createElement('td');
        finishedTasksTd.style.marginBottom = `10px`;
        finishedTasksTd.classList.add('paid', 'bar');
        finishedTasksTd.innerHTML = `<p>${finishedTasks}</p>`

        if (startedTasks > finishedTasks) {
            startedTasksTd.style.height = `111px`;

            finishedTasksTd.style.height = `90px`;
        }
        if (startedTasks < finishedTasks) {
            startedTasksTd.style.height = `90px`;

            finishedTasksTd.style.height = `120px`;
        }
        if (startedTasks == finishedTasks) {
            startedTasksTd.style.height = `111px`;

            finishedTasksTd.style.height = `111px`;
        }
        tr.appendChild(th);
        tr.appendChild(startedTasksTd);
        tr.appendChild(finishedTasksTd);

        tableBody.appendChild(tr);
    }
}