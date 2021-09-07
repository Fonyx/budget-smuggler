module.exports = {
    format_time: (date) => {
        return date.toLocaleTimeString();
    },
    format_date: (date) => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${
            new Date(date).getFullYear() + 5
        }`;
    },
    parameterize: (text) => {
        return text.replace(/\s+/g, '-').toLowerCase();
    },
    truncate: (text) => {
        return text.slice(0, 100) + '...'
    },
    uppercase: (text) => {
        return text.toUpperCase();
    }
};