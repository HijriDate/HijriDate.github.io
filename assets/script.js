let dates = null;

function toggleTheme(checked) {
    if (checked) {
        document.body.classList.add("dark");
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem('theme', 'light');
    }
}

function getRow(day, row) {
    let current_row = [];
    let row_one_end = 7 - day;
    let num = row - 2;
    let initial = row_one_end + (num * 7) + 1;
    for (let i = initial; i < initial + 7; i++) {
        current_row.push(i);
    }

    return current_row;
}

function getRows(day) {
    let row_one = [];
    for (let i = 0; i < 7; i++) {
        if (day > 0) {
            if (i < day) {
                row_one.push("");
            } else {
                row_one.push(`${i - day + 1}`);
            }
        } else {
            row_one = [1,2,3,4,5,6,7];
            break;
        }
    }

    let row_two = getRow(day, 2);
    let row_three = getRow(day, 3);
    let row_four = getRow(day, 4);
    let row_five = [];
    let start = row_four[row_four.length - 1] + 1;
    for (let i = start; i < start + 7; i++) {
        row_five.push(i);
        if (i == 29) {
            break;
        }
    }

    if (has_thirty) {
        row_five.push('30');
    }
    return [row_one, row_two, row_three, row_four, row_five];
}

let grid = null;
function createGrid(day) {
    grid = new gridjs.Grid({
        columns: [
            { name: "Sun", width: '5%' },
            { name: "Mon", width: '5%' },
            { name: "Tue", width: '5%' },
            { name: "Wed", width: '5%' },
            { name: "Thu", width: '5%' },
            { name: "Fri", width: '5%' },
            { name: "Sat", width: '5%' }
        ],
        data: getRows(day),
        style: {
            th: {
                'text-align': 'center'
            },
            td: {
                'width': '15px'
            }
        }
    }).render(document.getElementById('table'));
}

let month_names = [
    "Muḥarram",
    "Safar",
    "Rabī' Ul-Awwal",
    "Rabī' Uth-Thānī",
    "Jumāda Al-Ūlā",
    "Jumāda Ath-Thānī",
    "Rajab",
    "Sha'bān",
    "Ramaḍan",
    "Shawwāl",
    "Dhul Qa'dah",
    "Dhul Ḥijjah"
]

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
let curr_day = 0;
function back() {
    offset += 1;
    render();
}

function forward() {
    offset -= 1;
    render();
}

let has_thirty = false;
function render() {
    const table = document.getElementById('table');
    setupCalendar(false);
    grid.updateConfig({
        data: getRows(curr_day)
    }).forceRender();
}

function select() {
    let selected = document.querySelector("select.orgs");
    localStorage.setItem('org', selected.value);
    render();
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

function setupCalendar(initial) {
    let select = document.querySelector("select.orgs");
    let selected = localStorage.getItem('org');
    if (!selected) {
        selected = select.value;
    } else {
        select.value = selected;
    }

    let group_data = dates[selected];
    let keys = getKeys(group_data);
    let name = month_names[parseInt(keys[1]) - 1];
    let title = document.querySelector('span.date');
    if (!name) {
        offset = 0;
        setupCalendar(initial);
        return;
    }
    title.innerText = `${name} ${keys[0]}`;
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

    if (initial) {
        createGrid(day);
    } else {
        curr_day = day;
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
