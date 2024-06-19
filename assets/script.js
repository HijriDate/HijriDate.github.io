let dates = null;

function changeLang() {
    let langs = document.querySelector('select.langs');
    let language = langs.value;
    let options = [...langs.options];
    let lang_code = '';
    for (let i = 0; i < options.length; i++) {
        let lang = options[i];
        if (lang.text === language) {
            lang_code = lang.classList[0];
        }
    }

    document.body.setAttribute('lang', lang_code);
    if (isRtl()) {
        document.body.setAttribute('dir', 'rtl');
        document.getElementById('table').setAttribute('dir', 'rtl');
    } else {
        document.body.setAttribute('dir', 'ltr');
        document.getElementById('table').setAttribute('dir', 'ltr');
    }
    render();
}

function getLang() {
    return document.querySelector('body').getAttribute('lang');
}

const rtl_langs = ['ar'];
function isRtl() {
    return rtl_langs.includes(getLang());
}

function getConvertedHijriDate(conv_date) {
    let group = document.querySelector('select.orgs').value;
    let group_data = dates[group];
    let years = Object.getOwnPropertyNames(group_data);
    for (let i = 0; i < years.length; i++) {
        let year_data = group_data[years[i]];
        let months = Object.getOwnPropertyNames(year_data);
        let latest_split = year_data[months[months.length - 1]].split('/');
        let latest = new Date(`${latest_split[1]}/${latest_split[0]}/${latest_split[2]}`);
        latest.setDate(latest.getDate() + 28);

        let next = null;

        if (i < years.length - 1) {
            let next_year = group_data[years[i + 1]];
            let next_months = Object.getOwnPropertyNames(next_year);
            let next_split = next_year[next_months[0]].split('/');
            next = new Date(`${next_split[1]}/${next_split[0]}/${next_split[2]}`);
            next.setDate(next.getDate() - 1);
        }

        let end = i === years.length - 1 ? latest : next;
        let start_split = year_data[months[0]].split('/');
        let start = new Date(`${start_split[1]}/${start_split[0]}/${start_split[2]}`);

        if (conv_date >= start && conv_date <= end) {
            for (let j = 0; j < months.length; j++) {
                let month_start_split = year_data[months[j]].split('/');
                let month_start = new Date(`${month_start_split[1]}/${month_start_split[0]}/${month_start_split[2]}`);
                let month_end = null;

                if (j === months.length - 1) {
                    if (i < years.length - 1) {
                        let next_year = group_data[years[i + 1]];
                        let next_months = Object.getOwnPropertyNames(next_year);
                        let next_year_start = next_year[next_months[0]].split('/');
                        month_end = new Date(`${next_year_start[1]}/${next_year_start[0]}/${next_year_start[2]}`);
                        month_end.setDate(month_end.getDate() - 1);
                    } else {
                        month_end = new Date(month_start);
                        month_end.setDate(month_end.getDate() + 28);
                    }
                } else {
                    let next_month_split = year_data[months[j + 1]].split('/');
                    month_end = new Date(`${next_month_split[1]}/${next_month_split[0]}/${next_month_split[2]}`);
                    month_end.setDate(month_end.getDate() - 1);
                }

                const dayLength = 1000 * 60 * 60 * 24;
                let month_diff = ((month_end.getTime() - month_start.getTime()) / dayLength) + 1;

                conv_date.setHours(0);
                conv_date.setMinutes(0);
                conv_date.setSeconds(0);

                month_start.setHours(0);
                month_start.setMinutes(0);
                month_start.setSeconds(0);

                month_end.setHours(0);
                month_end.setMinutes(0);
                month_end.setSeconds(0);

                if (conv_date >= month_start && conv_date <= month_end) {
                    let diff = Math.round((((conv_date.getTime() - month_start.getTime()) / dayLength)) + 1);
                    let converted = `${getTranslated(getLang(), 'converted')}: ${getNumber(getLang(), diff)} ${getTranslated(getLang(), 'month_names')[j]} ${getNumber(getLang(), years[i])}`;
                    return converted;
                }
            }
        }
    }
}

function convert() {
    let day = document.querySelector('select.day').value;
    let month = document.querySelector('select.month').value;
    let year = document.querySelector('select.year').value;
    let conv_date = new Date(`${month}/${day}/${year}`);
    let conv_text = getConvertedHijriDate(conv_date);
    let converted = document.querySelector('p.converted');
    converted.classList.remove('hidden');
    converted.innerText = conv_text;
}

function getHijriOffset(day, start) {
    let today = new Date();
    let diff = Math.ceil(Math.abs(today - start) / (1000 * 3600 * 24)) - 1;
    if (diff > 30 || today < start) {
        return -1;
    }
    return diff + start.getDay();
}

function getTomorrowOffset(day, start) {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let diff = Math.ceil(Math.abs(tomorrow - start) / (1000 * 3600 * 24)) - 1;
    if (diff > 30 || tomorrow < start) {
        return -1;
    }
    return diff + start.getDay();
}

function removeInline() {
    document.querySelectorAll('.inline').forEach(inline => {
        inline.classList.remove('inline');
    });
}

function showIndicator(indicator) {
    document.querySelectorAll(indicator).forEach(indicated => {
        let lang = indicated.getAttribute('lang');
        //if (lang === getLang() || lang === null) {
        indicated.classList.add('inline');
        //}
    });
}

function highlight(day, start) {
    let cells = document.querySelectorAll('td');
    let before = [...cells].slice(0, day);
    before.forEach(element => {
        element.classList.add('adjacent');
        explain(element);
    });
    let end = 29;
    if (has_thirty) {
        end = 30;
    }
    let after = [...cells].slice(end + day, 42);
    after.forEach(element => {
        element.classList.add('adjacent');
        explain(element);
    });
    let offset = getHijriOffset(day, start);
    if (offset !== -1) {
        let today = cells[offset];
        let tomorrow = cells[offset + 1];
        today.classList.add('today');
        tomorrow.classList.add('tomorrow');
        explain(today);
        explain(tomorrow);
        cells[day + 28].classList.add('observe');
        explain(cells[day + 28]);
    }

    let tom_offset = getTomorrowOffset(day, start);
    if (offset === -1 && tom_offset !== -1) {
        let tomorrow = cells[tom_offset];
        tomorrow.classList.add('tomorrow');
        explain(tomorrow);
        if (tom_offset > 0) {
            cells[tom_offset - 1].classList.add('today');
            explain(cells[tom_offset - 1]);
        }
    }

    let white_days = [...cells].slice(day + 12, day + 15);
    white_days.forEach(white_day => {
        white_day.classList.add('white_day');
        explain(white_day);
    });

    removeInline();
    switch(curr_month) {
        case getTranslated(getLang(), 'month_names')[9]:
            cells[day].classList.add('eid');
            explain(cells[day]);
            showIndicator('#eid');
            break;
        case getTranslated(getLang(), 'month_names')[11]:
            cells[day + 8].classList.add('arafah');
            cells[day + 9].classList.add('eid');
            explain(cells[day + 8]);
            explain(cells[day + 9]);
            showIndicator('#arafah');
            showIndicator('#eid');
            break;
        case getTranslated(getLang(), 'month_names')[0]:
            cells[day + 9].classList.add('ashura');
            cells[day + 8].classList.add('ashura_adjacent');
            cells[day + 10].classList.add('ashura_adjacent');
            explain(cells[day + 8]);
            explain(cells[day + 9]);
            explain(cells[day + 10]);
            showIndicator('#ashura');
            break;
    }
}

function toggleTheme(checked) {
    if (checked) {
        document.body.classList.add("dark");
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem('theme', 'light');
    }
}

function getDayHtml(start, num) {
    let day = new Date(start);
    day.setDate(day.getDate() + num - 1);

    if (isRtl()) {
        return gridjs.html(`<div class="gregorian"><span class="greg_month">${getTranslated(getLang(), 'greg_months')[day.getMonth()]} ${getNumber(getLang(), day.getFullYear())}</span><span class="box day">${getNumber(getLang(), day.getDate())}</span></div><div><span class="hijri_day">${getNumber(getLang(), num)}</span></div>`)
    }

    return gridjs.html(`<div class="gregorian"><span class="box day">${getNumber(getLang(), day.getDate())}</span><span class="greg_month">${getTranslated(getLang(), 'greg_months')[day.getMonth()]} ${getNumber(getLang(), day.getFullYear())}</span></div><div><span class="hijri_day">${getNumber(getLang(), num)}</span></div>`)
}

row_four_end = 0;
function getRow(first, day, row) {
    let current_row = [];
    let row_one_end = 7 - day;
    let num = row - 2;
    let initial = row_one_end + (num * 7) + 1;
    row_four_end = initial + 7;
    for (let i = initial; i < initial + 7; i++) {
        current_row.push(getDayHtml(first, i));
    }

    return current_row;
}

function getRows(first, day) {
    let row_one = [];
    let mth_index = parseInt(getTranslated(getLang(), 'month_names').indexOf(curr_month));
    let group = document.querySelector('select.orgs').value;
    let has_previous = true;
    let year = curr_year;
    if (mth_index > 0) {
        let months = Object.getOwnPropertyNames(dates[group][year]);
        let index = months.indexOf(String(mth_index));
        if (index === -1) {
            has_previous = false;
        }
    } else {
        year = String(parseInt(year) - 1);
        let years = Object.getOwnPropertyNames(dates[group]);
        let index = years.indexOf(year);
        mth_index = '12';
        if (index === -1) {
            has_previous = false;
        }
    }

    let diff = 0;
    let prev = null;
    if (has_previous) {
        document.querySelector('img.back').style.display = 'block';
        let prev_date = dates[group][year][mth_index];
        let prev_split = prev_date.split('/');
        prev = new Date(`${prev_split[1]}/${prev_split[0]}/${prev_split[2]}`);
        let current = dates[group][curr_year][String(getTranslated(getLang(), 'month_names').indexOf(curr_month) + 1)];
        let current_split = current.split('/');
        let current_date = new Date(`${current_split[1]}/${current_split[0]}/${current_split[2]}`);
        diff = Math.round((current_date.getTime() - prev.getTime()) / (1000 * 3600 * 24));
    } else {
        document.querySelector('img.back').style.display = 'none';
    }

    let count = 1 - day;
    for (let i = 0; i < 7; i++) {
        if (day > 0) {
            if (i < day) {
                if (has_previous) {
                    row_one.push(getDayHtml(prev, diff + count));
                    count += 1;
                } else {
                    row_one.push("");
                }
            } else {
                row_one.push(getDayHtml(first, i - day + 1));
            }
        } else {
            row_one = [
                getDayHtml(first, 1),
                getDayHtml(first, 2),
                getDayHtml(first, 3),
                getDayHtml(first, 4),
                getDayHtml(first, 5),
                getDayHtml(first, 6),
                getDayHtml(first, 7)
            ];
            break;
        }
    }

    let row_two = getRow(first, day, 2);
    let row_three = getRow(first, day, 3);
    let row_four = getRow(first, day, 4);
    let row_five = [];
    let empty = gridjs.html(`<div class="gregorian"><span class="box day" style="border: none; color: rgba(0,0,0,0) !important; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">7</span><span class="greg_month" style="color: rgba(0,0,0,0) !important; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">6</span></div><div><span class="hijri_day" style="color: rgba(0,0,0,0) !important; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">5</span></div>`);
    let row_six = [empty];

    for (let i = row_four_end; i < row_four_end + 7; i++) {
        row_five.push(getDayHtml(first, i));
        if (i == 29) {
            break;
        }
    }

    if (has_thirty && back_cycle != 0) {
        if (day !== 6) {
            row_five.push(getDayHtml(first, 30));
        } else {
            row_six[0] = getDayHtml(first, 30);
        }
    }

    if (back_cycle !== 0) {
        let next = null;
        let month = getTranslated(getLang(), 'month_names').indexOf(curr_month) + 1;
        if (month == 12) {
            next = dates[group][(parseInt(curr_year)+1).toString()]["1"];
        } else {
            next = dates[group][curr_year][(month + 1).toString()];
        }

        let next_split = next.split('/');
        let next_date = new Date(`${next_split[1]}/${next_split[0]}/${next_split[2]}`);
        let row_five_offset = 0;
        if (row_five.length !== 7) {
            let len = row_five.length;
            for (let i = row_five.length; i < 7; i++) {
                row_five[i] = getDayHtml(next_date, i - len + 1);
                row_five_offset += 1;
            }
        }

        let row_six_offset = 0;
        if (row_six[0] === empty) {
            row_six[0] = getDayHtml(next_date, row_five_offset + 1);
            row_six_offset += 1;
        }

        for (let i = 1; i < 7; i++) {
            row_six.push(getDayHtml(next_date, row_five_offset + row_six_offset + i));
        }
    }

    return [row_one, row_two, row_three, row_four, row_five, row_six];
}

function explain(td) {
    let explainable = ['today', 'tomorrow', 'white_day', 'observe', 'arafah', 'eid', 'ashura', 'ashura_adjacent'];
    let intersect = explainable.filter(Set.prototype.has, new Set(td.classList));

    let explanation = '';
    for (let i = 0; i < intersect.length; i++) {
        let cls = intersect[i];
        let exp = document.querySelector(`.${cls}_exp`).innerText;
        explanation += `${exp} `;
    }

    if (explanation !== null && explanation.match(/^ *$/) === null) {
        tippy(td, {'content': explanation, 'placement': 'bottom'});
    }
}

let grid = null;
function createGrid(day, start) {
    let rows = getRows(start, day);
    grid = new gridjs.Grid({
        columns: [
            { name: getTranslated(getLang(), 'sun'), width: '5%' },
            { name: getTranslated(getLang(), 'mon'), width: '5%' },
            { name: getTranslated(getLang(), 'tue'), width: '5%' },
            { name: getTranslated(getLang(), 'wed'), width: '5%' },
            { name: getTranslated(getLang(), 'thu'), width: '5%' },
            { name: getTranslated(getLang(), 'fri'), width: '5%' },
            { name: getTranslated(getLang(), 'sat'), width: '5%' }
        ],
        data: rows,
        style: {
            th: {
                'text-align': 'center',
                'width': 'max-content'
            },
            td: {
                'width': '15px'
            }
        }
    }).render(document.getElementById('table'));
    function tableStatesListener(state, prevState) {
        if (prevState.status < state.status) {
            if (prevState.status === 2 && state.status === 3) {
                highlight(curr_day, curr_start);
            }
        }
    }

    grid.config.store.subscribe(tableStatesListener);
}

function setTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem("theme");

    if ((prefersDarkScheme && currentTheme === null) || currentTheme === 'dark') {
        document.getElementById('darkmode-toggle').checked = true;
        document.body.classList.add('dark');
    } else {
        document.getElementById('darkmode-toggle').checked = false;
        document.body.classList.remove('dark');
    }
}

let offset = 0;
let curr_year = null;
let curr_month = null;
let curr_day = 0;
let curr_start = null;
let back_cycle = 0;
function back() {
    offset += 1;
    back_cycle += 1;
    render();
}

function forward() {
    offset -= 1;
    back_cycle -= 1;
    render();
}

let has_thirty = false;
function render() {
    const table = document.getElementById('table');
    setupCalendar(false);
    let rows = getRows(curr_start, curr_day);
    grid.updateConfig({
        columns: [
            { name: getTranslated(getLang(), 'sun'), width: '5%' },
            { name: getTranslated(getLang(), 'mon'), width: '5%' },
            { name: getTranslated(getLang(), 'tue'), width: '5%' },
            { name: getTranslated(getLang(), 'wed'), width: '5%' },
            { name: getTranslated(getLang(), 'thu'), width: '5%' },
            { name: getTranslated(getLang(), 'fri'), width: '5%' },
            { name: getTranslated(getLang(), 'sat'), width: '5%' }
        ],
        data: rows
    }).forceRender();
}

function select() {
    let selected = document.querySelector("select.orgs");
    localStorage.setItem('org', selected.value);
    render();
}

function selectDay() {
}

function getKeys(group_data) {
    let years = Object.getOwnPropertyNames(group_data);
    let count = 0;
    let keys = [];
    for (year of years.reverse()) {
        let months = Object.getOwnPropertyNames(group_data[year]);
        if (count + months.length > offset) {
            keys.push(year);
            let month = months.reverse()[offset - count];
            keys.push(month);
            break;
        }
        count += months.length;
    }

    return keys;
}

function hasThirty(start, next) {
    let start_split = start.split('/');
    let start_date = new Date(`${start_split[1]}/${start_split[0]}/${start_split[2]}`);
    let next_split = next.split('/');
    let next_date = new Date(`${next_split[1]}/${next_split[0]}/${next_split[2]}`);
    let diff = Math.round((next_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24));
    return diff === 30;
}

function getSelected() {
    let select = document.querySelector("select.orgs");
    let selected = localStorage.getItem('org');
    let options = [...select.options].map(x => x.value);
    if (!selected || !options.includes(selected)) {
        selected = options[0];
    } else {
        select.value = selected;
    }

    return selected;
}

function getExtremes() {
    let year_select = document.querySelector('select.year');
    let year = year_select.value;
    let options = [...year_select.options];
    let latest = options[0].value;
    let earliest = options[options.length - 1].value;

    return [year, earliest, latest];
}

function setupMonths() {
    const [year, earliest, latest] = getExtremes();
    let month_select = document.querySelector('select.month');
    month_select.options.length = 0;
    let min = 0;
    let max = 12;

    let group_data = dates[getSelected()];
    if (year === latest) {
        let years = Object.getOwnPropertyNames(group_data);
        let year =  group_data[years[years.length - 1]];
        let months = Object.getOwnPropertyNames(year);
        let month = months[months.length - 1];
        let date = year[month];
        let date_split = date.split('/');
        let date_end = new Date(`${date_split[1]}/${date_split[0]}/${date_split[2]}`);
        date_end.setDate(date_end.getDate() + 28);
        max = date_end.getMonth() + 1;
    }

    if (year === earliest) {
        let years = Object.getOwnPropertyNames(group_data);
        let year =  group_data[years[0]];
        let months = Object.getOwnPropertyNames(year);
        let month = months[0];
        let date = year[month];
        min = parseInt(date.split('/')[1]) - 1;
    }

    for (let i = min; i < max; i++) {
        let option = document.createElement('option');
        let greg_mth = getTranslated(getLang(), 'greg_months_full')[i];
        let en_mth = getTranslated('en', 'greg_months_full')[i];
        option.value = en_mth;
        option.text = greg_mth;
        month_select.options.add(option);
    }

    setupDays();
}

function setupDays() {
    const [year, earliest, latest] = getExtremes();
    let month_select = document.querySelector('select.month');

    let month = getTranslated(getLang(), 'greg_months_full').indexOf(month_select.value);

    let max = 32;
    if ([3, 5, 8, 10].includes(month)) {
        max = 31;
    }

    if (month === 1) {
       let year = parseInt(document.querySelector('select.year').value);
        if (year % 4 === 0 && !(year % 100 === 0 && year % 1000 !== 0)) {
            max = 30;
        }
    }

    let day_select = document.querySelector('select.day');
    day_select.options.length = 0;

    if (year === latest) {
        let months = [...month_select.options];
        let latest_month = months[months.length - 1].value;
        if (month_select.value === latest_month) {
            let org = document.querySelector('select.orgs').value;
            let group_data = dates[org];
            let years = Object.getOwnPropertyNames(group_data);
            let latest_year = years[years.length - 1];
            let year_data = group_data[latest_year];
            let months = Object.getOwnPropertyNames(year_data);
            let latest_month = months[months.length - 1];
            let date_split = year_data[latest_month].split('/');
            let date = new Date(`${date_split[1]}/${date_split[0]}/${date_split[2]}`);
            date.setDate(date.getDate() + 28);
            max = date.getDay() + 1;
        }
    }

    let min = 1;
    if (year === earliest) {
        let months = [...month_select.options];
        let earliest_month = months[0].value;
        if (month_select.value === earliest_month) {
            let org = document.querySelector('select.orgs').value;
            let group_data = dates[org];
            let years = Object.getOwnPropertyNames(group_data);
            let earliest_year = years[0];
            let year_data = group_data[earliest_year];
            let months = Object.getOwnPropertyNames(year_data);
            let earliest_month = months[0];
            let date_split = year_data[earliest_month].split('/');
            let date = new Date(`${date_split[1]}/${date_split[0]}/${date_split[2]}`);
            min = parseInt(date.toDateString().split(' ')[2]);
        }
    }

    for (let i = min; i < max; i++) {
        let option = document.createElement('option');
        let num = getNumber(getLang(), i);
        option.value = i;
        option.text = num;
        day_select.options.add(option);
    }
}

function setupCalendar(initial) {
    let selected = getSelected();
    let group_data = dates[selected];
    let year_list = Object.getOwnPropertyNames(group_data);
    let latest = year_list[year_list.length - 1];
    let earliest = year_list[0];
    let latest_months = Object.getOwnPropertyNames(group_data[latest]);
    let latest_month = latest_months[latest_months.length - 1];
    let latest_split = group_data[latest][latest_month].split('/');
    let latest_date = new Date(`${latest_split[1]}/${latest_split[0]}/${latest_split[2]}`);

    let earliest_months = Object.getOwnPropertyNames(group_data[earliest]);
    let earliest_month = earliest_months[0];
    let earliest_split = group_data[earliest][earliest_month].split('/');
    let earliest_date = new Date(`${earliest_split[1]}/${earliest_split[0]}/${earliest_split[2]}`);

    let year_select = document.querySelector('select.year');
    year_select.options.length = 0;
    for (let i = parseInt(latest_date.getFullYear()); i >= parseInt(earliest_date.getFullYear()); i--) {
        let option = document.createElement('option');
        let num = getNumber(getLang(), i);
        option.value = i;
        option.text = num;
        year_select.options.add(option);
    }

    setupMonths();
    setupDays();

    let keys = getKeys(group_data);
    let name = getTranslated(getLang(), 'month_names')[parseInt(keys[1]) - 1];
    curr_month = name;
    curr_year = keys[0];
    let title = document.querySelector('span.date');
    if (!name) {
        offset = 0;
        setupCalendar(initial);
        return;
    }
    title.innerText = `${name} ${getNumber(getLang(), keys[0])}`;
    let months = group_data[keys[0]];
    let month_keys = Object.getOwnPropertyNames(months);
    let last_month = month_keys[month_keys.length - 1];
    let years = Object.getOwnPropertyNames(group_data);
    let last_year = years[years.length - 1];
    if (keys[1] !== last_month) {
        let start = group_data[keys[0]][keys[1]];
        let next = group_data[keys[0]][(parseInt(keys[1]) + 1).toString()];
        has_thirty = hasThirty(start, next);
    } else if (keys[1] === last_month && keys[0] !== last_year) {
        let next_year = (parseInt(keys[0]) + 1).toString();
        let start = group_data[keys[0]][keys[1]];
        let next = group_data[next_year]['1'];
        has_thirty = hasThirty(start, next);
    }

    let first_day = months[keys[1]];
    let date_split = first_day.split('/');
    let date = new Date(`${date_split[1]}/${date_split[0]}/${date_split[2]}`);
    let day = date.getDay();

    if (offset == 0) {
        document.querySelector('img.forward').style.display = 'none';
    } else {
        document.querySelector('img.forward').style.display = 'block';
    }

    let earliest_year = Object.getOwnPropertyNames(group_data)[0];
    if (keys[0] === earliest_year && keys[1] === "1") {
        document.querySelector('img.back').style.display = 'none';
    } else {
        document.querySelector('img.back').style.display = 'block';
    }

    curr_day = day;
    curr_start = date;

    if (initial) {
        createGrid(day, date);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    setTheme();
    fetch('https://raw.githubusercontent.com/AbdullahM0hamed/HilalMonths/master/hilal-months.json').then(function(response) {
        return response.json();
    }).then(function(data) {
        dates = data;
        groups = data["groups"];
        let select = document.querySelector("select.orgs");
        for (group in groups) {
            org = groups[group];
            var elem = document.createElement("option");
            elem.value = org;
            elem.innerText = org;
            select.appendChild(elem);
        }
        setupCalendar(true);
    }).then(function(err) {
    })
});
