// let b = ''
// for(let i = 0; i<800000000; i++){
//     if(i%100000000==0){
//         b+=' .'
//         process.stdout.write(' .')
//     }
// }

const r = require('readline')

const t = r.createInterface({
    input:process.stdin,
    output:process.stdout
})

t.question('ciao ',l=>console.log(l))