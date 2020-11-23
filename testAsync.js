function loadScript(src){
    return new Promise((resolve, reject) => {
        if (true) resolve('Fichier ' + src + ' bien chargé');
        if (false) reject(new Error('Echec de chargement de ' + src));
    });
}

async function test(){
    try{
        const test1 = await loadScript('boucle.js');
        console.log(test1);
        const test2 = await loadScript('blblbl.js');
        console.log(test2);
        const test3 = await loadScript('cdcdcd.js');
        console.log(test3);
    }catch(err){
        console.log(err);
     
        console.log(err);
    }
}
test();