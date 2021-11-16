function solve() {
    const myForm = document.getElementById("myForm");
    const csvFile = document.getElementById("csvFile");
    const timeUnitsButton = document.getElementById('timeUnitsButton')
    const chooseColorButton = document.getElementById('chooseColorButton');
    let allTasks = [];
    timeUnitsButton.addEventListener('click', mainAppController);
    chooseColorButton.addEventListener('click', colorHandler)

    myForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert('File uploaded')
        const input = csvFile.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            const data = csvToArray(text);
            localStorage.setItem('data', JSON.stringify(data));

            data.forEach(element => {
                let elementEndDate = element[Object.keys(element)[Object.keys(element).length - 1]]
                let elementStartDate = element['Start Date'];

                if (elementStartDate?.length == 19) {
                    let splittedElementStartDate = elementStartDate?.split('-');
                    let startDateMonth = splittedElementStartDate[1];
                    let startDateYear = splittedElementStartDate[0];
                    let indexOfElement = allTasks.findIndex(x => x.month == startDateMonth && x.year == startDateYear);
                    if (indexOfElement != -1) {
                        allTasks[indexOfElement].startedTasks++;
                    } else {
                        let task = {
                            year: startDateYear,
                            month: startDateMonth,
                            finishedTasks: 0,
                            startedTasks: 1,
                        };
                        allTasks.push(task);
                    }
                }
                if (elementEndDate?.length == 20) {
                    let splittedElementEndDate = elementEndDate?.split('-');

                    let endDateMonth = splittedElementEndDate[1];
                    let endDateYear = splittedElementEndDate[0];
                    let indexOfElement = allTasks.findIndex(x => x.month == endDateMonth && x.year == endDateYear);
                    if (indexOfElement != -1) {
                        allTasks[indexOfElement].finishedTasks++;
                    }
                }
            })
            allTasks.sort((a, b) => b.year - a.year && a.month - b.month);
            allTasks.map(task => {
                let { year, month, finishedTasks, startedTasks } = task;
                let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                let monthSplitted = 0;
                if (month.startsWith('0')) {
                    monthSplitted = Number(month.replace('0', '')) - 1;
                } else {
                    monthSplitted = Number(month) - 1;

                }
                let dataBody = document.getElementById('data');

                let inProgressBar = document.createElement('div');
                inProgressBar.classList.add('bar');
                inProgressBar.setAttribute('data-percent', `${startedTasks}%`);
                inProgressBar.setAttribute('id', 'inProgress');
                inProgressBar.style.width = `${startedTasks < 8 ? startedTasks * 4.5 : startedTasks * 3}%`

                let inProgressSpan = document.createElement('span');
                inProgressSpan.classList.add('label');
                inProgressSpan.textContent = `${months[monthSplitted]} ${year} (Started)`;

                let inProgressCountSpan = document.createElement('span');
                inProgressCountSpan.classList.add('count');
                inProgressCountSpan.textContent = `${startedTasks}`;

                inProgressBar.appendChild(inProgressSpan);
                inProgressBar.appendChild(inProgressCountSpan);

                let finishedBar = document.createElement('div');
                finishedBar.classList.add('bar');
                finishedBar.setAttribute('data-percent', `${finishedTasks}%`);
                finishedBar.setAttribute('id', 'finished');
                finishedBar.style.width = `${finishedTasks < 8 ? finishedTasks * 4.5 : finishedTasks * 3}%`

                let finishedSpan = document.createElement('span');
                finishedSpan.classList.add('label');
                finishedSpan.textContent = `${months[monthSplitted]} ${year} (Finished)`;

                let finishedCountSpan = document.createElement('span');
                finishedCountSpan.classList.add('count');
                finishedCountSpan.textContent = `${finishedTasks}`;

                finishedBar.appendChild(finishedSpan)
                finishedBar.appendChild(finishedCountSpan)

                dataBody.appendChild(inProgressBar);
                dataBody.appendChild(finishedBar);
            })
        };
        reader.readAsText(input);
    });

    function mainAppController() {
        timeUnitsButton.addEventListener('click', (e) => {
            e.preventDefault();
            const data = localStorage.getItem('data')
            const parsedData = JSON.parse(data);

            const monthButton = document.getElementById('chooseMonthAndYear')
            const dayButton = document.getElementById('chooseDayButton')

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
                    let year = document.getElementById('workYearValue').value;
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    let currentMonth = months[month - 1];
                    parsedData.forEach(element => {
                        let elementEndDate = element[Object.keys(element)[Object.keys(element).length - 1]]
                        let elementStartDate = element['Start Date'];

                        let elementEndDateToDate = elementEndDate?.length == 20 ? new Date(elementEndDate) : undefined;
                        let elementStartDateToDate = elementStartDate?.length == 19 ? new Date(elementStartDate) : undefined;

                        let monthAsNumber = Number(month);
                        let yearAsNumber = Number(year);

                        if (elementEndDateToDate?.getMonth() + 1 == monthAsNumber && elementEndDateToDate?.getFullYear() == yearAsNumber) {
                            if (elementEndDateToDate?.getDay() !== 6 && elementEndDateToDate?.getDay() !== 0) {
                                finishedTasks++;
                            }
                        }
                        if (elementStartDateToDate?.getMonth() + 1 == monthAsNumber && elementEndDateToDate?.getFullYear() == yearAsNumber) {
                            if (elementStartDateToDate?.getDay() !== 6 && elementStartDateToDate?.getDay() !== 0) {
                                startedTasks++;
                            }
                        }
                    })
                    let dataBody = document.getElementById('data');
                    dataBody.innerHTML = '';

                    let inProgressBar = document.createElement('div');
                    inProgressBar.classList.add('bar');
                    inProgressBar.setAttribute('data-percent', `${startedTasks}%`);
                    inProgressBar.setAttribute('id', 'inProgress');
                    inProgressBar.style.width = `${startedTasks <= 8 ? startedTasks * 4.5 : startedTasks * 3}%`

                    let inProgressSpan = document.createElement('span');
                    inProgressSpan.classList.add('label');
                    inProgressSpan.textContent = `${currentMonth} ${year} (Started)`;

                    let inProgressCountSpan = document.createElement('span');
                    inProgressCountSpan.classList.add('count');
                    inProgressCountSpan.textContent = `${startedTasks}`;

                    inProgressBar.appendChild(inProgressSpan);
                    inProgressBar.appendChild(inProgressCountSpan);

                    let finishedBar = document.createElement('div');
                    finishedBar.classList.add('bar');
                    finishedBar.setAttribute('data-percent', `${finishedTasks}%`);
                    finishedBar.setAttribute('id', 'finished');
                    finishedBar.style.width = `${finishedTasks <= 8 ? finishedTasks * 4.5 : finishedTasks * 3}%`

                    let finishedSpan = document.createElement('span');
                    finishedSpan.classList.add('label');
                    finishedSpan.textContent = `${currentMonth} ${year} (Finished)`;

                    let finishedCountSpan = document.createElement('span');
                    finishedCountSpan.classList.add('count');
                    finishedCountSpan.textContent = `${finishedTasks}`;

                    finishedBar.appendChild(finishedSpan)
                    finishedBar.appendChild(finishedCountSpan)

                    dataBody.appendChild(inProgressBar);
                    dataBody.appendChild(finishedBar);
                    finishedTasks = 0;
                    startedTasks = 0;
                })
            } if (value == 'week') {
                let workWeeks = document.getElementById('workWeeks');
                workWeeks.style.display = 'block';
                document.getElementById('workMonhts').style.display = 'none';
                document.getElementById('workDays').style.display = 'none';
                let allTasks = [];
                parsedData.forEach(element => {
                    let elementEndDate = element[Object.keys(element)[Object.keys(element).length - 1]]
                    let elementStartDate = element['Start Date'];

                    if (elementStartDate?.length == 19) {
                        let startDateAsDate = new Date(elementStartDate);
                        if (startDateAsDate?.getDay() !== 6 && startDateAsDate?.getDay() !== 0) {
                            var oneJan = new Date(startDateAsDate.getFullYear(), 0, 1);
                            var numberOfDays = Math.floor((startDateAsDate - oneJan) / (24 * 60 * 60 * 1000));
                            var week = Math.ceil((startDateAsDate.getDay() + 1 + numberOfDays) / 7);
                            let indexOfElement = allTasks.findIndex(x => x.week == week);
                            if (indexOfElement != -1) {
                                allTasks[indexOfElement].startedTasks++;
                            } else {
                                let task = {
                                    week: week,
                                    finishedTasks: 0,
                                    startedTasks: 1,
                                }
                                allTasks.push(task);
                            }
                        }
                    }
                    if (elementEndDate?.length == 20) {
                        let endDateAsDate = new Date(elementEndDate);
                        if (endDateAsDate?.getDay() !== 6 && endDateAsDate?.getDay() !== 0) {
                            var oneJan = new Date(endDateAsDate.getFullYear(), 0, 1);
                            var numberOfDays = Math.floor((endDateAsDate - oneJan) / (24 * 60 * 60 * 1000));
                            var week = Math.ceil((endDateAsDate.getDay() + 1 + numberOfDays) / 7);
                            let indexOfElement = allTasks.findIndex(x => x.week == week);
                            if (indexOfElement != -1) {
                                allTasks[indexOfElement].finishedTasks++;
                            }
                        }
                    }
                })
                allTasks.sort((a, b) => a.week - b.week);
                document.getElementById('data').innerHTML = ''
                allTasks.map(task => {
                    let { week, finishedTasks, startedTasks } = task;

                    let dataBody = document.getElementById('data');

                    let inProgressBar = document.createElement('div');
                    inProgressBar.classList.add('bar');
                    inProgressBar.setAttribute('data-percent', `${startedTasks}%`);
                    inProgressBar.setAttribute('id', 'inProgress');
                    inProgressBar.style.width = `${startedTasks < 3 ? startedTasks * 20 : startedTasks * 12}%`

                    let inProgressSpan = document.createElement('span');
                    inProgressSpan.classList.add('label');
                    inProgressSpan.textContent = `Week: ${week} (Started)`;

                    let inProgressCountSpan = document.createElement('span');
                    inProgressCountSpan.classList.add('count');
                    inProgressCountSpan.textContent = `${startedTasks}`;

                    inProgressBar.appendChild(inProgressSpan);
                    inProgressBar.appendChild(inProgressCountSpan);


                    let finishedBar = document.createElement('div');
                    finishedBar.classList.add('bar');
                    finishedBar.setAttribute('data-percent', `${finishedTasks}%`);
                    finishedBar.setAttribute('id', 'finished');
                    finishedBar.style.width = `${finishedTasks < 3 ? finishedTasks * 20 : finishedTasks * 12}%`

                    let finishedSpan = document.createElement('span');
                    finishedSpan.classList.add('label');
                    finishedSpan.textContent = `Week ${week} (Finished)`;

                    let finishedCountSpan = document.createElement('span');
                    finishedCountSpan.classList.add('count');
                    finishedCountSpan.textContent = `${finishedTasks}`;

                    finishedBar.appendChild(finishedSpan)
                    finishedBar.appendChild(finishedCountSpan)

                    dataBody.appendChild(inProgressBar);
                    dataBody.appendChild(finishedBar);
                })

                let chooseWeeksButton = document.getElementById('chooseWeeksButton');

                chooseWeeksButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    let from = document.getElementById('fromWeek').value

                    let to = document.getElementById('toWeek').value;
                    if (from >= 1 && to <= 52) {
                        let result = allTasks.filter(x => x.week >= Number(from) && x.week <= Number(to));
                        document.getElementById('data').innerHTML = ''
                        result.map(task => {
                            let { week, finishedTasks, startedTasks } = task;

                            let dataBody = document.getElementById('data');
                            let inProgressBar = document.createElement('div');
                            inProgressBar.classList.add('bar');
                            inProgressBar.setAttribute('data-percent', `${startedTasks}%`);
                            inProgressBar.setAttribute('id', 'inProgress');
                            inProgressBar.style.width = `${startedTasks < 3 ? startedTasks * 20 : startedTasks * 12}%`

                            let inProgressSpan = document.createElement('span');
                            inProgressSpan.classList.add('label');
                            inProgressSpan.textContent = `Week: ${week} (Started)`;

                            let inProgressCountSpan = document.createElement('span');
                            inProgressCountSpan.classList.add('count');
                            inProgressCountSpan.textContent = `${startedTasks}`;

                            inProgressBar.appendChild(inProgressSpan);
                            inProgressBar.appendChild(inProgressCountSpan);


                            let finishedBar = document.createElement('div');
                            finishedBar.classList.add('bar');
                            finishedBar.setAttribute('data-percent', `${finishedTasks}%`);
                            finishedBar.setAttribute('id', 'finished');
                            finishedBar.style.width = `${finishedTasks < 3 ? finishedTasks * 20 : finishedTasks * 12}%`

                            let finishedSpan = document.createElement('span');
                            finishedSpan.classList.add('label');
                            finishedSpan.textContent = `Week ${week} (Finished)`;

                            let finishedCountSpan = document.createElement('span');
                            finishedCountSpan.classList.add('count');
                            finishedCountSpan.textContent = `${finishedTasks}`;

                            finishedBar.appendChild(finishedSpan)
                            finishedBar.appendChild(finishedCountSpan)

                            dataBody.appendChild(inProgressBar);
                            dataBody.appendChild(finishedBar);
                        });
                    }
                })
            } if (value == 'day') {
                let workDays = document.getElementById('workDays');
                workDays.style.display = 'block';
                document.getElementById('workMonhts').style.display = 'none';
                document.getElementById('workWeeks').style.display = 'none';

                dayButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    let selectedDay = document.getElementById('selectedDay').value;

                    let selectedDayToDay = new Date(selectedDay);

                    parsedData.forEach(element => {
                        let elementEndDate = element[Object.keys(element)[Object.keys(element).length - 1]]?.split(' ')[0];
                        let elementStartDate = element['Start Date']?.split(' ')[0];

                        let elementEndDateToDate = elementEndDate?.length == 10 ? new Date(elementEndDate) : undefined;
                        let elementStartDateToDate = elementStartDate?.length == 10 ? new Date(elementStartDate) : undefined;

                        if (selectedDayToDay.getTime() === elementStartDateToDate?.getTime()) {
                            if (selectedDayToDay.getDay() !== 6 && selectedDayToDay.getDay() !== 0) {
                                startedTasks++;
                            }
                        }

                        if (selectedDayToDay.getTime() === elementEndDateToDate?.getTime()) {
                            if (selectedDayToDay.getDay() !== 6 && selectedDayToDay.getDay() !== 0) {
                                finishedTasks++;
                            }
                        }
                    })
                    let dataBody = document.getElementById('data');
                    dataBody.innerHTML = '';

                    let inProgressBar = document.createElement('div');
                    inProgressBar.classList.add('bar');
                    inProgressBar.setAttribute('data-percent', `${startedTasks}%`);
                    inProgressBar.setAttribute('id', 'inProgress');
                    inProgressBar.style.width = `${startedTasks * 35}%`

                    let inProgressSpan = document.createElement('span');
                    inProgressSpan.classList.add('label');
                    inProgressSpan.textContent = `${selectedDay} (Started)`;

                    let inProgressCountSpan = document.createElement('span');
                    inProgressCountSpan.classList.add('count');
                    inProgressCountSpan.textContent = `${startedTasks}`;

                    inProgressBar.appendChild(inProgressSpan);
                    inProgressBar.appendChild(inProgressCountSpan);

                    let finishedBar = document.createElement('div');
                    finishedBar.classList.add('bar');
                    finishedBar.setAttribute('data-percent', `${finishedTasks}%`);
                    finishedBar.setAttribute('id', 'finished');
                    finishedBar.style.width = `${finishedTasks * 35}%`

                    let finishedSpan = document.createElement('span');
                    finishedSpan.classList.add('label');
                    finishedSpan.textContent = `${selectedDay} (Finished)`;

                    let finishedCountSpan = document.createElement('span');
                    finishedCountSpan.classList.add('count');
                    finishedCountSpan.textContent = `${finishedTasks}`;

                    finishedBar.appendChild(finishedSpan)
                    finishedBar.appendChild(finishedCountSpan)

                    dataBody.appendChild(inProgressBar);
                    dataBody.appendChild(finishedBar);
                    finishedTasks = 0;
                    startedTasks = 0;
                })
            }
        })
    }

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

    function colorHandler() {
        let finishedValue = document.getElementById('finishedColor').value;
        let inProgressColorValue = document.getElementById('inProgressColor').value;

        let allData = document.getElementById('data');
        let children = allData.childNodes;
        children.forEach(child => {
            if (child.id == 'inProgress') {
                child.style.backgroundColor = inProgressColorValue;
            }
            if (child.id == 'finished') {
                child.style.backgroundColor = finishedValue;
            }
        })
    }
    allTasks = [];
}