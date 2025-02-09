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
        ],
        'crescent_vis': 'Crescent Visibility ${month} ${year}'
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
        ],
        'crescent_vis': 'Suurtagalnimada Aragtida Bisha ${month} ${year}'
    },
    'ar': {
        'converted': 'محول',
        'sun': 'ح',
        'mon': 'ن',
        'tue': 'ث',
        'wed': 'ر',
        'thu': 'خ',
        'fri': 'ج',
        'sat': 'س',
        'month_names': [
            'محرم',
            'صفر',
            'ربيع الأول',
            'ربيع الثاني',
            'جمادى الأولى',
            'جمادى الثاني',
            'رجب',
            'شعبان',
            'رمضان',
            'شوال',
            'ذو القعدة',
            'ذو الحجة'
        ],
        'greg_months': [
            'ينا',
            'فبر',
            'مار',
            'ابر',
            'ماي',
            'يون',
            'يول',
            'أغس',
            'سِبت',
            'أكت',
            'نوف',
            'ديس'
        ],
        'greg_months_full': [
            'يناير',
            'فبراير',
            'مارس',
            'ابريل',
            'مايو',
            'يونيو',
            'يوليو',
            'اغسطس',
            'سبتمبر',
            'اكتوبر',
            'نوفمبر',
            'ديسمبر'
        ],
        'crescent_vis': 'وضوح الهلال ${month} ${year}'
    }
};

const arabic_nums = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩'
}

function getNumber(lang, num) {
    let original = num.toString();
    if (lang !== 'ar') {
        return original;
    }

    let num_string = '';
    for (let i = 0; i < original.length; i++) {
        let digit = original[i];
        let new_digit = arabic_nums[digit];
        num_string += new_digit;
    }

    return num_string;
}

function getTranslated(lang, key) {
    return languages[lang][key];
}

//text = "Crescent Visibility ${month} ${year}"; json = {"month": "Ramaḍān", "year": 1446}, result = "Crescent Visibility Ramaḍān 1446"
function getTranslatedInterpolated(lang, key, json) {
    const result = getTranslated(lang, key).replace(/\${(.*?)}/g, (match, p1) => {
        return json[p1] !== undefined ? json[p1] : match;
    });
    return result;
}
