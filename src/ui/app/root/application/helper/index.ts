import './filters';
import './directives';

import moment from "moment";

interface FileReaderEventTarget extends EventTarget {
    result: string
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}

interface IResizeImageOptions {
    maxSize: number;
    file: File;
}

export const resizeImage = (settings: IResizeImageOptions) => {
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');

    const resize = () => {
        let width = image.width;
        let height = image.height;

        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL('image/jpeg');
        // return dataURItoBlob(dataUrl);
        return dataUrl;
    };

    return new Promise((ok, no) => {
        if (!file.type.match(/image.*/)) {
            no(new Error('Not an image'));
            return;
        }

        reader.onload = (readerEvent: any) => {
            image.onload = () => ok(resize());
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    })
};

export const newGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const formateDate = (providedDate: Date) => {
    return moment(providedDate).format('YYYY-MM-DD');
}

export const formateDateEx = (providedDate: Date, param: string) => {
    return moment(providedDate).format(param);
}

export const formulateGroup = (value, groupBy, idValue, textValue) => {
    var assingingVariable: Array<any> = [];
    value.forEach(element => {
        if (assingingVariable.findIndex(e => e.text == element[groupBy]) < 0) {
            var childrens: Array<any> = [];
            (value.filter(el => el[groupBy] == element[groupBy])).forEach(fnl => {
                childrens.push({ id: fnl[idValue], text: fnl[textValue] })
            });
            assingingVariable.push({ text: element[groupBy], children: childrens });
        }
    });

    return assingingVariable;
}

export const formulateSingle = (value, idValue, textValue) => {
    var assingingVariable: Array<any> = [];
    // assingingVariable.push({ id: '', text: 'Select' });
    value.forEach(element => {
        assingingVariable.push({ id: element[idValue], text: element[textValue] });
    });
    return assingingVariable;
}

export const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || !rows.length) {
        return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
        keys.join(separator) +
        '\n' +
        rows.map(row => {
            return keys.map(k => {
                let cell = row[k] === null || row[k] === undefined ? '' : row[k];
                cell = cell instanceof Date
                    ? cell.toLocaleString()
                    : cell.toString().replace(/"/g, '""');
                if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(separator);
        }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export const Round = (num, scale) => {
    if (Math.round(num) != num) {
        if (Math.pow(0.1, scale) > num) {
            return 0;
        }
        var sign = Math.sign(num);
        var arr = ("" + Math.abs(num)).split(".");
        if (arr.length > 1) {
            if (arr[1].length > scale) {
                var integ = +arr[0] * Math.pow(10, scale);
                var dec = integ + (+arr[1].slice(0, scale) + Math.pow(10, scale));
                var proc = +arr[1].slice(scale, scale + 1)
                if (proc >= 5) {
                    dec = dec + 1;
                }
                dec = sign * (dec - Math.pow(10, scale)) / Math.pow(10, scale);
                return dec;
            }
        }
    }
    return num;
}