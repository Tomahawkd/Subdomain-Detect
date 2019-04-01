const fs = require('fs');

module.exports = {
    readList: (path) => {
        var urlList = [];
        var data = fs.readFileSync(path);
        var current = 0;
        while(current < data.length) {
            var index = data.indexOf('\n', current);
            if (index == -1) break;
            urlList.push(data.slice(current, index));
            current = index + 1;
        }
        return urlList;
    },

    appendData: (name, data) => {
        if (!fs.existsSync("./data/")) fs.mkdirSync("./data");
        fs.appendFileSync("./data/" + name + ".txt", data + "\n");
    }
}