const languages = {
    'en': {
        'converted': 'Converted',
        'sun': 'Sun',
        'mon': 'Mon',
        'tue': 'Tue',
        'wed': 'Wed',
        'thu': 'Thu',
        'fri': 'Fri',
        'sat': 'Sat',
        'month_names': [
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
        ],
        'greg_months': [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        'greg_months_full': [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
    },
    'so': {
        'converted': 'Badalan',
        'sun': 'Axa',
        'mon': 'Isn',
        'tue': 'Tal',
        'wed': 'Arb',
        'thu': 'Kha',
        'fri': 'Jam',
        'sat': 'Sab',
        'month_names': [
            "Muxarram",
            "Safar",
            "Rabiicul Awwal",
            "Rabiicu Thaani",
            "Jumaadal Awwal",
            "Jumaada As-Saani",
            "Rajab",
            "Shacbaan",
            "Ramadaan",
            "Shawwaal",
            "Dul Qacda",
            "Dul Xijjo"
        ],
        'greg_months': [
            'Jan',
            'Feb',
            'Maa',
            'Abr',
            'Maay',
            'Jun',
            'Luu',
            'Ago',
            'Sit',
            'Okt',
            'Nof',
            'Dis'
        ],
        'greg_months_full': [
            'Janaayo',
            'Febraayo',
            'Maarso',
            'Abriil',
            'Maayo',
            'Juunyo',
            'Luulyo',
            'Agoosto',
            'Siteember',
            'Oktoobar',
            'Nofeembar',
            'Diseembar'
        ]
    }
};

function getTranslated(lang, key) {
    return languages[lang][key];
}
