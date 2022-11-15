import axios from 'axios';

function GetFromPDF(){
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
    
    function getTextChilds(parent){
        let textHTML = "";
        if(parent.nextElementSibling && parent.nextElementSibling.nodeName != 'H3'){
            textHTML = parent.nextElementSibling.innerText;
            return parent.nextElementSibling.innerText + getTextChilds(parent.nextElementSibling);
        }else{
            return parent.innerText;
        }
    }

    async function getHTMLDocument(){
        console.log('Obtendo html.');
        axios.get('http://localhost:3000/dnd-tools/html/dd-5e-guia-do-mestre-biblioteca-elfica-151-215-v4.html')
        .then(function(res){
            let objItensAll = [];
            const htmlObject = document.createElement('html');
            htmlObject.innerHTML = res.data;
            const containerHTML = htmlObject.querySelector('body').childNodes;
            const textHTML = containerHTML.childNodes;
            let objItens = {
                "title":null,
                "desc":null
            };
            const filterTitle = ["H3"];
            let oldTag = null;
            let cleanHTML = [];
            containerHTML.forEach(element => {
                if(element.nodeName != 'text') cleanHTML.push(element);
            });
            const allTitles = cleanHTML.filter((elem)=>elem.nodeName == 'H3');
            allTitles.forEach(element => {
                if(element.innerText){
                    objItens.title = element.innerText;
                    objItens.desc = getTextChilds(element)
                    objItensAll.push(objItens);
                    objItens = {
                        "title":null,
                        "desc":null
                    };
                }
            })
            // textHTML.forEach(element => {
            //     console.log(element);
            // })
            /*textHTML.forEach(element => {
                if(filterTitle.indexOf(element.tagName) > -1 && element.innerText){
                    objItens.title = element.innerText;
                    oldTag = element.tagName
                }else if(filterTitle.indexOf(element.tagName) === -1 && element.innerText){
                    objItens.desc = objItens.desc ? objItens.desc + element.innerText : element.innerText;
                    //objItens.desc = element.innerText;
                    oldTag = element.tagName
                }
                if(filterTitle.indexOf(oldTag) === -1 && objItens.title && objItens.desc){
                    objItensAll.push(objItens);
                    objItens = {
                        "title":null,
                        "desc":null
                    }
                }
            });*/
            console.log('objItens',objItensAll);
        });
    }   
    getHTMLDocument();
    return(
        <div>
            ola
        </div>
    )
}
export default GetFromPDF;