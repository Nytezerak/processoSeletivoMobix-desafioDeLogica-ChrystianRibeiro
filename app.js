const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Insira uma equação ", function(equacao) {
        calc = eval(equacao)
        console.log(`${calc}`);
        rl.close();
    ;
});

rl.on("close", function() {
    process.exit(0);
});
