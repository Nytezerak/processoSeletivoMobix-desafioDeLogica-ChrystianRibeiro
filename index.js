// Lendo linhas com node
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("", function(equacao) {

    calc = solveParens(equacao)
    console.log(calc);
    rl.close();

})

rl.on("close", function() {
    process.exit(0);
});


function solveParens(input) {
    if (!/\D/.exec(input)) {
        return input
    }
    
    //Detectando erros de parênteses
    if (input.includes('(') ^ input.includes(')')) {
        console.error(
            'Número irregular de parênteses!',
            'Confirme que todos os grupos estão fechados.'
        )
        process.exit(1)
    }

    //Detectando erros de operadores repetidos
    if (input.match(/[+\-*\/^%]{2,}/)) {
        console.error(
            'Erro de sintaxe!',
            'Confirme que não há operadores repetidos.'
        )
        process.exit(1)
    }


    if (!input.includes('(')) {
        try {
            return calculate(input)
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        }
    }
    
    // Prioridade de parênteses
    const substring = input.replace(/.*\(([^()]+)\).*/, '$1')
    const result = calculate(substring)

    const solved = input.replace(/(.*)\(([^()]+)\)(.*)/, '$1' + result + '$3')

    return solveParens(solved)
}

function calculate(input){
    
    var f = { add : '+'
            , sub : '-' 
            , div : '/'
            , mlt : '*'
            , mod : '%'
            , exp : '^' };
     
    // Criando array de ordem de operação
    f.odo = [ [ [f.exp] ,],
            [ [f.mlt] , [f.div] , [f.mod] ,  ],
            [ [f.add] , [f.sub] ] ];
 
    input = input.replace(/[^0-9%^*\/()\-+.]/g,'');           // Limpeza de caracteres desnecessários
 
    var output;
    for(var i=0, n=f.odo.length; i<n; i++ ){
        
       // Expressão para encontrar números e operadores via regex
       var re = new RegExp('(\\d+\\.?\\d*)([\\'+f.odo[i].join('\\')+'])(\\d+\\.?\\d*)');
       re.lastIndex = 0;                                     // be cautious and reset re start pos
         
       // Loop enquanto houverem cálculos para fazer
       while( re.test(input) ){
          output = calc_internal(RegExp.$1,RegExp.$2,RegExp.$3);
          if (isNaN(output) || !isFinite(output)) return output;   // Saída para o acaso de não ter número como resposta
          input  = input.replace(re,output);
       }
    }
 
    return output;
 
    //Função que recebe parâmetros pelo Regexp, combina a variável de prioridade com a operação e retorna
    //o resultado do cálculo do bloco
    function calc_internal(a,op,b){
       a=a*1; b=b*1;
       switch(op){
          case f.add: return a+b; break;
          case f.sub: return a-b; break;
          case f.div: 
          //Identificando erro de divisão por zero
            if (b === 0) {
                throw new Error('Divisão por zero não permitida!')
            }
            
            return a/b; 
            break;
          case f.mlt: return a*b; break;
          case f.mod: return a%b; break;
          case f.exp: return Math.pow(a,b); break;
          default: null;
       }
    }
 }