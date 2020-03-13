
function genClassNames() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const classes = [];
    for (let x = 0; x < chars.length; x++) {
        for (let y = 0; y < chars.length; y++) {
            for (let z = 0; z < chars.length; z++) {
                classes.push(chars[x] + chars[y] + chars[z])
            }
        }
    }

    return classes;
}

const classes = genClassNames()
let index = 0;

module.exports = () => classes[index++]