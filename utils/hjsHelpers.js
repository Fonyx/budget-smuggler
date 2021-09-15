module.exports = {
    format_time: (date) => {
        return date.toLocaleTimeString();
    },
    format_date: (date) => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear() + 5
            }`;
    },
    parameterize: (text) => {
        return text.replace(/\s+/g, '-').toLowerCase();
    },
    truncate: (text, limit) => {
        let truncatedText = text;
        // overrule truncatedText if the string is too long
        if(text.length >= limit){
            truncatedText = text.slice(0, limit) + '...'
        } 
        return truncatedText
    },
    uppercase: (text) => {
        return text.toUpperCase();
    },

    daysLeft: (due_date) => {
        console.log(due_date);
        let today = new Date();
        let due_date_time = due_date.getTime();
        let today_time = today.getTime();

        let time_delta = due_date_time - today_time;
        let day_delta = time_delta / (1000 * 60 * 60 * 24);
        return Math.round(day_delta);
    },
    renderTypeToMaterializeTextColor: (type) => {
        if(type === 'income'){
            return 'green-text';
        } else {
            return 'red-text';
        }
    },
    renderTypeToMaterializeColor: (type) => {
        if(type === 'income'){
            return 'green lighten-3';
        } else {
            return 'red lighten-3';
        }
    },
    displayAmountWithTypeSign: (amount, type) => {
        if(type === 'income'){
            return '+'+amount;
        } else {
            return '-'+amount;
        }
    },
    isFrequencyChecked: (transaction, frequency) => {
        if(transaction.frequency === frequency){
            return 'checked="true"'
        } else {
            return 'checked="false"'
        }
    },
    displayBalanceWithDollarSign: (amount) => {
        if(amount >= 0){
            return '$'+amount;
        } else {
            let numeric = parseFloat(amount);
            let absNumeric = Math.abs(numeric);
            return '-$'+absNumeric;
        }
    }

};